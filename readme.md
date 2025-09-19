# `export-docusaurus-pdf`
[![npm](https://img.shields.io/npm/v/export-docusaurus-pdf?color=brightgreen)](https://www.npmjs.com/package/export-docusaurus-pdf)
[![Node.js](https://img.shields.io/node/v/export-docusaurus-pdf?color=blue)](https://nodejs.org)
[![License](https://img.shields.io/npm/l/export-docusaurus-pdf)](https://github.com/lidppp/export-docusaurus-pdf/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/export-docusaurus-pdf)](https://www.npmjs.com/package/export-docusaurus-pdf)
[![GitHub stars](https://img.shields.io/github/stars/lidppp/export-docusaurus-pdf?style=social)](https://github.com/lidppp/export-docusaurus-pdf)  

A CLI and Node.js tool to export **Docusaurus-generated documentation websites** to PDF.

------

## Features

- Export pages from a Docusaurus site to PDF
- CLI tool (`docexport`) for quick command-line usage
- Node.js API (`run` function) for programmatic use
- Supports custom output file paths
- Optional temporary file cleanup
- URL validation (only `http`/`https`)
- Automatically creates output directories

------

## Installation

Globally:

```
npm install -g export-docusaurus-pdf
```

Locally:

```
npm install export-docusaurus-pdf
```

------

## CLI Usage

```
docexport <url> [options]
```

### Options

| Option                    | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `<url>`                   | URL of your Docusaurus site (required)         |
| `-o, --output <filename>` | Output PDF file path (default: `./output.pdf`) |
| `--no-clean`              | Do not clean temporary files                   |
| `-V, --version`           | Show CLI version                               |
| `-h, --help`              | Show help                                      |

### Examples

Export your Docusaurus site to the default `output.pdf`:

```
docexport http://localhost:3000
```

Export to a custom path:

```
docexport http://localhost:3000 -o ./out/docs.pdf
```

Export without cleaning temporary files:

```
docexport http://localhost:3000 --no-clean
```

------

## Programmatic Usage

```
import { run } from 'export-docusaurus-pdf/src/exportToPdfForAll.js';

(async () => {
  const url = 'http://localhost:3000';
  const output = './out/docs.pdf';
  const clean = true;

  await run(url, output, clean);
})();
```

> **Note:** Only works with Docusaurus-generated documentation. Node.js 16+ is recommended.

------

## Development

```
git clone https://github.com/lidppp/export-docusaurus-pdf.git
cd export-docusaurus-pdf
npm install
node ./bin.js http://localhost:3000 -o ./out/dev.pdf
```

------

## License

MIT
