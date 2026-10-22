/*
  포트폴리오 PDF 페이지 구성
  표지 → 프로필 → 경력 → 목차 → 하이라이트 → 핵심 케이스(1쪽씩) → More Projects(카드) → 마지막 · 20쪽 이내
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
      <div class="toc-intro"><span><b>01</b>About me · Career</span><span><b>02</b>Highlights</span><span><b>03</b>Key Cases</span><span><b>04</b>More Projects</span></div>
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
  function coverHTML(p) {
    const c = p.cover;
    if (c.type === 'text') return `<div class="vis text" style="background:${c.bg};color:${c.fg};height:100%"><span>${esc(c.text)}</span></div>`;
    if (c.type === 'trio' || c.type === 'duo') {
      const srcs = c.videos || c.imgs;
      return `<div class="vis set" style="height:100%">${srcs.map((s) => `<img src="${img(s)}" alt="" data-phone>`).join('')}</div>`;
    }
    return `<div class="vis" style="height:100%"><img class="${c.fit === 'contain' ? 'contain' : ''}" src="${img(c.src)}" alt=""></div>`;
  }

  const olist = (arr) => `<ul class="olist">${(arr || []).map((s, i) => `<li><span class="mono">${pad(i + 1)}</span><span>${esc(s)}</span></li>`).join('')}</ul>`;
  const blk = (no, label, inner) => `<div class="blk"><div class="lbl"><span class="mono">${no}</span>${label}</div>${inner}</div>`;

  // 핵심 프로젝트는 1쪽 케이스, 나머지는 한 쪽에 4~5개씩 카드로 (전체 20쪽 이내)
  const KEY = new Set(window.PDF_KEY || []);
  const toneOf = (p) => TONES[groups.findIndex((x) => x.g.id === p.company) % 3];
  const projPage = {};
  const keys = P.filter((p) => KEY.has(p.slug));
  const others = P.filter((p) => !KEY.has(p.slug));

  keys.forEach((p, k) => {
    const res = (p.results || []).slice(0, 4);
    const steps = (p.approach || []).slice(0, 5);
    projPage[p.slug] = add(`
      ${tabs([[`Case ${pad(k + 1)}`, 'mono'], [esc(p.brand || p.company), toneOf(p)], [esc(p.year), 'pink']])}
      <div class="sheet"><div class="case">
        <div class="cs-a fit">
          <span class="ov-cat">${esc(p.company)} · ${p.cats.map((c) => esc(CAT[c])).join(' · ')}</span>
          <h2 class="ov-title">${esc(p.title)}</h2>
          <div><span class="ov-hl">${esc(p.headline)}</span></div>
          <p class="ov-sum">${esc(p.summary)}</p>
          ${p.why ? `<p class="wb"><b>Why</b>${esc(p.why)}</p>` : ''}
          ${p.impact ? `<p class="wb so"><b>So what</b>${esc(p.impact)}</p>` : ''}
          <dl class="meta one">
            <div><dt>Period</dt><dd>${esc(p.period)}</dd></div>
            <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>
            <div><dt>Channel</dt><dd>${p.channels.map(esc).join(', ')}</dd></div>
          </dl>
        </div>
        <div class="cs-b fit">
          ${blk('01', 'My Role', olist(p.myRole))}
          ${blk('02', 'Approach', `<div class="steps">${steps.map((s, i) => `<div class="st"><span class="mono">${pad(i + 1)}</span><h4>${esc(s.h)}</h4><p>${esc(s.p)}</p></div>`).join('')}</div>`)}
        </div>
        <div class="cs-c">
          <div style="flex:1;min-height:0">${coverHTML(p)}</div>
          ${res.length ? `<div class="results" style="--cols:2">${res.map((r) => `<div class="res"><div class="n">${esc(r.n)}</div><div class="l">${esc(r.l)}</div></div>`).join('')}</div>` : ''}
        </div>
      </div></div>`);
  });

  // 그 밖의 프로젝트: 카드 모음
  const perPage = Math.ceil(others.length / Math.ceil(others.length / 5));
  for (let i = 0; i < others.length; i += perPage) {
    const chunk = others.slice(i, i + perPage);
    const pageNo = pages.length + 1;
    chunk.forEach((p) => (projPage[p.slug] = pageNo));
    add(`
      ${tabs([['More Projects'], [`${pad(i / perPage + 1)} / ${pad(Math.ceil(others.length / perPage))}`, 'green']])}
      <div class="sheet">
        <h2 class="h-sec">More <em>projects</em></h2>
        <div class="more" style="grid-template-columns:repeat(${chunk.length},minmax(0,1fr))">${chunk.map((p) => {
          const res = (p.results || []).slice(0, 2);
          return `
          <article class="mc">
            <div class="mc-media">${coverHTML(p)}</div>
            <div class="mc-body fit">
              <span class="mc-co"><b class="${toneOf(p)}">${esc(p.brand || p.company)}</b>${esc(p.year)}</span>
              <h3>${esc(p.title)}</h3>
              <p class="mc-sum">${esc(p.summary)}</p>
              <ul class="dots">${(p.myRole || []).slice(0, 3).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
              <div class="mc-res">${res.map((r) => `<div><b>${esc(r.n)}</b><span>${esc(r.l)}</span></div>`).join('')}</div>
            </div>
          </article>`; }).join('')}
        </div>
      </div>`);
  }

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
      if (!tall || !im.hasAttribute('data-phone')) return;
      const ph = document.createElement('div');
      ph.className = 'phone';
      ph.innerHTML = '<div class="scr"></div>';
      im.replaceWith(ph);
      ph.firstChild.appendChild(im);
    });
    // 같은 줄 휴대폰 높이: 세트 커버는 가로 폭에 맞춰 줄임
    document.querySelectorAll('.vis.set').forEach((set) => {
      const phones = set.querySelectorAll('.phone');
      const h = set.clientHeight - 44, w = set.clientWidth - 44 - 22 * (phones.length - 1);
      const ph = Math.min(h, (w / phones.length) * 19 / 9);
      phones.forEach((p) => (p.style.height = ph + 'px'));
    });
    // 넘치는 글은 글자 크기를 0.5px씩 줄임 (최소 11px)
    const fitEl = (el) => {
      el.style.fontSize = '';
      let fs = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollHeight > el.clientHeight + 1 && fs > 11) { fs -= 0.5; el.style.fontSize = fs + 'px'; }
      return fs;
    };
    document.querySelectorAll('.fit').forEach(fitEl);
    document.querySelectorAll('.res .n').forEach((n) => {
      let fs = 32;
      while (n.scrollWidth > n.clientWidth + 1 && fs > 18) { fs -= 1; n.style.fontSize = fs + 'px'; }
    });
    document.body.dataset.ready = '1';
  });
})();
