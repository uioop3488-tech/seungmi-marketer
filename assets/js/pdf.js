/*
  포트폴리오 PDF 페이지 구성
  표지 → 프로필 → 경력 → 목차 → 하이라이트 → (회사 챕터 → 프로젝트 개요 · 과정 · 갤러리) → 마지막
  내용은 모두 data.js 에서 가져옵니다.
*/
(function () {
  // PDF에서는 짧은 개조식 문구(pdf-copy.js)를 우선 사용
  const P = window.PROJECTS.map((p) => ({ ...p, ...((window.PDF_COPY || {})[p.slug] || {}) }));
  const PR = window.PROFILE;
  const GROUPS = window.COMPANY_GROUPS;
  const MINOR = new Set(window.MINOR || []);
  const CAT = Object.fromEntries(window.CATEGORIES.map((c) => [c.id, c.label]));
  const SITE = 'uioop3488-tech.github.io/seungmi-marketer';

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const img = (n) => `assets/img/${n}.jpg`;
  const TONES = ['blue', 'pink', 'green'];

  const pages = [];
  const add = (html, cls = '', foot = true) => { pages.push({ html, cls, foot }); return pages.length; };
  const tabs = (arr) => `<div class="tabs">${arr.map(([t, c]) => `<span class="ftab ${c || ''}">${t}</span>`).join('')}</div>`;
  const sun = () => `<svg class="cv-sun" viewBox="0 0 200 200" aria-hidden="true"><g fill="currentColor">${
    Array.from({ length: 16 }, (_, i) => `<rect x="96" y="6" width="8" height="58" rx="4" transform="rotate(${i * 22.5} 100 100)"/>`).join('')
  }<circle cx="100" cy="100" r="40"/></g><circle cx="100" cy="100" r="12" fill="#f4f2e2"/></svg>`;

  /* ---------- 1. 표지 ---------- */
  add(`
    <img class="bgimg" src="${img('cover-blur')}" alt="">
    ${tabs([['Portfolio'], ['Lee Seungmi', 'blue'], ['2022 — 2026', 'pink']])}
    <div class="cover-card">
      <div class="cv-mark"><i></i><span>Marketer<br>Archive</span></div>
      ${sun()}
      <h1 class="cv-title"><em>Lee</em><br><span class="sel">Seungmi</span><br><strong>Portfolio.</strong></h1>
      <p class="cv-tag">콘텐츠로 브랜드와 고객의<br><mark>접점</mark>을 만들고, 데이터로<br>다시 확인하는 제너럴리스트 마케터.</p>
    </div>
    <div class="cv-foot"><span>Branding · Content · Viral · Offline · Performance</span><span>${SITE}</span></div>`, 'cover-pg', false);

  /* ---------- 2. 프로필 ---------- */
  const caps = [
    ['Branding<br>Content', '네이밍 · 캐릭터 콘텐츠<br>인스타그램 · 블로그 · 유튜브 운영', '쿼카의 여행기 · 소통어워즈 2관왕 · 블로그 월 평균 3.5만'],
    ['Viral<br>Offline', '브랜드 핏 크리에이터 섭외<br>팝업 · 박람회 브랜드 경험', '필킨 무빙 팝업 · 어퓨 쿠션 숏폼 57.6만 회 · VDL 숏폼 66만 회+'],
    ['Performance<br>Data', '메타 · 네이버 광고 운영<br>대시보드 · LTV·CAC 성과 검증', '주간 리드 +51% · LTV ×4 재정정 · ROAS 1,577%'],
  ];
  add(`
    ${tabs([['About me'], ['Profile', 'blue']])}
    <div class="sheet"><div class="profile">
      <div class="pf-card">
        <div class="pf-band">MARKETER ID</div>
        <div class="pf-photo"><img src="${img('profile-pink')}" alt="이승미"></div>
        <div class="pf-name">${esc(PR.name)}</div>
        <div class="pf-role">Marketer · Branding / Content</div>
        <ul class="pf-list">
          <li><span>E-mail</span><span>${esc(PR.email)}</span></li>
          <li><span>Career</span><span>4년차 · 4개 회사</span></li>
          <li><span>Industry</span><span>여행 · 교육 · 뷰티 · 매칭</span></li>
          <li><span>Certificate</span><span>${esc(PR.certs[0].t)}</span></li>
        </ul>
      </div>
      <div class="pf-main">
        <span class="kicker">01 — About me</span>
        <p class="pf-lead">실무로 성장한,<br>크리에이티브한 마케터 <mark>이승미</mark></p>
        <ul class="pf-points">
          <li><b>4개 산업</b>여행 · 교육 · 뷰티 · 매칭 — 브랜드와 고객의 접점</li>
          <li><b>전 과정</b>채널 운영 → 오프라인 팝업 → 인플루언서 바이럴 → 퍼포먼스 · 성과 측정</li>
        </ul>
        <div class="tools">${PR.tools.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="caps">${caps.map(([h, p, proof], i) => `
          <div class="cap"><span class="kicker">${pad(i + 1)}</span><h3>${h}</h3><p>${p}</p><p class="proof">${proof}</p></div>`).join('')}
        </div>
      </div>
    </div></div>`);

  /* ---------- 3. 경력 ---------- */
  add(`
    ${tabs([['About me'], ['Career', 'pink']])}
    <div class="sheet"><div class="career">
      <div>
        <h2 class="h-sec">Experience <em>timeline</em></h2>
        <div class="xp">
          <div class="xp-next">Next — 함께할 <em>팀?</em></div>
          ${PR.experience.map((x) => `
          <div class="xp-row"><div><div class="xp-co">${esc(x.co)}</div><div class="xp-team">${esc(x.team)}</div></div><div class="xp-pd">${esc(x.period)}</div><div class="xp-note">${esc(x.note)}</div></div>`).join('')}
          ${PR.education.map((e) => `<div class="xp-row edu"><div><div class="xp-co">${esc(e.t)}</div><div class="xp-team">학력</div></div><div class="xp-pd">${esc(e.d)}</div></div>`).join('')}
        </div>
      </div>
      <div class="facts">
        <h4>Education · Certificate</h4>
        <ul>${[...PR.education, ...PR.certs].map((e) => `<li><span>${esc(e.t)}</span><span>${esc(e.d)}</span></li>`).join('')}</ul>
        <h4>Awards · Activities</h4>
        <ul>${PR.activities.map((e) => `<li><span>${esc(e.t)}</span><span>${esc(e.d)}</span></li>`).join('')}</ul>
      </div>
    </div></div>`);

  /* ---------- 4. 목차 (쪽 번호는 나중에 채움) ---------- */
  const groups = GROUPS.map((g, ci) => ({ g, n: pad(ci + 1), items: P.filter((p) => p.company === g.id) })).filter((x) => x.items.length);
  add(`
    ${tabs([['Contents'], [`${pad(P.length)} Projects`, 'green']])}
    <div class="sheet">
      <h2 class="h-sec">Contents</h2>
      <div class="toc-intro"><span><b>01</b>About me · Career</span><span><b>02</b>Highlights</span><span><b>03</b>Projects — 회사별 챕터</span></div>
      <div class="toc">${groups.map(({ g, n, items }) => `
        <div class="toc-ch"><div class="no">${n}</div><h3>${esc(g.name)}</h3><div class="kr">${esc(g.kr)} · ${esc(g.period)}</div>
          <ul>${items.map((p) => `<li><span>${esc(p.title)}</span><span class="mono" data-pageof="${p.slug}"></span></li>`).join('')}</ul>
        </div>`).join('')}
      </div>
    </div>`);

  /* ---------- 5. 하이라이트 ---------- */
  const bySlug = Object.fromEntries(P.map((p) => [p.slug, p]));
  add(`
    ${tabs([['Highlights'], ['10초 요약', 'pink']])}
    <div class="sheet">
      <h2 class="h-sec">Selected <em>Work</em></h2>
      <div class="hl">${window.FEATURED.map((f) => { const p = bySlug[f.slug]; return `
        <div class="hl-item">
          <div class="hl-media">${coverHTML(p, true)}</div>
          <div class="hl-body"><div class="hl-n"><span>${esc(f.n)}</span></div><div class="hl-l">${esc(f.l)}</div>
            <div class="hl-t">${esc(p.title)}</div><p class="hl-p">${esc(p.impact || p.summary)}</p></div>
        </div>`; }).join('')}
      </div>
    </div>`);

  /* ---------- 프로젝트 ---------- */
  function coverHTML(p, inTile) {
    const c = p.cover;
    if (c.type === 'text') return `<div class="vis text" style="background:${c.bg};color:${c.fg};height:100%"><span>${esc(c.text)}</span></div>`;
    if (c.type === 'trio' || c.type === 'duo') {
      const srcs = c.videos || c.imgs;
      return `<div class="vis set" style="height:100%">${srcs.map((s) => `<img src="${img(s)}" alt="" data-phone>`).join('')}</div>`;
    }
    return `<div class="vis" style="height:100%"><img class="${c.fit === 'contain' ? 'contain' : ''}" src="${img(c.src)}" alt=""></div>`;
  }

  // 쇼케이스(휴대폰 소재) + 갤러리를 하나의 이미지 목록으로
  const coverSrcs = (c) => (c.videos || c.imgs || (c.src ? [c.src] : [])).map(img);
  const visuals = (p) => {
    const used = new Set(coverSrcs(p.cover));
    return [
      ...(p.showcase ? p.showcase.items.map((m) => ({ k: 'sc', src: img(m.video || m.img), t: m.title, s: m.seg })) : []),
      ...(p.gallery || []).map((g) => g.yt ? { k: 'yt', id: g.yt, cap: g.cap } : { k: 'img', src: img(g.img || g.video), cap: g.cap }),
    ].filter((v) => !v.src || !used.has(v.src));
  };
  const tile = (v) => {
    if (v.k === 'yt') return `<figure class="tile yt"><span class="play"></span><p>${esc(v.cap || 'YouTube')}</p><span class="url">youtu.be/${esc(v.id)}</span></figure>`;
    if (v.k === 'sc') return `<figure class="tile sc"><div class="im"><img src="${v.src}" alt="" data-phone></div><div class="sc-t">${esc(v.t)}</div><div class="sc-s">${esc(v.s)}</div></figure>`;
    return `<figure class="tile"><div class="im"><img src="${v.src}" alt=""></div>${v.cap ? `<figcaption>${esc(v.cap)}</figcaption>` : ''}</figure>`;
  };
  const gridStyle = (n, maxCols) => { const cols = Math.min(maxCols, n); return `grid-template-columns:repeat(${cols},minmax(0,1fr));grid-template-rows:repeat(${Math.ceil(n / cols)},minmax(0,1fr))`; };
  const olist = (arr) => `<ul class="olist">${(arr || []).map((s, i) => `<li><span class="mono">${pad(i + 1)}</span><span>${esc(s)}</span></li>`).join('')}</ul>`;
  const blk = (no, label, inner) => `<div class="blk"><div class="lbl"><span class="mono">${no}</span>${label}</div>${inner}</div>`;

  const projPage = {};
  groups.forEach(({ g, n, items }, gi) => {
    // 챕터 표지
    const brands = window.BRAND_ORDER.filter((b) => items.some((p) => p.brand === b) && b !== g.id);
    add(`
      ${tabs([[`Chapter ${n}`], [esc(g.kr), TONES[gi % 3]], [`${pad(items.length)} projects`, TONES[(gi + 1) % 3]]])}
      <div class="sheet">
        <div class="ch-top"><div class="ch-no">${n}</div>
          <div><div class="ch-name">${esc(g.name)}</div>
            <div class="ch-meta"><b>${esc(g.kr)}</b><span>${esc(g.role)}</span><span class="mono">${esc(g.period)}</span></div>
            ${brands.length ? `<div class="ch-brands">${brands.map((b) => `<span>${esc(b)}</span>`).join('')}</div>` : ''}
          </div>
        </div>
        <ul class="ch-list">${items.map((p) => `<li><span class="mono">No. ${pad(P.indexOf(p) + 1)}</span><span>${esc(p.title)}</span><span class="hl2">${esc(p.headline)}</span></li>`).join('')}</ul>
      </div>`, 'chapter-pg');

    items.forEach((p) => {
      const no = pad(P.indexOf(p) + 1);
      const t = (label, tone) => tabs([[`No. ${no}`, 'mono'], [esc(p.brand || p.company), tone], [esc(p.year), 'pink'], [label, 'mono']]);
      const tone = TONES[gi % 3];
      const res = (p.results || []).slice(0, 6);

      // 개요
      projPage[p.slug] = add(`
        ${t('Overview', tone)}
        <div class="sheet"><div class="ov">
          <div class="ov-left fit">
            <span class="ov-cat">${p.cats.map((c) => esc(CAT[c])).join(' · ')}</span>
            <h2 class="ov-title">${esc(p.title)}</h2>
            <div class="ov-en">${esc(p.titleEn)}</div>
            <div><span class="ov-hl">${esc(p.headline)}</span></div>
            <p class="ov-sum">${esc(p.summary)}</p>
            ${p.why ? `<p class="wb"><b>Why</b>${esc(p.why)}</p>` : ''}
            ${p.impact ? `<p class="wb so"><b>So what</b>${esc(p.impact)}</p>` : ''}
            <dl class="meta">
              <div><dt>Client</dt><dd>${esc(p.client)}</dd></div>
              <div><dt>Period</dt><dd>${esc(p.period)}</dd></div>
              <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
              <div><dt>Channel</dt><dd>${p.channels.map(esc).join(', ')}</dd></div>
            </dl>
          </div>
          <div class="ov-right">
            <div style="flex:1;min-height:0">${coverHTML(p)}</div>
            ${res.length ? `<div class="results" style="--cols:${res.length <= 4 ? res.length : 3}">${res.map((r) => `<div class="res"><div class="n">${esc(r.n)}</div><div class="l">${esc(r.l)}</div></div>`).join('')}</div>` : ''}
          </div>
        </div></div>`);

      // 과정 (+ 이미지 일부)
      const vis = visuals(p);
      const scCount = vis.filter((v) => v.k === 'sc').length;
      // 과정 쪽에 최대 4개(남는 게 2개 이하면 6개까지), 나머지는 갤러리 쪽으로
      const first = vis.slice(0, scCount ? scCount : vis.length <= 6 ? 6 : 4);
      const rest = vis.slice(first.length);
      const textCols = `
        <div class="pr-col fit">
          ${blk('01', 'Background', `<ul class="dots">${(p.background || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`)}
          ${blk('02', 'Problem', olist(p.problem))}
          ${blk('03', 'My Role', olist(p.myRole))}
        </div>
        <div class="pr-col fit">
          ${blk('04', 'Approach', `<div class="steps">${(p.approach || []).map((s, i) => `<div class="st"><span class="mono">STEP ${pad(i + 1)}</span><h4>${esc(s.h)}</h4><p>${esc(s.p)}</p></div>`).join('')}</div>`)}
          ${(p.learnings || []).length ? `<div class="learn"><div class="lbl"><span class="mono">05</span>Learnings</div><ul>${p.learnings.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
        </div>`;
      add(`
        ${t('Process', tone)}
        <div class="sheet"><div class="pr" style="--grid:${first.length ? '0.95fr 1.05fr 1.3fr' : '1fr 1.3fr'}">
          ${textCols}
          ${first.length ? `<div class="pr-vis" style="${gridStyle(first.length, scCount ? 3 : first.length > 4 ? 3 : 2)}">${first.map(tile).join('')}</div>` : ''}
        </div></div>`);

      // 나머지 이미지: 한 쪽에 최대 8개
      for (let k = 0; k < rest.length; k += 8) {
        const chunk = rest.slice(k, k + 8);
        add(`
          ${t('Gallery', tone)}
          <div class="sheet">
            <div class="gal-head"><h3>${esc(p.title)}</h3><span class="kicker">Gallery ${rest.length > 8 ? `${k / 8 + 1} / ${Math.ceil(rest.length / 8)}` : ''}</span></div>
            <div class="gal" style="${gridStyle(chunk.length, 4)}">${chunk.map(tile).join('')}</div>
          </div>`);
      }
    });
  });

  /* ---------- 마지막 ---------- */
  add(`
    <div class="wrap">
      <span class="kicker">Contact</span>
      <h2 class="end-title">함께<br>만들어요.</h2>
      <div class="end-note"><span class="tape"></span><span class="kicker">E-mail</span><div class="mail">${esc(PR.email)}</div><div class="site">Web — ${SITE}</div></div>
    </div>
    <figure class="end-face"><img src="assets/img/profile-cut.webp" alt="이승미"><figcaption>Lee Seungmi, 마케터</figcaption></figure>`, 'end-pg');

  /* ---------- 렌더 ---------- */
  const total = pages.length;
  document.getElementById('deck').innerHTML = pages.map((pg, i) => `
    <section class="pg ${pg.cls}">${pg.html}${pg.foot ? `<div class="pg-foot"><span>Lee Seungmi — Marketer Portfolio</span><span>${pad(i + 1)} / ${pad(total)}</span></div>` : ''}</section>`).join('');
  document.querySelectorAll('[data-pageof]').forEach((el) => (el.textContent = 'P.' + pad(projPage[el.dataset.pageof])));

  /* ---------- 이미지 로드 후: 세로 이미지는 휴대폰 목업으로, 넘치는 글은 글자 크기 줄이기 ---------- */
  const imgs = [...document.images];
  Promise.all([document.fonts.ready, ...imgs.map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))]).then(() => {
    imgs.forEach((im) => {
      const tall = im.naturalHeight / im.naturalWidth > 1.55;
      if (!tall || !(im.hasAttribute('data-phone') || im.closest('.tile'))) return;
      const ph = document.createElement('div');
      ph.className = 'phone';
      ph.innerHTML = '<div class="scr"></div>';
      im.replaceWith(ph);
      ph.firstChild.appendChild(im);
    });
    // 이미지 칸 배치: 열 수를 바꿔 보며 이미지가 가장 크게 보이는 배치를 고름
    document.querySelectorAll('.pr-vis, .gal').forEach((box) => {
      const tiles = [...box.children];
      const ratios = tiles.map((t) => {
        if (t.classList.contains('yt')) return 1.3;
        const im = t.querySelector('img');
        if (!im || !im.naturalWidth) return 1;
        return t.querySelector('.phone') ? 9 / 19 : im.naturalWidth / im.naturalHeight;
      });
      const W = box.clientWidth, H = box.clientHeight, gap = 14, n = tiles.length;
      let best = null;
      for (let cols = 1; cols <= Math.min(4, n); cols++) {
        const rows = Math.ceil(n / cols);
        const cw = (W - gap * (cols - 1)) / cols - 24, ch = (H - gap * (rows - 1)) / rows - 24 - 28;
        if (cw < 60 || ch < 60) continue;
        const area = ratios.reduce((a, r) => { const fw = Math.min(cw, ch * r); return a + fw * (fw / r); }, 0);
        if (!best || area > best.area) best = { cols, rows, area };
      }
      if (best) box.style.cssText += `;grid-template-columns:repeat(${best.cols},minmax(0,1fr));grid-template-rows:repeat(${best.rows},minmax(0,1fr))`;
    });
    // 같은 줄 휴대폰 높이: 세트 커버는 가로 폭에 맞춰 줄임
    document.querySelectorAll('.vis.set').forEach((set) => {
      const phones = set.querySelectorAll('.phone');
      const h = set.clientHeight - 44, w = set.clientWidth - 44 - 22 * (phones.length - 1);
      const ph = Math.min(h, (w / phones.length) * 19 / 9);
      phones.forEach((p) => (p.style.height = ph + 'px'));
    });
    document.querySelectorAll('.tile .phone').forEach((p) => {
      const box = p.parentElement;
      p.style.height = Math.min(box.clientHeight, box.clientWidth * 19 / 9) + 'px';
    });
    // 넘치는 글은 글자 크기를 0.5px씩 줄임 (최소 11px)
    const fitEl = (el) => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollHeight > el.clientHeight + 1 && fs > 11) { fs -= 0.5; el.style.fontSize = fs + 'px'; }
      return fs;
    };
    // 과정 쪽: Learnings를 가운데/왼쪽 중 글자가 더 크게 남는 쪽에 둠
    document.querySelectorAll('.pr').forEach((pr) => {
      const [left, mid] = pr.querySelectorAll('.pr-col');
      const learn = mid && mid.querySelector('.learn');
      if (!learn) return;
      const inMid = Math.min(fitEl(left), fitEl(mid));
      left.appendChild(learn);
      const inLeft = Math.min(fitEl(left), fitEl(mid));
      if (inMid >= inLeft) mid.appendChild(learn);
    });
    document.querySelectorAll('.fit').forEach(fitEl);
    document.querySelectorAll('.res .n').forEach((n) => {
      let fs = 32;
      while (n.scrollWidth > n.clientWidth + 1 && fs > 18) { fs -= 1; n.style.fontSize = fs + 'px'; }
    });
    document.body.dataset.ready = '1';
  });
})();
