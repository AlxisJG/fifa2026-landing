#!/usr/bin/env node
/**
 * Validates SportMonks WC 2026 env and probes schedule, standings, livescores.
 * Usage: node scripts/validate-sportmonks.mjs
 * Requires: SPORTMONKS_API_TOKEN, SPORTMONKS_SEASON_ID (e.g. 26618), USE_REAL_FOOTBALL_DATA=true
 */

const token = process.env.SPORTMONKS_API_TOKEN;
const seasonId = process.env.SPORTMONKS_SEASON_ID;
const base =
  process.env.SPORTMONKS_BASE_URL?.replace(/\/$/, "") ||
  "https://api.sportmonks.com/v3/football";

if (!token || !seasonId) {
  console.error("Missing SPORTMONKS_API_TOKEN or SPORTMONKS_SEASON_ID");
  process.exit(1);
}

async function probe(label, path, include) {
  const url = new URL(`${base}${path}`);
  url.searchParams.set("api_token", token);
  if (include) url.searchParams.set("include", include);
  const res = await fetch(url);
  const ok = res.ok;
  let count = 0;
  if (ok) {
    const json = await res.json();
    count = Array.isArray(json.data) ? json.data.length : 0;
  }
  console.log(`${ok ? "OK" : "FAIL"} ${label}: ${res.status} (${count} items)`);
  return ok;
}

console.log(`Season ${seasonId} | League 732 (WC 2026)\n`);

const results = await Promise.all([
  probe("Livescores", "/livescores", "participants;state"),
  probe("Standings", `/standings/seasons/${seasonId}`, "participant;group"),
  probe("Schedule", `/schedules/seasons/${seasonId}`)
]);

process.exit(results.every(Boolean) ? 0 : 1);
