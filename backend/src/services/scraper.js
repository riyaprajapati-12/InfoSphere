const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

async function extractFullArticle(url) {
  try {
    const response = await fetch(url, {
      headers: {
        // Googlebot User-Agent aksar paywalls aur blocks ko bypass kar deta hai
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Referer": "https://www.google.com/",
        "Accept-Language": "en-US,en;q=0.5",
      }
    });

    if (!response.ok) return null;

    const html = await response.text();
    const dom = new JSDOM(html, { url });
    
    // Unwanted elements ko remove karna (Ads, Scripts, Sidebars)
    const document = dom.window.document;
    document.querySelectorAll("script, style, iframe, ad, noscript, footer, nav").forEach(el => el.remove());

    const reader = new Readability(document);
    const article = reader.parse();

    // Check: Agar content bohot chota hai toh iska matlab scraper block hua hai
    if (!article || article.textContent.length < 350) return null;

    return article.textContent.replace(/\s+/g, " ").trim();
  } catch (err) {
    console.error("Scraper Error:", err.message);
    return null;
  }
}

module.exports = { extractFullArticle };
