import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const MAX_LINES = 400;
const root = process.cwd();
const ignoredDirectories = new Set(['.git', 'node_modules']);

function listCssFiles(directory) {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      const stat = statSync(path);

      if (stat.isDirectory()) {
        return ignoredDirectories.has(entry) ? [] : listCssFiles(path);
      }

      return entry.endsWith('.css') ? [path] : [];
    });
}

const oversizedFiles = listCssFiles(root)
  .map((file) => {
    const content = readFileSync(file, 'utf8');
    const lines = content.length === 0 ? 0 : content.split(/\r\n|\r|\n/).length;

    return {
      file: relative(root, file),
      lines,
    };
  })
  .filter(({ lines }) => lines > MAX_LINES)
  .sort((a, b) => b.lines - a.lines || a.file.localeCompare(b.file));

const cssImportFiles = listCssFiles(root)
  .map((file) => {
    const content = readFileSync(file, 'utf8');

    return {
      file: relative(root, file),
      hasImport: /^\s*@import\b/m.test(content),
    };
  })
  .filter(({ hasImport }) => hasImport)
  .sort((a, b) => a.file.localeCompare(b.file));

if (oversizedFiles.length > 0) {
  console.error(`CSS files over ${MAX_LINES} lines:`);
  oversizedFiles.forEach(({ file, lines }) => {
    console.error(`- ${file}: ${lines}`);
  });
  process.exit(1);
}

if (cssImportFiles.length > 0) {
  console.error('CSS files containing @import rules:');
  cssImportFiles.forEach(({ file }) => {
    console.error(`- ${file}`);
  });
  process.exit(1);
}

console.log(`All CSS files are at or below ${MAX_LINES} lines.`);
