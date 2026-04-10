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
    const response = await fetch(`${process.env.BACKEND_URL}/campaigns?status=active&limit=500`, {
      headers: process.env.BACKEND_TOKEN ? { Authorization: `Bearer ${process.env.BACKEND_TOKEN}` } : {}
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
  }
}

setInterval(pollCampaigns, 30000);

app.get("/health", (_req, res) => res.json({ status: "ok", service: "notifications" }));

const port = Number(process.env.PORT || 3003);
httpServer.listen(port, () => console.log(`Notifications service listening on ${port}`));

