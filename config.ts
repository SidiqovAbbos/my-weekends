// Load environment variables
await import("https://deno.land/std@0.208.0/dotenv/load.ts");

// Configuration with defaults and type safety
export const CONFIG = {
  TELEGRAM_BOT_TOKEN: Deno.env.get("TELEGRAM_BOT_TOKEN") || "",
  ENV: Deno.env.get("ENV") || "development",
  WEBHOOK_URL: Deno.env.get("WEBHOOK_URL") || "",
  PORT: parseInt(Deno.env.get("PORT") || "8000"),
  DROP_PENDING_UPDATES: Deno.env.get("DROP_PENDING_UPDATES") === "true",

  // Add more configuration variables as needed
};

// Validate required configuration
if (!CONFIG.TELEGRAM_BOT_TOKEN) {
  console.error("Missing TELEGRAM_BOT_TOKEN in environment variables");
  Deno.exit(1);
}

if (CONFIG.ENV === "production" && !CONFIG.WEBHOOK_URL) {
  console.error("Missing WEBHOOK_URL in production environment");
  Deno.exit(1);
}
