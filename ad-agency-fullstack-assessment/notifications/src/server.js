import "dotenv/config";
import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
let backendToken = null;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

io.on("connection", (socket) => {
  socket.on("join_campaign", ({ campaign_id }) => {
    socket.join(campaign_id || "all");
  });
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loginToBackend() {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@agency.com", password: "admin123" })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Backend login failed: ${response.status} ${text}`);
  }
  const json = await response.json();
  if (!json?.token) throw new Error("Backend login failed: missing token");
  backendToken = json.token;
}

async function fetchWithRetry(url, options) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await sleep(5000);
    }
  }
  throw lastError;
}

async function checkAlerts(campaign) {
  const alerts = [];
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
  const spendRatio = campaign.budget > 0 ? campaign.spend / campaign.budget : 0;

  const rulesResult = await pool.query(
    "SELECT id, metric, condition, threshold FROM alert_rules WHERE campaign_id = $1",
    [campaign.id]
  );

  for (const rule of rulesResult.rows) {
    if (rule.metric === "ctr" && rule.condition === "below" && ctr < Number(rule.threshold)) {
      alerts.push({ metric: "ctr", ruleId: rule.id, message: `CTR dropped to ${ctr.toFixed(2)}%` });
    }
    if (rule.metric === "spend" && rule.condition === "above") {
      const threshold = Number(rule.threshold);
      const match = threshold <= 1 ? spendRatio > threshold : campaign.spend > threshold;
      if (match) {
        alerts.push({
          metric: "spend",
          ruleId: rule.id,
          message: `Spend reached ${(spendRatio * 100).toFixed(2)}% of budget`
        });
      }
    }
  }
  return alerts;
}

async function pollCampaigns() {
  try {
    console.log("Fetching campaigns from backend...");
    if (!backendToken) {
      await loginToBackend();
    }

    const response = await fetchWithRetry(`${BACKEND_URL}/campaigns?status=active&limit=500`, {
      headers: { Authorization: `Bearer ${backendToken}` }
    });
    if (!response.ok) return;
    const payload = await response.json();
    const campaigns = payload.data || [];

    for (const campaign of campaigns) {
      const alerts = await checkAlerts(campaign);
      for (const alert of alerts) {
        await pool.query(
          `INSERT INTO alert_history (campaign_id, rule_id, message)
           VALUES ($1, $2, $3)`,
          [campaign.id, alert.ruleId, alert.message]
        );

        const event = {
          campaignId: campaign.id,
          campaignName: campaign.name,
          metric: alert.metric,
          message: alert.message,
          timestamp: new Date().toISOString()
        };
        io.to(campaign.id).emit("alert", event);
        io.to("all").emit("alert", event);
      }
    }
  } catch (error) {
    console.error("Notification poll error:", error.message);
    backendToken = null;
  }
}

setInterval(pollCampaigns, 30000);
pollCampaigns();

app.get("/health", (_req, res) => res.json({ status: "ok", service: "notifications" }));

const port = Number(process.env.PORT || 3003);
httpServer.listen(port, () => console.log(`Notifications service listening on ${port}`));

