# Section 3 Speed Tasks

## Q1 — Debug Express.js API (4 bugs)

### Buggy version
```js
app.post("/campaigns", async (req, res) => {
  const { name, budget } = req.body;
  const result = db.query(`INSERT INTO campaigns (name, budget) VALUES ('${name}', ${budget}) RETURNING *`);
  res.status(200).json(result.rows[0]);
});
```

### Fixed version
```js
app.post("/campaigns", async (req, res) => {
  try {
    const { name, budget } = req.body;
    // Bug 1 fixed: parameterized query prevents SQL injection
    // Bug 3 fixed: await database promise
    const result = await db.query(
      "INSERT INTO campaigns (name, budget) VALUES ($1, $2) RETURNING *",
      [name, budget]
    );
    // Bug 4 fixed: correct status code for creation
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Bug 2 fixed: proper async error handling
    res.status(500).json({ error: error.message });
  }
});
```

## Q2 — `useDebounce` hook + usage

```jsx
import { useEffect, useState } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debouncedValue;
}
```

```jsx
import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

## Q3 — Top 5 campaigns by ROAS per client (last 30 days)

```sql
WITH campaign_roas AS (
  SELECT
    c.client_id,
    c.client_name,
    c.id AS campaign_id,
    c.name AS campaign_name,
    SUM(cmd.conversions)::numeric / NULLIF(SUM(cmd.spend), 0) AS roas
  FROM campaigns c
  JOIN campaign_metrics_daily cmd ON cmd.campaign_id = c.id
  WHERE cmd.date >= CURRENT_DATE - INTERVAL '30 days'
    AND c.deleted_at IS NULL
  GROUP BY c.client_id, c.client_name, c.id, c.name
),
ranked AS (
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY client_id ORDER BY roas DESC NULLS LAST) AS rank_in_client
  FROM campaign_roas
)
SELECT client_name, campaign_id, campaign_name, roas, rank_in_client
FROM ranked
WHERE rank_in_client <= 5
ORDER BY client_name, rank_in_client;
```

## Q4 — React performance optimization

### Slow component (re-renders unnecessarily)
```jsx
function CampaignList({ campaigns, onSelect }) {
  const total = campaigns.reduce((n, c) => n + c.spend, 0);
  return (
    <div>
      <p>Total spend: {total}</p>
      {campaigns.map((c) => (
        <button key={c.id} onClick={() => onSelect(c.id)}>
          {c.name}
        </button>
      ))}
    </div>
  );
}
```

### Optimized version
```jsx
import React, { useCallback, useMemo } from "react";

const CampaignRow = React.memo(function CampaignRow({ campaign, onSelect }) {
  return <button onClick={() => onSelect(campaign.id)}>{campaign.name}</button>;
});

export default function CampaignList({ campaigns, onSelectCampaign }) {
  const total = useMemo(() => campaigns.reduce((n, c) => n + c.spend, 0), [campaigns]);
  const handleSelect = useCallback((id) => onSelectCampaign(id), [onSelectCampaign]);

  return (
    <div>
      <p>Total spend: {total}</p>
      {campaigns.map((campaign) => (
        <CampaignRow key={campaign.id} campaign={campaign} onSelect={handleSelect} />
      ))}
    </div>
  );
}
```

## Q5 — AI scaffolded Express CRUD route

```js
// Scaffolded using Cursor AI in under 10 minutes
import { Router } from "express";
import pool from "../db/pool.js";

const router = Router();

router.get("/", async (_req, res) => {
  const result = await pool.query("SELECT * FROM campaigns WHERE deleted_at IS NULL ORDER BY created_at DESC");
  res.json(result.rows);
});

router.post("/", async (req, res) => {
  const { id, name, status, budget } = req.body;
  const result = await pool.query(
    "INSERT INTO campaigns (id, name, status, budget) VALUES ($1, $2, $3, $4) RETURNING *",
    [id, name, status, budget]
  );
  res.status(201).json(result.rows[0]);
});

router.get("/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM campaigns WHERE id = $1 AND deleted_at IS NULL", [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
});

router.put("/:id", async (req, res) => {
  const { name, status, budget } = req.body;
  const result = await pool.query(
    "UPDATE campaigns SET name = $2, status = $3, budget = $4 WHERE id = $1 RETURNING *",
    [req.params.id, name, status, budget]
  );
  if (!result.rows.length) return res.status(404).json({ error: "Not found" });
  res.json(result.rows[0]);
});

router.delete("/:id", async (req, res) => {
  await pool.query("UPDATE campaigns SET deleted_at = NOW() WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

export default router;
```

