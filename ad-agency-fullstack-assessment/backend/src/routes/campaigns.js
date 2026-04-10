import { Router } from "express";
import { z } from "zod";
import pool from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const statusEnum = z.enum(["active", "paused", "completed", "draft"]);
const campaignSchema = z.object({
  name: z.string().min(2),
  client: z.string().min(2),
  status: statusEnum,
  budget: z.number().nonnegative(),
  spend: z.number().nonnegative().default(0),
  impressions: z.number().int().nonnegative().default(0),
  clicks: z.number().int().nonnegative().default(0),
  conversions: z.number().int().nonnegative().default(0)
});

export function campaignRouter(io) {
  const router = Router();
  router.use(requireAuth);

  router.get("/", async (req, res) => {
    try {
      const { status, client, sortBy = "name", order = "asc", page = "1", limit = "10" } = req.query;
      const pageNum = Math.max(1, Number(page) || 1);
      const pageLimit = Math.min(500, Math.max(1, Number(limit) || 10));
      const offset = (pageNum - 1) * pageLimit;

      const sortable = ["id", "name", "client_name", "status", "budget", "spend", "impressions", "clicks", "conversions", "created_at"];
      const safeSort = sortable.includes(String(sortBy)) ? String(sortBy) : "name";
      const safeOrder = String(order).toLowerCase() === "desc" ? "DESC" : "ASC";

      const whereParts = ["deleted_at IS NULL"];
      const values = [];
      if (status) {
        values.push(status);
        whereParts.push(`status = $${values.length}`);
      }
      if (client) {
        values.push(`%${String(client)}%`);
        whereParts.push(`client_name ILIKE $${values.length}`);
      }
      const whereClause = whereParts.join(" AND ");

      const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM campaigns WHERE ${whereClause}`, values);

      values.push(pageLimit);
      values.push(offset);
      const rowsResult = await pool.query(
        `
        SELECT id, name, client_name AS client, status, budget, spend, impressions, clicks, conversions,
          CASE WHEN impressions = 0 THEN 0 ELSE (clicks::numeric / impressions::numeric) * 100 END AS ctr,
          CASE WHEN spend = 0 THEN 0 ELSE conversions::numeric / spend::numeric END AS roas
        FROM campaigns
        WHERE ${whereClause}
        ORDER BY ${safeSort} ${safeOrder}
        LIMIT $${values.length - 1} OFFSET $${values.length}
        `,
        values
      );

      return res.json({ total: countResult.rows[0].total, page: pageNum, limit: pageLimit, data: rowsResult.rows });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const parsed = campaignSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
      const payload = parsed.data;

      const nextIdResult = await pool.query(`
        SELECT 'c' || LPAD((COALESCE(MAX(SUBSTRING(id FROM 2)::int), 0) + 1)::text, 3, '0') AS next_id
        FROM campaigns
      `);
      const id = nextIdResult.rows[0].next_id;

      const insertResult = await pool.query(
        `
        INSERT INTO campaigns (id, name, client_name, status, budget, spend, impressions, clicks, conversions)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING id, name, client_name AS client, status, budget, spend, impressions, clicks, conversions
        `,
        [
          id,
          payload.name,
          payload.client,
          payload.status,
          payload.budget,
          payload.spend,
          payload.impressions,
          payload.clicks,
          payload.conversions
        ]
      );

      io?.emit?.("campaign:created", insertResult.rows[0]);
      return res.status(201).json(insertResult.rows[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const campaignResult = await pool.query(
        `
        SELECT id, name, client_name AS client, status, budget, spend, impressions, clicks, conversions,
          CASE WHEN impressions = 0 THEN 0 ELSE (clicks::numeric / impressions::numeric) * 100 END AS ctr,
          CASE WHEN spend = 0 THEN 0 ELSE conversions::numeric / spend::numeric END AS roas
        FROM campaigns
        WHERE id = $1 AND deleted_at IS NULL
        LIMIT 1
        `,
        [req.params.id]
      );
      const campaign = campaignResult.rows[0];
      if (!campaign) return res.status(404).json({ error: "Campaign not found" });

      const metricsResult = await pool.query(
        `
        SELECT date, impressions, clicks, conversions, spend
        FROM campaign_metrics_daily
        WHERE campaign_id = $1
        ORDER BY date DESC
        LIMIT 30
        `,
        [req.params.id]
      );

      return res.json({ ...campaign, metrics: metricsResult.rows.reverse() });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const parsed = campaignSchema.partial().safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
      const payload = parsed.data;

      const result = await pool.query(
        `
        UPDATE campaigns
        SET name = COALESCE($2, name),
            client_name = COALESCE($3, client_name),
            status = COALESCE($4, status),
            budget = COALESCE($5, budget),
            spend = COALESCE($6, spend),
            impressions = COALESCE($7, impressions),
            clicks = COALESCE($8, clicks),
            conversions = COALESCE($9, conversions)
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, name, client_name AS client, status, budget, spend, impressions, clicks, conversions
        `,
        [
          req.params.id,
          payload.name ?? null,
          payload.client ?? null,
          payload.status ?? null,
          payload.budget ?? null,
          payload.spend ?? null,
          payload.impressions ?? null,
          payload.clicks ?? null,
          payload.conversions ?? null
        ]
      );
      if (!result.rows.length) return res.status(404).json({ error: "Campaign not found" });
      io?.emit?.("campaign:updated", result.rows[0]);
      return res.json(result.rows[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const result = await pool.query(
        "UPDATE campaigns SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id",
        [req.params.id]
      );
      if (!result.rows.length) return res.status(404).json({ error: "Campaign not found" });
      io?.emit?.("campaign:deleted", { id: req.params.id });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}

