const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

async function extractFullArticle(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120"
      }
    });

    if (!response.ok) return null;

    const html = await response.text();
    const dom = new JSDOM(html, { url });

    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || article.textContent.length < 500) return null;

    return article.textContent.replace(/\s+/g, " ").trim();
  } catch {
    return null;
  }
}

module.exports = { extractFullArticle };

