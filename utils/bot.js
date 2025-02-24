const { Telegraf } = require("telegraf");
const fs = require("fs");
const path = require("path");

const bot = new Telegraf(process.env.NEXT_TELEGRAM_BOT_TOKEN);
const chatIdsPath = path.join(process.cwd(), "chatIds.json");

// Cargar IDs de chat desde un archivo
let chatIds = [];
if (fs.existsSync(chatIdsPath)) {
  chatIds = JSON.parse(fs.readFileSync(chatIdsPath));
}

// Comando /start
bot.start((ctx) => {
  const chatId = ctx.chat.id;
  if (!chatIds.includes(chatId)) {
    chatIds.push(chatId);
    fs.writeFileSync(chatIdsPath, JSON.stringify(chatIds));
    ctx.reply("Te has suscrito para recibir el PDF. Usa el comando /leave para darte de baja.");
  } else {
    ctx.reply("Ya estás suscrito para recibir el PDF.");
  }
});

// Comando /leave
bot.command("leave", (ctx) => {
  const chatId = ctx.chat.id;
  chatIds = chatIds.filter((id) => id !== chatId);
  fs.writeFileSync(chatIdsPath, JSON.stringify(chatIds));
  ctx.reply("Te has dado de baja para recibir el PDF.");
});

module.exports = { bot, chatIds };