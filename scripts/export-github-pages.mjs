import { spawn } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || process.argv[2];
if (!repo) throw new Error('Informe o nome do repositório.');
const prefix = `/${repo}`;
const port = 3187;
const origin = `http://127.0.0.1:${port}`;
const out = path.resolve('pages-dist');
const routes = ['/', '/loja', '/novidades'];
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { stdio: 'inherit' });
let browser;

try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error('O servidor Next.js encerrou antes de iniciar.');
    try {
      const response = await fetch(`${origin}/api/health`);
      if (response.ok) { ready = true; break; }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  if (!ready) throw new Error('O servidor Next.js não iniciou.');

  if (path.dirname(out) !== process.cwd()) throw new Error('Diretório de saída inválido.');
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await cp('public', out, { recursive: true });
  await cp('.next/static', path.join(out, '_next/static'), { recursive: true });
  await writeFile(path.join(out, '.nojekyll'), '');
  browser = await chromium.launch({ headless: true, ...(process.env.PAGES_BROWSER_CHANNEL ? { channel: process.env.PAGES_BROWSER_CHANNEL } : {}) });

  for (const route of routes) {
    const page = await browser.newPage();
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'load' });
    if (!response?.ok()) throw new Error(`${route}: HTTP ${response?.status()}`);
    await page.waitForFunction(() => {
      const main = document.querySelector('main');
      return main && !main.querySelector('[role="status"]') && main.textContent.trim().length > 80;
    });
    console.log(`Rendered ${route}`);
    let html = await page.content();
    await page.close();
    // Pages cannot execute the server API. Keep the rendered storefront and
    // ordinary document links, without Next's server-dependent hydration.
    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*>/gi, '');
    html = html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${prefix}/`);
    html = html.replace(/\/_next\/image\?url=%2F([^&" ]+)&amp;w=\d+&amp;q=\d+/g, (_, asset) => `${prefix}/${decodeURIComponent(asset)}`);
    html = html.replaceAll('url(/', `url(${prefix}/`).replaceAll("url('/", `url('${prefix}/`).replaceAll('url("/', `url("${prefix}/`);
    const directory = path.join(out, route === '/' ? '' : route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), html);
  }
  const cssDir = path.join(out, '_next/static/css');
  const { readdir } = await import('node:fs/promises');
  for (const file of await readdir(cssDir)) {
    const target = path.join(cssDir, file);
    let css = await readFile(target, 'utf8');
    css = css.replaceAll('url(/', `url(${prefix}/`).replaceAll("url('/", `url('${prefix}/`).replaceAll('url("/', `url("${prefix}/`);
    await writeFile(target, css);
  }
  console.log(`Prepared GitHub Pages at ${out}`);
} finally {
  await browser?.close();
  server.kill();
}
