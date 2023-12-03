const fs = require("fs");
const path = require("path");
const {
  readFile,
  mdLinks,
  validateLinks,
  getFileExtension,
  getAllMdFiles,
} = require("../index");

describe("Testes para a função readFile", () => {
  const testFilePath = path.join(__dirname, "arquivoTeste.txt");
  const testContent = "Conteúdo de teste";

  // Antes de todos os testes, cria um arquivo de teste
  beforeAll(() => {
    fs.writeFileSync(testFilePath, testContent);
  });

  // Após todos os testes, remove o arquivo de teste
  afterAll(() => {
    fs.unlinkSync(testFilePath);
  });

  it("Deve ler o conteúdo de um arquivo existente", () => {
    return readFile(testFilePath).then((data) => {
      expect(data).toBe(testContent);
    });
  });

  it("Deve rejeitar a promessa se o arquivo não existir", () => {
    const nonExistentFilePath = path.join(__dirname, "naoExiste.txt");
    return expect(readFile(nonExistentFilePath)).rejects.toThrow();
  });
});
