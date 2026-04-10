import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

async function callGemini(prompt) {
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

app.get("/health", async (_req, res) => {
  const requestId = crypto.randomUUID();
  try {
    const payload = { requestId, status: "ok", model: "gemini-1.5-flash" };
    console.log({ endpoint: "/health", requestId, response: payload });
    res.json(payload);
  } catch (error) {
    console.error({ endpoint: "/health", requestId, error: error.message });
    res.status(500).json({ requestId, error: "Health check failed" });
  }
});

app.post("/generate/copy", async (req, res) => {
  const requestId = crypto.randomUUID();
  const schema = z.object({
    product: z.string().min(2),
    tone: z.string().min(2),
    platform: z.string().min(2),
    word_limit: z.number().int().min(20)
  });

  try {
    const parsed = schema.parse(req.body);
    console.log({ endpoint: "/generate/copy", requestId, request: parsed });

    let prompt = "";
    if (parsed.word_limit >= 400) {
      prompt = `Return JSON only with keys campaign_title, headlines (array of 3 strings), tone_guide, channels (array of {name,budget_percentage}), visual_direction. Product: ${parsed.product}. Tone: ${parsed.tone}. Platform: ${parsed.platform}.`;
    } else {
      prompt = `Return JSON only with keys headline, body, cta for product ${parsed.product}, tone ${parsed.tone}, platform ${parsed.platform}, max words ${parsed.word_limit}.`;
    }

    const aiPayload = await callGemini(prompt);
    const response = { requestId, ...aiPayload };
    console.log({ endpoint: "/generate/copy", requestId, response });
    res.json(response);
  } catch (error) {
    console.error({ endpoint: "/generate/copy", requestId, error: error.message });
    res.status(400).json({ requestId, error: error.message });
  }
});

app.post("/generate/social", async (req, res) => {
  const requestId = crypto.randomUUID();
  const schema = z.object({
    platform: z.string().min(2),
    campaign_goal: z.string().min(2),
    brand_voice: z.string().min(2)
  });

  try {
    const parsed = schema.parse(req.body);
    console.log({ endpoint: "/generate/social", requestId, request: parsed });
    const prompt = `Return JSON only as { "captions": [5 strings] } for platform ${parsed.platform}, goal ${parsed.campaign_goal}, brand voice ${parsed.brand_voice}.`;
    const aiPayload = await callGemini(prompt);
    const response = { requestId, captions: aiPayload.captions ?? [] };
    console.log({ endpoint: "/generate/social", requestId, response });
    res.json(response);
  } catch (error) {
    console.error({ endpoint: "/generate/social", requestId, error: error.message });
    res.status(400).json({ requestId, error: error.message });
  }
});

app.post("/generate/hashtags", async (req, res) => {
  const requestId = crypto.randomUUID();
  const schema = z.object({
    content: z.string().min(8),
    industry: z.string().min(2)
  });

  try {
    const parsed = schema.parse(req.body);
    console.log({ endpoint: "/generate/hashtags", requestId, request: parsed });
    const prompt = `Return JSON only as { "hashtags": [10 strings] } for content "${parsed.content}" in industry "${parsed.industry}".`;
    const aiPayload = await callGemini(prompt);
    const response = { requestId, hashtags: aiPayload.hashtags ?? [] };
    console.log({ endpoint: "/generate/hashtags", requestId, response });
    res.json(response);
  } catch (error) {
    console.error({ endpoint: "/generate/hashtags", requestId, error: error.message });
    res.status(400).json({ requestId, error: error.message });
  }
});

const port = Number(process.env.PORT || 3002);
app.listen(port, () => {
  console.log(`AI service running on port ${port}`);
});
