import { Bot, Keyboard } from "https://deno.land/x/grammy@v1.36.1/mod.ts";
import { isWeekendDay } from "../utils/date-checker.ts";
import { parseDate, formatDate } from "../utils/date-parser.ts";
import { messages } from "../utils/translations.ts";

// Register all command handlers
export function registerCommands(bot: Bot) {
  // Start command with simplified keyboard
  bot.command("start", async (ctx) => {
    const keyboard = new Keyboard().text(messages.week).text(messages.month);

    await ctx.reply(messages.welcome, {
      reply_markup: keyboard,
    });
  });

  // Handle keyboard buttons - only week and month
  bot.hears(messages.week, async (ctx) => {
    await sendWeekView(ctx, new Date());
  });

  bot.hears(messages.month, async (ctx) => {
    await sendMonthView(ctx, new Date());
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

  // Handle unknown commands
  bot.on("message", async (ctx) => {
    if (ctx.message.text?.startsWith("/")) {
      await ctx.reply(messages.unknownCommand);
    }
  });
}

async function sendWeekView(ctx: any, date: Date) {
  const weekDates = getWeekDates(date);
  const message = [messages.weekHeader]
    .concat(
      weekDates.map(
        (d) =>
          `${formatDate(d)}: ${
            isWeekendDay(d) ? messages.dayOff : messages.workDay
          }`
      )
    )
    .join("\n");

  await ctx.reply(message);
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

function getWeekDates(date: Date): Date[] {
  const dates = [];
  const start = new Date(date);
  start.setDate(date.getDate() - 3);

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
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
