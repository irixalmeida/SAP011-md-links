const { soma, readFile } = require("./index.js");
const chalk = require("chalk");

const resultado = soma(1, 2);

console.log(chalk.yellow(resultado));

readFile("./test/files/oneFile.md");
