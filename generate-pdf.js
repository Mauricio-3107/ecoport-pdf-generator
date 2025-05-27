const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlPath = path.join(__dirname, "cotizacion.html");
  //   const html = fs.readFileSync(htmlPath, "utf8");

  const htmlFileUrl = "file://" + htmlPath;

  // navigate to that file so <img src="logo.png"> will resolve correctly
  await page.goto(htmlFileUrl, { waitUntil: "networkidle0" });

  await page.pdf({
    path: "cotizacion-ecoport.pdf",
    format: "A4",
    printBackground: true,
    // margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
  });

  await browser.close();
  console.log("✅ PDF generated as cotizacion-ecoport.pdf");
})();
