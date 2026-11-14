export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return ['', '/loja', '/novidades'].map((path) => ({
    url: base + path,
    lastModified: new Date(),
  }));
}
