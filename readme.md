# `export-docusaurus-pdf`

A simple CLI and Node.js library to export a web page or document from a URL into a PDF. Supports custom output paths and optional temporary file cleanup.

------

## Features

- Export any `http`/`https` URL to PDF
- CLI tool (`docexport`) for command-line usage
- Programmatic API (`run` function) for Node.js scripts
- Supports custom output file paths
- Optional cleaning of temporary files
- Cross-platform (macOS, Windows, Linux)
- Works with Node.js 16+

------

## Installation

```
npm install -g export-docusaurus-pdf
```

Or locally:

```
npm install export-docusaurus-pdf
```

------

## CLI Usage

```
docexport <url> [options]
```

### Options

| Option                    | Description                                  |
| ------------------------- | -------------------------------------------- |
| `<url>`                   | The URL of the document to export (required) |
| `-o, --output <filename>` | Output file path (default: `./output.pdf`)   |
| `--no-clean`              | Do not clean temporary files after export    |
| `-V, --version`           | Show the CLI version                         |
| `-h, --help`              | Show help information                        |

### Examples

Export a webpage to the default `output.pdf`:

```
docexport https://example.com
```

Export and specify an output path:

```
docexport https://example.com -o ./out/mydoc.pdf
```

Export without cleaning temporary files:

```
docexport https://example.com --no-clean
```

------

## Programmatic Usage

You can also import the library directly in your Node.js project:

```
import { run } from 'export-docusaurus-pdf/src/exportToPdfForAll.js';

(async () => {
  const url = 'https://example.com';
  const output = './out/mydoc.pdf';
  const clean = true; // set false to keep temporary files

  await run(url, output, clean);
})();
```

> **Note:** Node.js 16+ is recommended.

------

## Development

Clone the repository:

```
git clone https://github.com/yourusername/export-docusaurus-pdf.git
cd export-docusaurus-pdf
npm install
```

Run CLI in development:

```
node ./bin.js https://example.com -o ./out/dev.pdf
```

------

## Notes

- Only `http` and `https` URLs are supported.
- Output directories will be automatically created if they don’t exist.
- Temporary files are cleaned by default unless `--no-clean` is passed.
- CLI version is read from `package.json`.

------

## License

MIT
