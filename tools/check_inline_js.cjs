#!/usr/bin/env node
// Syntax-only checks for inline and same-origin JavaScript loaded by static HTML pages.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const ignored = new Set([".git", ".github", "node_modules", "vendor", ".venv"]);
const errors = [];
const warnings = [];
const checkedFiles = new Set();

function isInsideRoot(target) {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function checkJavaScript(source, label) {
  try {
    new vm.Script(source, { filename: label });
    checkedFiles.add(label);
  } catch (error) {
    errors.push(label + ": " + error.message);
  }
}

function checkLocalScript(src, attrs, htmlFile) {
  if (/\btype\s*=\s*["']?module/i.test(attrs)) {
    warnings.push(path.relative(root, htmlFile) + ": module script skipped (ES module syntax).");
    return;
  }
  try {
    const basePath = "/" + path.relative(root, htmlFile).split(path.sep).join("/");
    const resolved = new URL(src, "https://local-check.invalid" + basePath);
    if (resolved.origin !== "https://local-check.invalid") return;
    const pathname = decodeURIComponent(resolved.pathname);
    const target = path.resolve(root, "." + pathname);
    if (!isInsideRoot(target)) {
      errors.push(path.relative(root, htmlFile) + ": script path escapes repository root: " + src);
      return;
    }
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      errors.push(path.relative(root, htmlFile) + ": local script not found: " + src);
      return;
    }
    const source = fs.readFileSync(target, "utf8");
    checkJavaScript(source, path.relative(root, target));
  } catch (error) {
    errors.push(path.relative(root, htmlFile) + ": cannot check script " + src + ": " + error.message);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) checkHtml(full);
  }
}

function checkHtml(file) {
  const html = fs.readFileSync(file, "utf8");
  const scriptTag = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let match;
  while ((match = scriptTag.exec(html)) !== null) {
    const attrs = match[1] || "";
    const source = match[2] || "";
    if (/\btype\s*=\s*["']?application\/(?:ld\+json|json)/i.test(attrs)) continue;
    const srcMatch = attrs.match(/\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i);
    if (srcMatch) {
      const src = srcMatch[1] || srcMatch[2] || srcMatch[3] || "";
      checkLocalScript(src, attrs, file);
      continue;
    }
    if (!source.trim()) continue;
    if (/\btype\s*=\s*["']?module/i.test(attrs)) {
      warnings.push(path.relative(root, file) + ": inline module skipped (ES module syntax).");
      continue;
    }
    checkJavaScript(source, path.relative(root, file) + ":inline-script");
  }
}

walk(root);
console.log("Contrôle JavaScript : " + checkedFiles.size + " script(s) distinct(s) analysé(s).");
for (const warning of warnings) console.warn("AVERTISSEMENT: " + warning);
for (const error of errors) console.error("ERREUR: " + error);
if (errors.length) process.exit(1);
console.log("OK : syntaxe des scripts intégrés et scripts locaux référencés valide.");
