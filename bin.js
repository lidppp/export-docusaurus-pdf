#!/usr/bin/env node
import { run } from './src/exportToPdfForAll.js'
import cac from "cac";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));

const cli = cac("docexport");

cli
  .command("<url>", "Export document from URL") // <url> = 必填
  .option("-o, --output <filename>", "Output filename (default: ./output.pdf)")
  .option("--no-clean", "Do not clean temporary files")
  .action((url, options) => {
    if (!url) {
      console.error("❌ Missing required argument <url>");
      process.exit(1);
    }

    try {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch (err) {
      console.error("❌ Invalid URL:", url);
      process.exit(1);
    }

    let output = options.output || "./output.pdf";
    output = path.resolve(process.cwd(), output);
    const dir = path.dirname(output);
    fs.mkdirSync(dir, { recursive: true });

    run(url, output, options.clean)

    console.log("Exported to:", output);
  });

cli.help();

cli.version(pkg.version);

cli.parse();

