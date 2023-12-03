#!/usr/bin/env node
const chalk = require("chalk");
const {
  readFile,
  mdLinks,
  validateLinks,
  initializeFetch,
  getFileExtension,
  getAllMdFiles,
} = require("./index");

const filePath = process.argv[2];
const options = process.argv.slice(3);

const hasOption = (option) => options.includes(option);

function formatStatus(status) {
  const statusText = status.toString();
  if (status === 200) {
    return chalk.bgGreen.black(` ${statusText} `);
  } else if (status === 404) {
    return chalk.bgRed.black(` ${statusText} `);
  } else {
    return chalk.bgGray.black(` ${statusText} `);
  }
}

function displayLinkInfo(link) {
  console.log(chalk.bold(link.text));
  console.log(chalk.underline(link.href));
  if (link.statusText) {
    const statusMessage =
      link.statusText.toUpperCase() === "OK"
        ? chalk.green(link.statusText.toUpperCase())
        : chalk.red(link.statusText.toUpperCase());
    console.log(statusMessage + " " + formatStatus(link.status));
  }
}

function processMdFile(mdFilePath) {
  return readFile(mdFilePath).then((data) => {
    const links = mdLinks(data);

    if (links.length === 0) {
      console.log(chalk.yellow(`Este arquivo não possui links: ${mdFilePath}`));
      return;
    }

    if (hasOption("--validate") && hasOption("--stats")) {
      return validateLinks(links).then((validatedLinks) => {
        const totalLinks = validatedLinks.length;
        const uniqueLinks = new Set(validatedLinks.map((link) => link.href))
          .size;
        const brokenLinks = validatedLinks.filter(
          (link) => link.status >= 400
        ).length;
        console.log(chalk.green(`Total: ${totalLinks}`));
        console.log(chalk.blue(`Unique: ${uniqueLinks}`));
        console.log(chalk.red(`Broken: ${brokenLinks}`));
      });
    } else if (hasOption("--validate")) {
      return validateLinks(links).then((validatedLinks) => {
        validatedLinks.forEach(displayLinkInfo);
      });
    } else if (hasOption("--stats")) {
      const totalLinks = links.length;
      const uniqueLinks = new Set(links.map((link) => link.href)).size;
      console.log(chalk.green(`Total: ${totalLinks}`));
      console.log(chalk.blue(`Unique: ${uniqueLinks}`));
    } else {
      links.forEach(displayLinkInfo);
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
    console.error(chalk.red(`Erro: ${err.message}`));
  });
