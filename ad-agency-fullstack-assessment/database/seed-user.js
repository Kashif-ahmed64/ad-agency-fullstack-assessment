const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "ad_agency_db",
  user: "postgres",
  password: "1245780"
});

async function seedUser() {
  const hash = await bcrypt.hash("admin123", 10);
  await pool.query(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    ON CONFLICT (email) DO NOTHING
  `,
    ["admin@agency.com", hash]
  );
  console.log("Done. Login: admin@agency.com / admin123");
  await pool.end();
}
seedUser().catch(console.error);

