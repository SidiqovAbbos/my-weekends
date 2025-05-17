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

  bot.command("help", async (ctx) => {
    const helpText = [
      "*📅 MyWeekendsBot - Помощник по проверке выходных и рабочих дней*",
      "",
      "*Основные команды:*",
      "• /start - Запустить бота и получить приветствие",
      "• /help - Показать это справочное сообщение",
      "• /monthly - Показать календарь текущего месяца",
      "",
      "*Как пользоваться:*",
      "1️⃣ *Проверка конкретной даты:* Просто отправьте дату в формате ДД.ММ или ДД.ММ.ГГГГ, например, `12.06` или `12.06.2024`",
      "2️⃣ *Просмотр месяца:* Используйте команду /monthly чтобы посмотреть все дни текущего месяца",
      "",
      "*Примечание:*",
      "• Выходные дни отмечены иконкой 🎉",
      "• Рабочие дни отмечены иконкой 💼",
      "• Бот поддерживает проверку дат в разных форматах",
    ].join("\n");
    
    await ctx.reply(helpText, { parse_mode: "Markdown" });
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
    `⬅️ ${formatDate(prevDate)}: ${
      isWeekendDay(prevDate) ? messages.dayOff : messages.workDay
    }`,
    `----------------------------`,
    `📅 *${formatDate(date)}: ${
      isWeekendDay(date) ? messages.dayOff : messages.workDay
    } *`,
    `----------------------------`,
    `➡️ ${formatDate(nextDate)}: ${
      isWeekendDay(nextDate) ? messages.dayOff : messages.workDay
    }`,
  ].join("\n");

  await ctx.reply(message, { parse_mode: "Markdown" });
}

async function sendMonthView(ctx: any, date: Date) {
  const monthDates = getMonthDates(date);

  // Get month name and year for the header
  const monthName = date.toLocaleString("ru-RU", { month: "long" });
  const year = date.getFullYear();

  // Create a formatted header
  const header = `📆 *${monthName.toUpperCase()} ${year}*`;

  // Group dates by weeks for better readability
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  monthDates.forEach((d, index) => {
    currentWeek.push(d);

    // Start a new week after Sunday (0) or after the last date
    if (d.getDay() === 0 || index === monthDates.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Format each week
  const formattedWeeks = weeks.map((week) => {
    return week
      .map((d) => {
        const isWeekend = isWeekendDay(d);
        const emoji = isWeekend ? "🎉" : "💼";
        // Add bold formatting for weekends
        const dayText = isWeekend
          ? `*${formatDate(d)}: ${messages.dayOff}*`
          : `${formatDate(d)}: ${messages.workDay}`;

        return `${emoji} ${dayText}`;
      })
      .join("\n");
  });

  // Join all parts with separators
  const message = [
    header,
    "--------------------------------",
    ...formattedWeeks.map((week, i) => `📅 *Неделя ${i + 1}*\n${week}`),
  ].join("\n\n");

  await ctx.reply(message, { parse_mode: "Markdown" });
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
