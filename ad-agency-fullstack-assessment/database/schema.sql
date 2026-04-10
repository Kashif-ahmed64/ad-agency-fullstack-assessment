-- PostgreSQL schema for full-stack advertising agency assessment
-- Requires: PostgreSQL 13+ (gen_random_uuid in core) OR pgcrypto for older versions

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

CREATE INDEX IF NOT EXISTS idx_campaigns_client_id ON campaigns (client_id);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_daily_campaign_id ON campaign_metrics_daily (campaign_id);
CREATE INDEX IF NOT EXISTS idx_alert_rules_campaign_id ON alert_rules (campaign_id);
CREATE INDEX IF NOT EXISTS idx_alert_history_campaign_id ON alert_history (campaign_id);
CREATE INDEX IF NOT EXISTS idx_alert_history_rule_id ON alert_history (rule_id);

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
    'NovaTech',
    'Technology',
    'https://novatech.example.com',
    'NexCore, PulseWare, NovaLabs'
  );

INSERT INTO campaigns (
  id, name, client_id, client_name, status, budget, spend, impressions, clicks, conversions, start_date, end_date
)
VALUES
  ('c001','Lumiere Summer Launch','a0000001-0001-4001-8001-000000000001'::uuid,'Lumiere Skincare','active',50000,32450,2400000,48000,1200,'2026-03-01','2026-03-30'),
  ('c002','Nova Spring Collection','a0000001-0001-4001-8001-000000000002'::uuid,'NovaTech','active',75000,41200,3100000,62000,1860,'2026-03-01','2026-03-30'),
  ('c003','Lumiere Brand Awareness','a0000001-0001-4001-8001-000000000001'::uuid,'Lumiere Skincare','paused',30000,28900,1800000,27000,540,'2026-03-01','2026-03-30'),
  ('c004','NovaTech Product Launch','a0000001-0001-4001-8001-000000000002'::uuid,'NovaTech','completed',100000,98500,5200000,104000,4160,'2026-03-01','2026-03-30'),
  ('c005','Lumiere Holiday Special','a0000001-0001-4001-8001-000000000001'::uuid,'Lumiere Skincare','draft',45000,0,0,0,0,NULL,NULL),
  ('c006','NovaTech Retargeting','a0000001-0001-4001-8001-000000000002'::uuid,'NovaTech','active',25000,12300,980000,19600,588,'2026-03-01','2026-03-30');

INSERT INTO campaign_metrics_daily (campaign_id, date, impressions, clicks, conversions, spend)
SELECT
  c.id,
  d::date,
  GREATEST(0,(c.impressions/30)::bigint),
  GREATEST(0,(c.clicks/30)::bigint),
  GREATEST(0,(c.conversions/30)::int),
  GREATEST(0,ROUND((c.spend::numeric/30.0),2))
FROM campaigns c
CROSS JOIN generate_series('2026-03-01'::date,'2026-03-30'::date,'1 day'::interval) d;

INSERT INTO alert_rules (campaign_id, metric, condition, threshold)
VALUES
  ('c001','ctr','below',1.0000),
  ('c001','spend','above',45000.0000);

