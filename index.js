const fs = require("fs");

let fetch;

const initializeFetch = new Promise((resolve, reject) => {
  import("node-fetch")
    .then((module) => {
      fetch = module.default;
      resolve();
    })
    .catch(reject);
});

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function extractLinks(data) {
  const regex = /\[(.*?)\]\((http.*?)(?:\s+"(.*?)")?\)/g;
  let match;
  const links = [];

  while ((match = regex.exec(data)) !== null) {
    links.push({
      text: match[1].slice(0, 50),
      href: match[2],
    });
  }

  return links;
}

function validateLinks(links) {
  if (!fetch) {
    return Promise.reject(new Error("fetch não foi inicializado"));
  }

  const validationPromises = links.map((link) => {
    return fetch(link.href)
      .then((response) => {
        console.log(`${link.href} - ${response.status}`);
      })
      .catch((error) => {
        console.error(`Erro ao validar o link ${link.href}: ${error.message}`);
      });
  });

  return Promise.all(validationPromises);
}

module.exports = {
  readFile,
  extractLinks,
  validateLinks,
  initializeFetch,
};
