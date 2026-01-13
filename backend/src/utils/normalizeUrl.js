// utils/normalizeUrl.js
module.exports = function normalizeUrl(url) {
  return url
    .trim()
    .toLowerCase()
    .replace(/^http:\/\//, "https://")
    .replace(/^https:\/\/www\./, "https://")
    .split("?")[0];
};
