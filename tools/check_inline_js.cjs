#!/usr/bin/env node
// Syntax-only checks for inline JavaScript in static HTML pages.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const ignored = new Set([".git", ".github", "node_modules", "vendor", ".venv"]);
const errors = [];
let checked = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      checkHtml(full);
    }
  }
}

function checkHtml(file) {
  const html = fs.readFileSync(file, "utf8");
  const scriptTag = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let match;
  while ((match = scriptTag.exec(html)) !== null) {
    const attrs = match[1] || "";
    const source = match[2] || "";
    if (/\bsrc\s*=/i.test(attrs) || !source.trim()) continue;
    if (/\btype\s*=\s*["']?application\/(?:ld\+json|json)/i.test(attrs)) continue;
    if (/\btype\s*=\s*["']?module/i.test(attrs)) {
      console.log("AVERTISSEMENT: script module ignoré par le contrôle CommonJS :", path.relative(root, file));
      continue;
    }
    checked += 1;
    try {
      new vm.Script(source, { filename: path.relative(root, file) + ":inline-script" });
    } catch (error) {
      errors.push(path.relative(root, file) + ": " + error.message);
    }
  }
}

walk(root);
console.log("Contrôle JavaScript : " + checked + " script(s) intégré(s) analysé(s).");
for (const error of errors) console.error("ERREUR: " + error);
if (errors.length) process.exit(1);
console.log("OK : syntaxe des scripts intégrés valide.");
