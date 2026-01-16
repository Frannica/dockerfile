exports.handler = async function () {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://egwalletfinance.com/</loc>
  </url>
</urlset>`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/xml",
    },
    body: xml,
  };
};
