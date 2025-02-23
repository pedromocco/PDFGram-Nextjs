import { bot } from "../../../utils/bot";

export default function handler(req, res) {
  bot.launch();
  res.status(200).json({ message: "Bot iniciado correctamente." });
}