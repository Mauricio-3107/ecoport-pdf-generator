const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

(async () => {
  // 1. Load & compile your Handlebars template
  const templatePath = path.join(__dirname, "template.html");
  const rawTemplate = fs.readFileSync(templatePath, "utf8");
  const template = Handlebars.compile(rawTemplate);

  // 2. Helper: read an image file and convert to a base64 Data URI
  const toBase64 = (relPath) => {
    const file = fs.readFileSync(path.join(__dirname, relPath));
    const ext = path.extname(relPath).slice(1); // e.g. "png"

    return `data:image/${ext};base64,` + file.toString("base64");
  };

  // 3. Your dynamic data, now including URIs for logo, signature, and stamp
  const data = {
    date: "Santa Cruz, 27 de mayo de 2025",
    quoteNumber: "2025-20",
    clientName: "ELEGANCE S.R.L.",
    serviceDescription: [
      { label: "Origen:", value: "Arica, Chile" },
      { label: "Destino:", value: "Santa Cruz de la Sierra, Bolivia" },
      { label: "Peso de la carga:", value: "60 Tn" },
      { label: "Tipo de carga:", value: "Contenerizada" },
      {
        label: "Detalle de la carga:",
        value: "2 contenedores de 40 pies (2x40’)",
      },
      { label: "Flete unitario:", value: "$ 2.400 por contenedor" },
      { label: "Flete total:", value: "$ 4.800" },
      { label: "Tiempo estimado de tránsito:", value: "5 días" },
      {
        label: "Cotización válida por:",
        value: "5 días calendario desde su emisión",
      },
    ],
    considerations: [
      "Recomendamos realizar el retiro del contenedor lo antes posible…",
      "Nuestra empresa se encargará de devolver el contenedor a tiempo…",
    ],
    signatory: {
      name: "Lic. Omar Ramirez Escobar",
      title: "Gerencia ECOPORT SRL.",
    },

    // **HERE**: inline images as data URIs
    logoURI: toBase64("logo.png"),
    signURI: toBase64("firma.png"),
    stampURI: toBase64("sello.png"),
  };

  // 4. Render the final HTML
  const html = template(data);

  // 5. Fire up Puppeteer and load that HTML
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  // 6. Export PDF
  await page.pdf({
    path: "cotizacion-eco.pdf",
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  console.log("✅ Dynamic PDF with embedded images generated!");
})();
