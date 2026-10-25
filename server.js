const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Route mapping table for clean URLs
const ROUTE_ALIASES = {
  '/': '/index.html',
  '/home': '/index.html',
  '/index': '/index.html',
  '/report': '/report.html',
  '/track': '/track.html',
  '/verify': '/verify.html',
  '/leaderboard': '/leaderboard.html',
  '/ranks': '/leaderboard.html',
  '/badges': '/leaderboard.html',
  '/admin': '/admin.html',
  '/login': '/admin-login.html',
  '/admin-login': '/admin-login.html',
  '/mcd': '/admin-mcd.html',
  '/pwd': '/admin-pwd.html',
  '/djb': '/admin-djb.html',
  '/dda': '/admin-dda.html'
};

function serveNotFound(res, requestedUrl) {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found | CivicConnect Delhi</title>
  <link rel="stylesheet" href="/css/style.css">
  <style>
    .not-found-card {
      max-width: 580px;
      margin: 4rem auto;
      padding: 3rem 2rem;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      text-align: center;
      box-shadow: var(--shadow-md);
    }
    .quick-links-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: 1.5rem;
      text-align: left;
    }
    .quick-link-item {
      padding: 0.75rem 1rem;
      background: var(--bg-subtle);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: var(--text-dark);
      transition: var(--transition);
    }
    .quick-link-item:hover {
      background: var(--primary-light);
      border-color: var(--primary);
      text-decoration: none;
    }
  </style>
</head>
<body style="background: var(--bg-subtle);">
  <div class="container">
    <div class="not-found-card">
      <div style="font-size: 3rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">404</div>
      <h1 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Page Not Found</h1>
      <p style="color: var(--text-body); font-size: 0.95rem;">
        The requested URL <code>${requestedUrl}</code> was not found on CivicConnect Delhi.
      </p>
      
      <div class="quick-links-grid">
        <a href="/index.html" class="quick-link-item">
          <strong>Home Page &rarr;</strong>
          <span style="font-size: 0.78rem; color: var(--text-muted);">Overview &amp; civic breakdown</span>
        </a>
        <a href="/report.html" class="quick-link-item">
          <strong>Report an Issue &rarr;</strong>
          <span style="font-size: 0.78rem; color: var(--text-muted);">GPS photo submission</span>
        </a>
        <a href="/track.html" class="quick-link-item">
          <strong>Track Complaints &rarr;</strong>
          <span style="font-size: 0.78rem; color: var(--text-muted);">Live Delhi status map</span>
        </a>
        <a href="/leaderboard.html" class="quick-link-item">
          <strong>Citizen Leaderboard &rarr;</strong>
          <span style="font-size: 0.78rem; color: var(--text-muted);">Ranks &amp; Diamond badges</span>
        </a>
        <a href="/verify.html" class="quick-link-item">
          <strong>Verify Resolution &rarr;</strong>
          <span style="font-size: 0.78rem; color: var(--text-muted);">AI pixel verification</span>
        </a>
        <a href="/admin-login.html" class="quick-link-item">
          <strong>Govt Portal &rarr;</strong>
          <span style="font-size: 0.78rem; color: var(--text-muted);">MCD, PWD, DJB, DDA login</span>
        </a>
      </div>
    </div>
  </div>
</body>
</html>`);
}

function resolveFilePath(reqUrl) {
  let cleanUrl = reqUrl.split('?')[0].split('#')[0];
  try {
    cleanUrl = decodeURIComponent(cleanUrl);
  } catch(e) {}

  // Strip trailing slash except for root
  if (cleanUrl.length > 1 && cleanUrl.endsWith('/')) {
    cleanUrl = cleanUrl.slice(0, -1);
  }

  const lower = cleanUrl.toLowerCase();

  // 1. Direct alias check
  if (ROUTE_ALIASES[lower]) {
    cleanUrl = ROUTE_ALIASES[lower];
  }

  // 2. Direct path check
  let fullPath = path.join(PUBLIC_DIR, cleanUrl);

  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      return fullPath;
    }
    if (stat.isDirectory()) {
      const idx = path.join(fullPath, 'index.html');
      if (fs.existsSync(idx) && fs.statSync(idx).isFile()) {
        return idx;
      }
    }
  }

  // 3. Try with .html extension
  const htmlPath = fullPath + '.html';
  if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
    return htmlPath;
  }

  return null;
}

const server = http.createServer((req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const resolvedPath = resolveFilePath(req.url);

  if (!resolvedPath) {
    serveNotFound(res, req.url);
    return;
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(resolvedPath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`CivicConnect server actively running at http://localhost:${PORT}/`);
});