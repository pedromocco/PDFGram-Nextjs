import { generatePDF } from "../../../utils/pdfGenerator";
import { ensureDirectoryExists } from "../../../utils/utils";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    const data = req.body;
    const recordsPath = path.join(process.cwd(), "userData", "records");
    ensureDirectoryExists(recordsPath);

    // Generar el PDF
    const { filePath, filename } = await generatePDF(data, recordsPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Archivo no encontrado");
    }

    // Configurar los encabezados para la descarga
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Leer el archivo y enviarlo como respuesta
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Eliminar el archivo después de enviarlo
    fileStream.on("close", () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error al procesar la solicitud");
  }
}