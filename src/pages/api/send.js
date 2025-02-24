import { bot, chatIds } from "../../../utils/bot";
import { generatePDF } from "../../../utils/pdfGenerator";
import { ensureDirectoryExists } from "../../../utils/utils";
import path from "path";
import os from "os";
const fs = require("fs");

function getRecordsPath() {
  if (process.env.NODE_ENV === "production") {
    return path.join(os.tmpdir(), "userData", "records");
  } else {
    return path.join(process.cwd(), "userData", "records");
  }
}

export default async function handler(req, res) {
  try {
    const data = req.body;

    const recordsPath = getRecordsPath();
    ensureDirectoryExists(recordsPath);

    const { filePath, filename } = await generatePDF(data, recordsPath);

    for (const chatId of chatIds) {
      await bot.telegram.sendDocument(chatId, {
        source: filePath,
        filename: filename,
      });
    }

    fs.unlinkSync(filePath);

    res.status(200).json({ success: true, message: "Archivo PDF enviado con éxito" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Error interno: " + error.message });
  }
}