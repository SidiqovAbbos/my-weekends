import { bot, initBot } from "./bot.ts";
import { CONFIG } from "./config.ts";

// Start function with webhook support for production
async function startBot() {
  // Ensure bot is initialized first (critical for webhook mode)
  if (CONFIG.ENV === "production") {
    const initialized = await initBot();
    if (!initialized) {
      throw new Error("Failed to initialize bot");
    }
  }

  if (CONFIG.ENV === "production" && CONFIG.WEBHOOK_URL) {
    // Use webhook in production
    const webhookUrl = `${CONFIG.WEBHOOK_URL}/telegram-webhook`;

    await bot.api.setWebhook(webhookUrl);

    Deno.serve({ port: CONFIG.PORT }, async (req) => {
      if (req.url.endsWith("/telegram-webhook") && req.method === "POST") {
        const update = await req.json();
        await bot.handleUpdate(update);
        return new Response("OK");
      }

      // Health check endpoint for Deno Deploy
      if (req.url.endsWith("/health") || req.url.endsWith("/")) {
        return new Response("Bot is running!", {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }

      return new Response("Not Found", { status: 404 });
    });

    console.log(
      `Bot is running in production mode with webhook at ${webhookUrl}`
    );
  } else {
    // Use long polling in development (will call init automatically)
    await bot.start({
      drop_pending_updates: CONFIG.DROP_PENDING_UPDATES,
      allowed_updates: ["message", "callback_query"],
    });
    console.log("Bot is running in development mode using long polling");
  }
}

// Run bot
if (import.meta.main) {
  try {
    await startBot();
  } catch (error) {
    console.error("Failed to start the bot:", error);

    if (!CONFIG.IS_DENO_DEPLOY) {
      Deno.exit(1);
    }
  }
}
