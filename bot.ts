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

// Register all command handlers
registerCommands(bot);

export { bot };
