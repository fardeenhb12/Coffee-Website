import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import os from 'node:os';

const PORT = 3001;
const cacheDir = path.join(os.tmpdir(), 'daythree-v1-serve');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Extract v1 from git
try {
  cp.execSync(`git archive v1 | tar -x -C "${cacheDir}"`, { stdio: 'inherit' });
  console.log(`[v1] Extracted branch v1 to ${cacheDir}`);
} catch (err) {
  console.error('[v1] Failed to extract branch v1:', err);
  process.exit(1);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.vtt': 'text/vtt; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  if (reqPath === '/' || reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }

  const filePath = path.join(cacheDir, reqPath);
  if (!filePath.startsWith(cacheDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Support Range requests (vital for HTML5 video playback)
    const range = req.headers.range;
    if (range && ext === '.mp4') {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });
      fileStream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  DAY THREE — SIDE-BY-SIDE COMPARISON   `);
  console.log(`========================================`);
  console.log(`  v1 (Gallery Baseline):  http://localhost:${PORT}`);
  console.log(`  v2 (New Cover Flow):   http://localhost:3000`);
  console.log(`========================================\n`);
});
