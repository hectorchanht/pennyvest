import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default OpenNext Cloudflare config. Pennyvest keeps its data in Neon
// Postgres + OpenRouter/Finnhub/CoinGecko REST APIs, so no D1/KV/R2 bindings
// are needed. Incremental cache: no ISR routes in this app, R2 bucket omitted.
export default defineCloudflareConfig({});
