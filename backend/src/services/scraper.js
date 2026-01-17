const puppeteer = require('puppeteer');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

async function extractFullArticle(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36');
    
    // NYT jaise sites ke liye wait time zaroori hai
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const html = await page.content();
    
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article || article.textContent.length < 300) return null;
    return article.textContent.replace(/\s+/g, " ").trim();
  } catch (err) {
    console.error("Puppeteer Error:", err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { extractFullArticle };
