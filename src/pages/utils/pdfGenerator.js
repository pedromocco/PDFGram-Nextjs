const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit-table");

const generatePDF = (data, recordsPath) => {
  return new Promise((resolve, reject) => {
    const filename = `Registro de pago movil ${new Date().toISOString().split('T')[0]}.pdf`;
    const filePath = path.join(recordsPath, filename);
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Título del documento
    doc.fontSize(18).text("Registro de Pago Móvil", { align: "center" });
    doc.moveDown();

    // Fecha de creación del archivo
    const creationDate = new Date().toLocaleString("es-VE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    doc.fontSize(12).text(`Fecha de creación: ${creationDate}`, { align: "center" });
    doc.moveDown();

    // Calcular el total de bolívares
    const totalBolivares = data.reduce((sum, pago) => sum + parseFloat(pago.money), 0).toFixed(2);

    // Crear tabla con 3 columnas
    const table = {
      headers: ["Código de referencia", "Bolívares", "Hora"],
      rows: [
        ...data.map((pago) => [pago.ref, pago.money, pago.date]),
        ["Total: ", totalBolivares],
      ],
    };

    const columnWidths = [150, 100, 100];
    const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const tableX = (pageWidth - tableWidth) / 2;

    doc.table(table, {
      columnsSize: columnWidths,
      x: tableX,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
      prepareRow: (row, indexColumn, indexRow, rectRow) => {
        doc.font("Helvetica").fontSize(12);
      },
    });

    doc.end();

    stream.on("finish", () => resolve({ filePath, filename }));
    stream.on("error", (err) => reject(err));
  });
};

module.exports = { generatePDF };