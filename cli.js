#!/usr/bin/env node
const {
  readFile,
  extractLinks,
  validateLinks,
  initializeFetch,
} = require("./index");

const filePath = process.argv[2];

initializeFetch
  .then(() => readFile(filePath))
  .then((data) => {
    const links = extractLinks(data);
    return validateLinks(links);
  })
  .catch((err) => {
    console.error(`Erro: ${err.message}`);
  });
