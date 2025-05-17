import {
  Bot,
  GrammyError,
  HttpError,
} from "https://deno.land/x/grammy@v1.36.1/mod.ts";
import { CONFIG } from "./config.ts";
import { registerCommands } from "./handlers/commands.ts";

// Create bot instance with token from config
const bot = new Bot(CONFIG.TELEGRAM_BOT_TOKEN);

// Error handling middleware
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// Initialize bot function - must be called before using webhooks
export async function initBot() {
  try {
    // Initialize the bot to fetch information about the bot
    await bot.init();
    console.log(`Bot initialized as @${bot.botInfo.username}`);

    // Register all command handlers
    registerCommands(bot);

    return true;
  } catch (error) {
    console.error("Failed to initialize bot:", error);
    return false;
  }
}

// Initialize the bot immediately if in production to handle webhook properly
if (CONFIG.ENV === "production") {
  initBot().catch(console.error);
} else {
  // For development, we'll initialize later when starting with polling
  registerCommands(bot);
}

export { bot };
