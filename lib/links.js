import { pool } from "./db.js";

export function isValidCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

export function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return !!parsed.protocol && !!parsed.hostname;
  } catch {
    return false;
  }
}

export async function getAllLinks() {
  const res = await pool.query(
    "SELECT code, target_url, click_count, last_clicked_at, created_at FROM links ORDER BY created_at DESC"
  );
  return res.rows.map((row) => ({
    code: row.code,
    url: row.target_url,
    clicks: Number(row.click_count) || 0,
    lastClicked: row.last_clicked_at,
    createdAt: row.created_at
  }));
}

export async function getLinkByCode(code) {
  const res = await pool.query(
    "SELECT code, target_url, click_count, last_clicked_at, created_at FROM links WHERE code = $1",
    [code]
  );
  if (res.rowCount === 0) return null;
  const row = res.rows[0];
  return {
    code: row.code,
    url: row.target_url,
    clicks: Number(row.click_count) || 0,
    lastClicked: row.last_clicked_at,
    createdAt: row.created_at
  };
}

export async function createLink({ url, code }) {
  const now = new Date();
  const res = await pool.query(
    "INSERT INTO links (code, target_url, click_count, created_at) VALUES ($1, $2, 0, $3) RETURNING code, target_url, click_count, last_clicked_at, created_at",
    [code, url, now]
  );
  const row = res.rows[0];
  return {
    code: row.code,
    url: row.target_url,
    clicks: Number(row.click_count) || 0,
    lastClicked: row.last_clicked_at,
    createdAt: row.created_at
  };
}

export async function deleteLink(code) {
  const res = await pool.query("DELETE FROM links WHERE code = $1", [code]);
  return res.rowCount > 0;
}

export async function incrementClick(code) {
  const now = new Date();
  const res = await pool.query(
    "UPDATE links SET click_count = click_count + 1, last_clicked_at = $2 WHERE code = $1 RETURNING code, target_url, click_count, last_clicked_at, created_at",
    [code, now]
  );
  if (res.rowCount === 0) return null;
  const row = res.rows[0];
  return {
    code: row.code,
    url: row.target_url,
    clicks: Number(row.click_count) || 0,
    lastClicked: row.last_clicked_at,
    createdAt: row.created_at
  };
}
