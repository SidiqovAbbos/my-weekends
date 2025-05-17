import { Bot } from "https://deno.land/x/grammy@v1.36.1/mod.ts";
import { isWeekendDay } from "../utils/date-checker.ts";
import { parseDate, formatDate } from "../utils/date-parser.ts";
import { messages } from "../utils/translations.ts";

// Register all command handlers
export function registerCommands(bot: Bot) {
  // Start command with simplified keyboard
  bot.command("start", async (ctx) => {
    await ctx.reply(messages.welcome);
  });

  // Add month command
  bot.command("monthly", async (ctx) => {
    await sendMonthView(ctx, new Date());
  });

  // Handle all messages, detect and process dates automatically
  bot.on("message", async (ctx) => {
    if (ctx.message.text?.startsWith("/")) {
      // Handle unknown commands
      await ctx.reply(messages.unknownCommand);
      return;
    }

    if (ctx.message.text) {
      // Try to parse the text as a date
      await processDateCheck(ctx, ctx.message.text);
    }
  });
}

// Helper function to process date checks
async function processDateCheck(ctx: any, dateStr: string) {
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
    `📅 *${formatDate(date)}*: ${isWeekendDay(date) ? "🎉 " + messages.dayOff : "💼 " + messages.workDay}`,
    `-------------------------------------------`,
    `⬅️ ${formatDate(prevDate)}: ${isWeekendDay(prevDate) ? "🎉 " + messages.dayOff : "💼 " + messages.workDay}`,
    `➡️ ${formatDate(nextDate)}: ${isWeekendDay(nextDate) ? "🎉 " + messages.dayOff : "💼 " + messages.workDay}`,
  ].join("\n");

  await ctx.reply(message, { parse_mode: "Markdown" });
}

async function sendMonthView(ctx: any, date: Date) {
  const monthDates = getMonthDates(date);
  const message = [messages.monthHeader]
    .concat(
      monthDates.map(
        (d) =>
          `${formatDate(d)}: ${
            isWeekendDay(d) ? messages.dayOff : messages.workDay
          }`
      )
    )
    .join("\n");

  await ctx.reply(message);
}

function getMonthDates(date: Date): Date[] {
  const dates = [];
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  return dates;
}
