import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const portFilePath = path.join(process.cwd(), "port.txt");
  if (fs.existsSync(portFilePath)) {
    const port = fs.readFileSync(portFilePath, "utf-8");
    res.status(200).json({ port: parseInt(port) });
  } else {
    res.status(404).json({ error: "Archivo de puerto no encontrado" });
  }
}