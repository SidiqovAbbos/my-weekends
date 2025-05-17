// Load environment variables
try {
  await import("https://deno.land/std@0.208.0/dotenv/load.ts");
} catch (error) {
  // Ignore errors when .env file is not present (common in Deno Deploy)
  console.log("No .env file found. Using environment variables from the system.");
}

// Check if running in Deno Deploy
const isDenoDeployRuntime = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

// Configuration with defaults and type safety
export const CONFIG = {
  TELEGRAM_BOT_TOKEN: Deno.env.get("TELEGRAM_BOT_TOKEN") || "",
  ENV: Deno.env.get("ENV") || "development",
  WEBHOOK_URL: Deno.env.get("WEBHOOK_URL") || "",
  PORT: parseInt(Deno.env.get("PORT") || "8000"),
  DROP_PENDING_UPDATES: Deno.env.get("DROP_PENDING_UPDATES") === "true",
  IS_DENO_DEPLOY: isDenoDeployRuntime,
  // Add more configuration variables as needed
};

// Error handling function that doesn't use Deno.exit()
export function validateConfig() {
  const errors = [];

  if (!CONFIG.TELEGRAM_BOT_TOKEN) {
    errors.push("Missing TELEGRAM_BOT_TOKEN in environment variables");
  }

  if (CONFIG.ENV === "production" && !CONFIG.WEBHOOK_URL) {
    errors.push("Missing WEBHOOK_URL in production environment");
  }

  if (errors.length > 0) {
    const errorMessage = `Configuration errors:\n${errors.join('\n')}`;
    if (CONFIG.IS_DENO_DEPLOY) {
      // In Deno Deploy, just throw an error instead of exiting
      throw new Error(errorMessage);
    } else {
      // In local environment, we can use Deno.exit()
      console.error(errorMessage);
      Deno.exit(1);
    }
  }
}

// Validate config but don't exit in Deno Deploy
validateConfig();
