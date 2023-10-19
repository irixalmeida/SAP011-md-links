#!/usr/bin/env node
const { extractLinks } = require("./index");

const args = process.argv.slice(2);
const filePath = args[0];
const options = args.slice(1);

const links = extractLinks(filePath);
links.forEach((link) => {
  console.log(`${link.file} ${link.href} ${link.text}`);
});
