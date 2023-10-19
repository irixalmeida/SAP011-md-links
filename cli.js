#!/usr/bin/env node
//const { soma } = require("./index");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Por favor, forneça um argumento.");
  process.exit(1);
}

switch (args[0]) {
  case "saudacao":
    console.log(`Olá, ${args[1]}!`);
    break;
  case "info":
    console.log("Este é um programa CLI básico.");
    break;
  default:
    console.log("Comando não reconhecido.");
    break;
}

//const { soma, readFile } = require("./index.js");
//const chalk = require("chalk");

//onst resultado = soma(1, 2);

//console.log(chalk.yellow(resultado));

//readFile("./test/files/oneFile.md");
