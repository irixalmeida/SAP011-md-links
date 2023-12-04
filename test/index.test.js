const fetch = require("node-fetch"); // Import the fetch library
const { validateLinks } = require("../index");
const fs = require("fs");
const { readFile } = require("../index");
const { mdLinks } = require("../index");
const { getFileExtension } = require("../index");

jest.mock("fs");

describe("readFile", () => {
  it("deve resolver com uma string vazia para um arquivo vazio", async () => {
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, "");
    });

    await expect(readFile("caminho/para/arquivo/vazio.txt")).resolves.toBe("");
  });

  it("deve rejeitar para um caminho de arquivo inválido", async () => {
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(new Error("Caminho inválido"), null);
    });

    await expect(readFile("caminho/inválido.txt")).rejects.toThrow(
      "Caminho inválido"
    );
  });
});

jest.mock("node-fetch", () => jest.fn());

describe("validateLinks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar uma promessa que resolve para um array de links com as propriedades status e statusText", async () => {
    //Mock a resposta do fetch
    const mockResponse = {
      status: 200,
      ok: true,
    };
    fetch.mockResolvedValue(mockResponse);

    //Define os links de entrada
    const links = [
      { href: "https://example.com" },
      { href: "https://google.com" },
    ];

    // Chama a função validateLinks
    const result = await validateLinks(links);

    // Verifica se o resultado é um array
    expect(result).toEqual([
      { href: "https://example.com", status: 200, statusText: "ok" },
      { href: "https://google.com", status: 200, statusText: "ok" },
    ]);

    //Verifica se o fetch foi chamado com os URLs corretos
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith("https://example.com");
    expect(fetch).toHaveBeenCalledWith("https://google.com");
  });

  it("deve lidar com erros do fetch e retornar links com status ERROR e mensagem de erro", async () => {
    //Mock o erro do fetch
    const mockError = new Error("Network error");
    fetch.mockRejectedValue(mockError);

    // Define os links de entrada
    const links = [
      { href: "https://example.com" },
      { href: "https://google.com" },
    ];

    //Chama a função validateLinks
    const result = await validateLinks(links);

    // Verifica o resultado
    expect(result).toEqual([
      {
        href: "https://example.com",
        status: "ERROR",
        statusText: "Network error",
      },
      {
        href: "https://google.com",
        status: "ERROR",
        statusText: "Network error",
      },
    ]);

    // Verifica se o fetch foi chamado com os URLs corretos
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith("https://example.com");
    expect(fetch).toHaveBeenCalledWith("https://google.com");
  });
});

describe("mdLinks", () => {
  it("deve retornar um array de objetos de link para uma string com links em Markdown", () => {
    const markdown =
      "[Google](https://google.com) e [OpenAI](https://openai.com)";
    const expectedLinks = [
      { text: "Google", href: "https://google.com" },
      { text: "OpenAI", href: "https://openai.com" },
    ];

    expect(mdLinks(markdown)).toEqual(expectedLinks);
  });

  it("deve retornar um array vazio para uma string sem links", () => {
    const text = "Este é um texto sem links.";
    expect(mdLinks(text)).toEqual([]);
  });
});

describe("getFileExtension", () => {
  it("deve retornar a extensão correta do arquivo", () => {
    expect(getFileExtension("documento.md")).toBe(".md");
    expect(getFileExtension("imagem.png")).toBe(".png");
  });

  it("deve retornar uma string vazia para um caminho sem extensão", () => {
    expect(getFileExtension("arquivo")).toBe("");
  });
});
