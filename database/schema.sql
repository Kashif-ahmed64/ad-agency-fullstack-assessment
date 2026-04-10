-- PostgreSQL schema for full-stack advertising agency assessment
-- Requires: PostgreSQL 13+ (gen_random_uuid in core) OR pgcrypto for older versions

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(255),
  website VARCHAR(255),
  key_competitors TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  client_id UUID REFERENCES clients(id),
  client_name VARCHAR(255),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'paused', 'completed', 'draft')),
  budget NUMERIC(12, 2) NOT NULL,
  spend NUMERIC(12, 2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  deleted_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_metrics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id VARCHAR(10) REFERENCES campaigns(id),
  date DATE NOT NULL,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend NUMERIC(12, 2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id VARCHAR(10) REFERENCES campaigns(id),
  metric VARCHAR(50) NOT NULL,
  condition VARCHAR(10) NOT NULL,
  threshold NUMERIC(12, 4) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id VARCHAR(10) REFERENCES campaigns(id),
  rule_id UUID REFERENCES alert_rules(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMP DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- A. Auto-update updated_at on campaigns
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION trg_set_campaigns_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_campaigns_updated_at ON campaigns;
CREATE TRIGGER trg_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE PROCEDURE trg_set_campaigns_updated_at();

-- ---------------------------------------------------------------------------
-- B. Indexes on foreign key columns
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_campaigns_client_id ON campaigns (client_id);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_daily_campaign_id ON campaign_metrics_daily (campaign_id);
CREATE INDEX IF NOT EXISTS idx_alert_rules_campaign_id ON alert_rules (campaign_id);
CREATE INDEX IF NOT EXISTS idx_alert_history_campaign_id ON alert_history (campaign_id);
CREATE INDEX IF NOT EXISTS idx_alert_history_rule_id ON alert_history (rule_id);

-- ---------------------------------------------------------------------------
-- C. Seed data (idempotent: clear assessment seed rows, then insert)
-- ---------------------------------------------------------------------------

DELETE FROM alert_history;
DELETE FROM alert_rules;
DELETE FROM campaign_metrics_daily;
DELETE FROM campaigns;
DELETE FROM clients;

INSERT INTO clients (id, name, industry, website, key_competitors)
VALUES
  (
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Lumiere Skincare',
    'Beauty & Personal Care',
    'https://lumiere-skincare.example.com',
    'GlowCo, PureDerm, SilkSkin Labs'
  ),
  (
    'a0000001-0001-4001-8001-000000000002'::uuid,
    'Nexus Digital',
    'B2B SaaS',
    'https://nexus-digital.example.com',
    'StackPilot, CloudForge, Metricly'
  );

INSERT INTO campaigns (
  id,
  name,
  client_id,
  client_name,
  status,
  budget,
  spend,
  impressions,
  clicks,
  conversions,
  start_date,
  end_date
)
VALUES
  (
    'c001',
    'Lumiere Summer Launch',
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Lumiere Skincare',
    'active',
    50000.00,
    32450.00,
    2400000,
    48000,
    1200,
    '2026-01-15',
    '2026-06-30'
  ),
  (
    'c002',
    'Lumiere Retargeting Q1',
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Lumiere Skincare',
    'paused',
    18000.00,
    11240.50,
    890000,
    22100,
    540,
    '2026-01-01',
    '2026-03-31'
  ),
  (
    'c003',
    'Lumiere Holiday Gift Sets',
    'a0000001-0001-4001-8001-000000000001'::uuid,
    'Lumiere Skincare',
    'completed',
    75000.00,
    74820.00,
    5100000,
    102000,
    3100,
    '2025-11-01',
    '2025-12-31'
  ),
  (
    'c004',
    'Nexus Product Hunt Sprint',
    'a0000001-0001-4001-8001-000000000002'::uuid,
    'Nexus Digital',
    'active',
    42000.00,
    28500.75,
    1200000,
    36000,
    890,
    '2026-02-01',
    '2026-05-15'
  ),
  (
    'c005',
    'Nexus LinkedIn ABM',
    'a0000001-0001-4001-8001-000000000002'::uuid,
    'Nexus Digital',
    'active',
    60000.00,
    40200.00,
    2100000,
    31500,
    420,
    '2026-01-20',
    '2026-07-31'
  ),
  (
    'c006',
    'Nexus Free Trial Push',
    'a0000001-0001-4001-8001-000000000002'::uuid,
    'Nexus Digital',
    'draft',
    25000.00,
    0.00,
    0,
    0,
    0,
    NULL,
    NULL
  );

-- 30 consecutive days of metrics per campaign (deterministic window for charts)
INSERT INTO campaign_metrics_daily (campaign_id, date, impressions, clicks, conversions, spend)
SELECT
  c.id,
  d.dt::date,
  GREATEST(
    0,
    (c.impressions / 30)::bigint
    + ((((hashtext(c.id || d.dt::text) % 20001) - 10000) * (c.impressions / 30 / 100 + 1))::bigint / 1000)
  )::bigint,
  GREATEST(
    0,
    (c.clicks / 30)::bigint
    + ((((hashtext(c.id || 'c' || d.dt::text) % 401) - 200) * (GREATEST(c.clicks, 1) / 30 / 50 + 1))::bigint / 10)
  )::bigint,
  GREATEST(
    0,
    (c.conversions / 30)::integer
    + ((hashtext(c.id || 'v' || d.dt::text) % 7) - 3)
  )::integer,
  GREATEST(
    0::numeric,
    ROUND(
      (c.spend::numeric / 30.0)
      + ((hashtext(c.id || 's' || d.dt::text) % 2001) - 1000) / 100.0,
      2
    )
  )::numeric(12, 2)
FROM campaigns c
CROSS JOIN LATERAL generate_series(
  '2026-03-06'::timestamp,
  '2026-04-04'::timestamp,
  '1 day'::interval
) AS d(dt)
WHERE c.id <> 'c006';

-- Draft campaign c006: zero line (still 30 rows for consistent chart wiring)
INSERT INTO campaign_metrics_daily (campaign_id, date, impressions, clicks, conversions, spend)
SELECT
  'c006',
  d.dt::date,
  0::bigint,
  0::bigint,
  0::integer,
  0::numeric(12, 2)
FROM generate_series(
  '2026-03-06'::timestamp,
  '2026-04-04'::timestamp,
  '1 day'::interval
) AS d(dt);

INSERT INTO alert_rules (id, campaign_id, metric, condition, threshold)
VALUES
  (
    'b0000001-0001-4001-8001-000000000001'::uuid,
    'c001',
    'ctr',
    'below',
    1.0000
  ),
  (
    'b0000001-0001-4001-8001-000000000002'::uuid,
    'c001',
    'spend',
    'above',
    45000.0000
  );
