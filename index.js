const fs = require("fs");
const path = require("path");

let fetch;

// Verifica se estamos em um ambiente de teste
const isTestEnvironment = process.env.NODE_ENV === "test";

if (!isTestEnvironment) {
  const initializeFetch = new Promise((resolve, reject) => {
    import("node-fetch")
      .then((module) => {
        fetch = module.default;
        resolve();
      })
      .catch(reject);
  });

  module.exports.initializeFetch = initializeFetch;
} else {
  // Para ambiente de teste, use require
  fetch = require("node-fetch");
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function mdLinks(data) {
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
  const validationPromises = links.map((link) => {
    return fetch(link.href)
      .then((response) => {
        link.status = response.status;
        link.statusText = response.ok ? "ok" : "fail";
        return link;
      })
      .catch((error) => {
        link.status = "ERROR";
        link.statusText = error.message;
        return link;
      });
  });

  return Promise.all(validationPromises);
}

function getFileExtension(filePath) {
  return path.extname(filePath);
}

function getAllMdFiles(directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  let mdFiles = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      mdFiles = mdFiles.concat(
        getAllMdFiles(path.join(directoryPath, entry.name))
      );
    } else if (path.extname(entry.name) === ".md") {
      mdFiles.push(path.join(directoryPath, entry.name));
    }
  }

  return mdFiles;
}

module.exports = {
  readFile,
  mdLinks,
  validateLinks,
  getFileExtension,
  getAllMdFiles,
};
