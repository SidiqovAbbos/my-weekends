import { Bot } from "https://deno.land/x/grammy@v1.36.1/mod.ts";
import { isWeekendDay } from "../utils/date-checker.ts";
import { parseDate, formatDate } from "../utils/date-parser.ts";
import { messages } from "../utils/translations.ts";

// Register all command handlers
export function registerCommands(bot: Bot) {
  // Start command
  bot.command("start", async (ctx) => {
    await ctx.reply(messages.welcome);
  });

  // Help command
  bot.command("help", async (ctx) => {
    await ctx.reply(messages.help);
  });

  // Check date command
  bot.command("check", async (ctx) => {
    const dateStr = ctx.message?.text.split(" ")[1];
    if (!dateStr) {
      await ctx.reply(messages.provideDateFormat);
      return;
    }

    const date = parseDate(dateStr);
    if (!date) {
      await ctx.reply(messages.invalidDateFormat);
      return;
    }

    // Get surrounding dates
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 1);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const message = [
      `${formatDate(prevDate)}: ${
        isWeekendDay(prevDate) ? messages.dayOff : messages.workDay
      }`,
      `${formatDate(date)}: ${
        isWeekendDay(date) ? messages.dayOff : messages.workDay
      }`,
      `${formatDate(nextDate)}: ${
        isWeekendDay(nextDate) ? messages.dayOff : messages.workDay
      }`,
    ].join("\n");

    await ctx.reply(message);
  });

  // Add more commands here...

  // Handle unknown commands
  bot.on("message", async (ctx) => {
    if (ctx.message.text?.startsWith("/")) {
      await ctx.reply(messages.unknownCommand);
    }
  });
}
