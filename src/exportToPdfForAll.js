import { chromium } from 'playwright';
import path from "path"
import fs from "fs"
import { PDFDocument } from "pdf-lib"

let baseUrl = "";
const randomString = Math.random().toString(36).substring(2, 8);
const tempDir = path.resolve(process.cwd(), `pdfsTemp${randomString}`);
let outputDir = path.resolve(process.cwd());
let outputFileName = "output.pdf"

async function getAllLinks (page) {
  console.log("Wait page load")
  await page.goto(baseUrl)
  await page.waitForTimeout(2000);
  console.log("Page loaded. Get ul tag start.")
  const ulItem = page.locator(".menu__list-item-collapsible")
  const ulCount = await ulItem.count();

  console.log("Get ul tag num: ", ulCount)
  for (let i = 0; i < ulCount; i++) {
    console.log("Click ul tag index: ", i);
    await ulItem.nth(i).click();
    await page.waitForTimeout(500);
  }
  console.log("Ul tag click finish")
  console.log("Get page hrefs start")
  let hrefs = await page.$$eval('.theme-doc-sidebar-item-link a', as => as.map(a => a.href));

  console.log("Get page hrefs finish", hrefs);
  return hrefs
}

async function exportPdfToTempDir (page, paths) {
  const outputDir = tempDir;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const exportFiles = []
  for (let i = 0; i < paths.length; i++) {
    const item = {
      fileName: `${i}.pdf`,
      url: paths[i]
    }
    console.log(`Export [${item.url}] start`);
    await page.goto(item.url, { waitUntil: 'networkidle' });
    console.log(`Go Page [${item.url}] successful`);
    const height = await page.evaluate(() =>
      document.querySelector("#__docusaurus_skipToContent_fallback").offsetHeight + 60
    );

    const outputPath = path.join(outputDir, item.fileName);
    await page.pdf({
      path: outputPath,
      // format: 'A4',
      // margin: {
      //   top: "0.4in",
      //   left: "0.4in",
      //   right: "0.4in",
      //   bottom: "0.4in",
      // },
      width: '800px',
      height: `${height}px`,
      margin: {
        top: "40px",
        left: "40px",
        right: "40px",
        bottom: "0",
      },
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
    console.log(`Export [${item.url}] Successful!`);
    exportFiles.push(outputPath)
  }
  return exportFiles
}

async function mergePDF (sourceFiles) {
  console.log("Merge PDF Start");
  const pdfDoc = await PDFDocument.create()
  for (let i = 0; i < sourceFiles.length; i++) {
    const localPath = sourceFiles[i]
    const PDFItem = await PDFDocument.load(fs.readFileSync(localPath))
    // for(let j = 0;j<PDFItem.getPageCount();j++) {
    //   const [PDFPageItem] = await pdfDoc.copyPages(PDFItem, [j])
    //   pdfDoc.addPage(PDFPageItem)
    // }
    const copiedPages = await pdfDoc.copyPages(PDFItem, PDFItem.getPageIndices());
    copiedPages.forEach(page => pdfDoc.addPage(page));
  }
  const pdfBytes = await pdfDoc.save()

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputFile = path.join(outputDir, outputFileName)
  fs.writeFileSync(outputFile, pdfBytes)
  console.log("Merge PDF Successful, Output file: ", outputFile);

}

function clearTempFiles () {
  console.log("Remove temp files start")
  fs.rmSync(tempDir, { recursive: true, force: true })
  console.log("Remove temp files successful")
}


export async function run (url, _outputDir = "./output.pdf", needClean = true) {
  baseUrl = url;
  outputDir = path.resolve(process.cwd(), path.dirname(_outputDir));
  outputFileName = path.basename(_outputDir)
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 720 / 0.75 + 300, height: 400 }
  });
  try {
    const page = await context.newPage();
    console.log(`Check Docusaurus is running: ${baseUrl}`);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
    console.log('Docusaurus is running');
    console.log('---------------------');
    const links = await getAllLinks(page)
    const tmpFilesPath = await exportPdfToTempDir(page, links)
    await mergePDF(tmpFilesPath)
    if (needClean) {
      clearTempFiles()
    }
  } catch (err) {
    console.error('Export failed: \n', err);
    process.exitCode = 1;
  } finally {
    console.log('Closing browser...');
    await browser.close();
  }
}

