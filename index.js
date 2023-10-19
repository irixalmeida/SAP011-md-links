const fs = require("fs");

function extractLinks(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const regex = /\[(.*?)\]\((http.*?)(?:\s+"(.*?)")?\)/g;
  let match;
  const links = [];

  while ((match = regex.exec(content))) {
    links.push({
      href: match[2],
      text: match[1].substring(0, 50),
      file: filePath,
    });
  }

  return links;
}

module.exports = { extractLinks };
