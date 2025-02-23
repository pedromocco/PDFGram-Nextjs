const { Telegraf } = require("telegraf");
const fs = require("fs");
const path = require("path");

const apikey = "7577316024:AAFN_xEGFHIoZF23ZNoIAwyu_92YOAa6PC8"
const bot = new Telegraf(apikey);
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
    ctx.reply("Te has suscrito para recibir el PDF.");
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