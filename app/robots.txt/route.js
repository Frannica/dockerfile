export async function GET() {
  const txt = `User-agent: *
Allow: /

Sitemap: https://egwalletfinance.com/sitemap.xml
`;

  return new Response(txt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
