#!/usr/bin/env node
const {
  readFile,
  extractLinks,
  validateLinks,
  initializeFetch,
  getFileExtension,
  getAllMdFiles,
} = require("./index");

const filePath = process.argv[2];
const options = process.argv.slice(3);

const hasOption = (option) => options.includes(option);

function processMdFile(mdFilePath) {
  return readFile(mdFilePath).then((data) => {
    const links = extractLinks(data);

    if (hasOption("--validate") && hasOption("--stats")) {
      return validateLinks(links).then((validatedLinks) => {
        const totalLinks = validatedLinks.length;
        const uniqueLinks = new Set(validatedLinks.map((link) => link.href))
          .size;
        const brokenLinks = validatedLinks.filter(
          (link) => link.status >= 400
        ).length;
        console.log(`Total: ${totalLinks}`);
        console.log(`Unique: ${uniqueLinks}`);
        console.log(`Broken: ${brokenLinks}`);
      });
    } else if (hasOption("--validate")) {
      return validateLinks(links).then((validatedLinks) => {
        validatedLinks.forEach((link) => {
          console.log(
            `${mdFilePath} ${link.href} ${link.statusText} ${link.status} ${link.text}`
          );
        });
      });
    } else if (hasOption("--stats")) {
      const totalLinks = links.length;
      const uniqueLinks = new Set(links.map((link) => link.href)).size;
      console.log(`Total: ${totalLinks}`);
      console.log(`Unique: ${uniqueLinks}`);
    } else {
      links.forEach((link) => {
        console.log(`${mdFilePath} ${link.href} ${link.text}`);
      });
    }
  });
}

initializeFetch
  .then(() => {
    if (getFileExtension(filePath) === ".md") {
      return processMdFile(filePath);
    } else {
      const mdFiles = getAllMdFiles(filePath);
      const promises = mdFiles.map((mdFile) => processMdFile(mdFile));
      return Promise.all(promises);
    }
  })
  .catch((err) => {
    console.error(`Erro: ${err.message}`);
  });
