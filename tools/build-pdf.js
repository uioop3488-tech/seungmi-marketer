/*
  포트폴리오 PDF 만들기
  - portfolio-pdf.html(16:9 슬라이드형 포트폴리오)을 그대로 PDF로 저장합니다.
  - 내용은 assets/js/data.js 에서 가져오므로, 데이터를 고친 뒤 다시 실행하면 PDF도 갱신됩니다.
  - 실행: node tools/build-pdf.js   (Playwright 필요)
  - 결과: assets/Lee-Seungmi-Portfolio.pdf
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'Lee-Seungmi-Portfolio.pdf');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' };

// PDF 용량을 줄이려고 사진을 긴 변 1400px로 줄인 사본을 임시 폴더에 만들어 씀 (Python + Pillow 없으면 원본 사용)
const CACHE = path.join(os.tmpdir(), 'seungmi-pdf-img');
function shrinkImages() {
  const py = `
import sys, os, glob
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
for f in glob.glob(os.path.join(src, '*.jpg')):
    out = os.path.join(dst, os.path.basename(f))
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(f): continue
    im = Image.open(f).convert('RGB'); im.thumbnail((1400, 1400)); im.save(out, quality=82, optimize=True)
`;
  const r = spawnSync('python3', ['-c', py, path.join(ROOT, 'assets', 'img'), CACHE], { stdio: 'inherit' });
  return r.status === 0;
}

function serve(useCache) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    let f = path.join(ROOT, p);
    if (useCache && p.startsWith('/assets/img/') && p.endsWith('.jpg') && fs.existsSync(path.join(CACHE, path.basename(p)))) f = path.join(CACHE, path.basename(p));
    if (!(f.startsWith(ROOT) || f.startsWith(CACHE)) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => server.listen(0, () => r(server)));
}

(async () => {
  const server = await serve(shrinkImages());
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(`http://localhost:${server.address().port}/portfolio-pdf.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('body[data-ready="1"]', { timeout: 60000 });
  await page.pdf({ path: OUT, width: '1600px', height: '900px', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  server.close();
  console.log('saved', path.relative(ROOT, OUT), (fs.statSync(OUT).size / 1048576).toFixed(1) + 'MB');
})();
