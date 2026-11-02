import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';

const basePath = process.env.BASE_PATH || '/Coffee-Website/';
const distDir = path.resolve('dist');

console.log(`[Pages] Preparing dist for deployment under base path: ${basePath}`);

// 1. Extract branch v1 into dist/v1
const v1Dir = path.join(distDir, 'v1');
if (!fs.existsSync(v1Dir)) {
  fs.mkdirSync(v1Dir, { recursive: true });
}
try {
  cp.execSync(`git archive v1 | tar -x -C "${v1Dir}"`, { stdio: 'inherit' });
  console.log('[Pages] Extracted branch v1 into dist/v1/');
} catch (err) {
  console.error('[Pages] Failed to extract branch v1:', err);
  process.exit(1);
}

// 2. Add an unobtrusive switcher banner to dist/index.html (v2) and dist/v1/index.html (v1)
const v2SwitcherBadge = `
<!-- Version Switcher -->
<aside style="position:fixed;bottom:1.2rem;left:1.2rem;z-index:99999;background:#1A1715;color:#FAF8F5;border:1px solid #FEBF6F;padding:0.5rem 0.9rem;border-radius:999px;font-family:'DM Mono',monospace;font-size:0.75rem;display:flex;align-items:center;gap:0.75rem;box-shadow:0 8px 24px rgba(0,0,0,0.35);">
  <span style="display:inline-flex;align-items:center;gap:0.4rem;">
    <span style="width:7px;height:7px;background:#4ADE80;border-radius:50%;display:inline-block;"></span>
    <strong style="color:#FEBF6F;">v2.0 (New)</strong>
  </span>
  <span style="color:#A89F91;">|</span>
  <a href="${basePath}v1/" style="color:#FAF8F5;text-decoration:underline;text-underline-offset:2px;">Compare with v1 &rarr;</a>
</aside>
`;

const v1SwitcherBadge = `
<!-- Version Switcher -->
<aside style="position:fixed;bottom:1.2rem;left:1.2rem;z-index:99999;background:#1A1715;color:#FAF8F5;border:1px solid #D9532F;padding:0.5rem 0.9rem;border-radius:999px;font-family:'DM Mono',monospace;font-size:0.75rem;display:flex;align-items:center;gap:0.75rem;box-shadow:0 8px 24px rgba(0,0,0,0.35);">
  <span style="display:inline-flex;align-items:center;gap:0.4rem;">
    <span style="width:7px;height:7px;background:#FEBF6F;border-radius:50%;display:inline-block;"></span>
    <strong style="color:#D9532F;">v1.0 (Baseline)</strong>
  </span>
  <span style="color:#A89F91;">|</span>
  <a href="${basePath}" style="color:#FAF8F5;text-decoration:underline;text-underline-offset:2px;">Switch to v2 &rarr;</a>
</aside>
`;

// Inject into v2 index.html
const v2HtmlPath = path.join(distDir, 'index.html');
if (fs.existsSync(v2HtmlPath)) {
  let v2Html = fs.readFileSync(v2HtmlPath, 'utf8');
  v2Html = v2Html.replace('</body>', `${v2SwitcherBadge}\n</body>`);
  fs.writeFileSync(v2HtmlPath, v2Html);
  console.log('[Pages] Injected version switcher into v2 index.html');
}

// Inject into v1 index.html
const v1HtmlPath = path.join(v1Dir, 'index.html');
if (fs.existsSync(v1HtmlPath)) {
  let v1Html = fs.readFileSync(v1HtmlPath, 'utf8');
  v1Html = v1Html.replace('</body>', `${v1SwitcherBadge}\n</body>`);
  fs.writeFileSync(v1HtmlPath, v1Html);
  console.log('[Pages] Injected version switcher into v1 index.html');
}

// 3. For subpath deployments like GitHub Pages (/Coffee-Website/), rewrite root /assets/ and /video.mp4 in v2 files
if (basePath !== '/') {
  const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const walkAndRewrite = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'v1') continue; // v1 uses relative paths already
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkAndRewrite(fullPath);
      } else if (/\.(html|js|css)$/.test(entry.name)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let updated = content
          .replace(/(["'\(])\/assets\//g, `$1${cleanBase}/assets/`)
          .replace(/(["'\(])\/video\.mp4/g, `$1${cleanBase}/video.mp4`);
        if (updated !== content) {
          fs.writeFileSync(fullPath, updated);
          console.log(`[Pages] Rewrote asset paths in ${path.relative(distDir, fullPath)}`);
        }
      }
    }
  };
  walkAndRewrite(distDir);
}

// 4. Ensure .nojekyll exists so GitHub Pages serves raw files without Jekyll processing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('[Pages] Created .nojekyll');

console.log('[Pages] Preparation complete!');

