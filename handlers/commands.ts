import { Bot, Context } from "https://deno.land/x/grammy@v1.36.1/mod.ts";

// Register all command handlers
export function registerCommands(bot: Bot) {
  // Start command
  bot.command("start", async (ctx) => {
    await ctx.reply("Welcome to MyWeekendsBot! 👋 How can I help you today?");
  });

  // Help command
  bot.command("help", async (ctx) => {
    await ctx.reply(
      "Available commands:\n" +
        "/start - Start the bot\n" +
        "/help - Show this help message"
    );
  });

  // Add more commands here...

  // Handle unknown commands
  bot.on("message", async (ctx) => {
    if (ctx.message.text?.startsWith("/")) {
      await ctx.reply("Unknown command. Type /help to see available commands.");
    }
  });
}
