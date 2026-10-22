/*
  포트폴리오 PDF 만들기
  - 사이트를 그대로 띄워서 A4 가로 비율(1440 × 1018px) PDF로 저장합니다.
  - 1쪽: 인트로 폴더 표지 / 이후: About → Selected Work → Archive(회사별 새 쪽) → 학력·수상 → Contact
  - 실행: node tools/build-pdf.js   (Playwright 필요)
  - 결과: assets/Lee-Seungmi-Portfolio.pdf
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'Lee-Seungmi-Portfolio.pdf');
const W = 1440, H = 1018;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };

// 화면용 효과(고정 헤더·스크롤 등장·호버)를 끄고, 쪽 나눔을 정하는 PDF 전용 스타일
const PDF_CSS = `
  html { scroll-behavior: auto !important; }
  .intro, .progress, .site-header, .mobile-menu, .co-tabs, .view-toggle, .peek, .ticker, .ed-hover, .badge-hint, .lanyard, .copy-chip, .footer-line a { display: none !important; }
  .reveal, .reveal.in { opacity: 1 !important; transform: none !important; }
  .ed-media.reveal, .f-media.reveal { clip-path: none !important; }
  .f-media.reveal .cover { transform: none !important; }
  .hero-statement .lt, .ff-title .ln, .contact-title .bounce { clip-path: none !important; transform: none !important; opacity: 1 !important; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .badge-wrap { transform: none !important; }
  .featured, .archive, .facts-sec { break-before: page; }
  .chapter + .chapter { break-before: page; }
  .feature, .ed-item, .brand-pair, .xp-row, .xp-next, .ed-minor .row, .facts > div, .cap, .ch-head, .ed-minor { break-inside: avoid; }
  .brand-head { break-after: avoid; }
  .about { padding-top: 56px; padding-bottom: 0; }
  .caps { break-before: page; padding-top: 48px; }
  .xp-wrap { margin-top: 56px; }
  /* 회사 챕터: 머리말과 첫 프로젝트가 한 쪽에 들어가도록 여백·썸네일 높이를 줄임 */
  .chapter { margin-top: 52px; padding-top: 28px; }
  .chapter + .chapter { margin-top: 52px; }
  .ch-head { margin-bottom: 28px; }
  .ed-item .ed-media { aspect-ratio: 16 / 10 !important; }
  .archive .sec-label { margin-bottom: 0; }
  .grid { padding-bottom: 0; }
  /* Selected Work: 한 쪽에 두 개씩 */
  .feature-list { gap: 40px; padding-bottom: 0; }
  .f-media { grid-column: 1 / span 6 !important; }
  .f-text { grid-column: 8 / span 5 !important; }
  .feature.flip .f-media { grid-column: 7 / span 6 !important; }
  .feature.flip .f-text { grid-column: 1 / span 5 !important; }
  .featured .sec-label { margin-bottom: 24px; }
  /* 학력·수상과 Contact를 한 쪽에 */
  .facts-sec { padding-top: 48px; padding-bottom: 48px; }
  .pdf-same { display: none !important; }
  .ed-minor { margin-top: 28px !important; }
  .ed-minor > .sheet-tab { position: static !important; display: inline-flex; margin-bottom: 8px; transform: none !important; }
`;

function serve() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => server.listen(0, () => r(server)));
}

// 지연 로딩 이미지가 모두 뜨도록 끝까지 스크롤
async function loadAll(page) {
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
    for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    scrollTo(0, 0);
    await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
    await document.fonts.ready;
  });
}

(async () => {
  const server = await serve();
  const base = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch();

  // 1) 표지: 인트로 폴더 화면을 그대로 캡처
  const cover = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await cover.goto(base, { waitUntil: 'networkidle' });
  await cover.addStyleTag({ content: '.intro-foot, .pixel-hand, .ios-pop { display: none !important; }' });
  await cover.waitForTimeout(3500);
  const coverPng = (await cover.screenshot({ type: 'jpeg', quality: 88 })).toString('base64');
  await cover.close();

  // 2) 본문: 인트로를 건너뛴 상태로 렌더
  const page = await browser.newPage({ viewport: { width: W, height: H }, reducedMotion: 'reduce' }); // 숫자 카운트업 없이 최종값으로
  await page.addInitScript(() => { try { sessionStorage.setItem('intro-seen', '1'); } catch (e) {} });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: PDF_CSS });
  await page.evaluate((src) => {
    const c = document.createElement('div');
    c.style.cssText = 'width:100%;height:100vh;break-after:page;background:#000 url(data:image/jpeg;base64,' + src + ') center/cover no-repeat;';
    document.body.prepend(c);
    document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in'));
    // 회사 이름과 같은 브랜드 머리말은 PDF에서 생략 (예: 트웨니스 챕터의 '트웨니스')
    document.querySelectorAll('.chapter').forEach((ch) => {
      const co = ch.querySelector('.ch-meta .ch-kr')?.textContent || '';
      ch.querySelectorAll('.brand-head').forEach((b) => { if (co.startsWith(b.firstElementChild.textContent)) b.classList.add('pdf-same'); });
    });
  }, coverPng);
  await loadAll(page);
  await page.emulateMedia({ media: 'screen' });
  await page.pdf({ path: OUT, width: W + 'px', height: H + 'px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });

  await browser.close();
  server.close();
  console.log('saved', path.relative(ROOT, OUT), (fs.statSync(OUT).size / 1048576).toFixed(1) + 'MB');
})();
