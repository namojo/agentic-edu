/* SDS Agentic AI — site app.js (v2)
 * Responsibilities:
 *  - Hash routing for curriculum.html (#/modules/{id})
 *  - Fetch + render module markdown (marked + highlight.js + mermaid)
 *  - Slide viewer modal (keyboard, thumbnail grid, 전체 보기 toggle)
 *  - Nav scroll state + mobile drawer toggle
 *  - Scroll reset on module switch (USER_NOTES v2 #3)
 *  - 8 modules 00~07 (USER_NOTES v2 #4)
 *  - Mermaid rendering (USER_NOTES v2 #9)
 */

(function () {
  'use strict';

  // --- Module list (authoritative: matches assets/modules/*.md filenames) ---
  const MODULES = [
    { id: '00-setup',         order: 0, title: '환경 설정하기 (Windows 기준)', duration: '30~40분', difficulty: '준비' },
    { id: '01-vibe-coding',   order: 1, title: '바이브코딩 시작하기',         duration: '30분', difficulty: '입문' },
    { id: '02-cursor-tour',   order: 2, title: 'Cursor 핵심 기능 투어',      duration: '30분', difficulty: '입문' },
    { id: '03-skill-basics',  order: 3, title: 'Skill 만들기 (실습 A 전반)',  duration: '40분', difficulty: '초급' },
    { id: '04-mcp-basics',    order: 4, title: 'MCP 만들기와 등록 (실습 A 후반)', duration: '40분', difficulty: '초급' },
    { id: '05-single-agent',  order: 5, title: '단일 Agent 개발',            duration: '40분', difficulty: '중급' },
    { id: '06-multi-agent',   order: 6, title: 'Multi-Agent 협업',           duration: '40분', difficulty: '중급' },
    { id: '07-capstone-news', order: 7, title: '캡스톤 — 한/미 뉴스 멀티에이전트', duration: '60분', difficulty: '중상' }
  ];
  window.SDS_MODULES = MODULES;
  const DEFAULT_MODULE_ID = '00-setup';

  // --- Utils ---
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  function scrollTop() {
    try { window.scrollTo({ top: 0, behavior: 'auto' }); }
    catch (e) { window.scrollTo(0, 0); }
  }

  // Strip YAML frontmatter from markdown
  function stripFrontmatter(md) {
    if (!md) return '';
    if (md.startsWith('---')) {
      const end = md.indexOf('\n---', 3);
      if (end >= 0) {
        const nlAfter = md.indexOf('\n', end + 4);
        return nlAfter >= 0 ? md.slice(nlAfter + 1) : md.slice(end + 4);
      }
    }
    return md;
  }

  // --- Navbar scroll state ---
  function initNavScroll() {
    const nav = $('#sdsNav');
    if (!nav) return;
    const toggle = () => {
      if (window.scrollY > 20) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  // --- Mobile drawer ---
  function initDrawer() {
    const drawer = $('#sdsDrawer');
    const openBtn = $('#sdsDrawerOpen');
    const closeBtn = $('#sdsDrawerClose');
    const backdrop = $('#sdsDrawerBackdrop');
    if (!drawer) return;
    const close = () => drawer.classList.remove('open');
    const open = () => drawer.classList.add('open');
    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // --- Lucide init helper ---
  function drawIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  }
  window.SDS_drawIcons = drawIcons;

  // --- Mermaid init (once) ---
  let mermaidInitialized = false;
  let mermaidRunCounter = 0;
  function initMermaidOnce() {
    if (mermaidInitialized) return;
    if (!window.mermaid) return;
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#2563eb',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#60a5fa',
          lineColor: '#60a5fa',
          secondaryColor: '#312e81',
          tertiaryColor: '#1e293b',
          background: '#0f172a',
          mainBkg: '#1e293b',
          nodeTextColor: '#e2e8f0'
        },
        flowchart: { curve: 'basis', htmlLabels: true },
        sequence: { useMaxWidth: true },
        securityLevel: 'loose'
      });
      mermaidInitialized = true;
    } catch (e) { /* ignore */ }
  }

  // Convert <pre><code class="language-mermaid">...</code></pre> → <pre class="mermaid">...</pre>
  // Assign unique ids each run to avoid "already rendered" double-init errors.
  function transformMermaidBlocks(root) {
    if (!root) return 0;
    const blocks = $$('pre code.language-mermaid, pre code.lang-mermaid', root);
    let count = 0;
    blocks.forEach((code) => {
      const pre = code.closest('pre');
      if (!pre) return;
      const raw = code.textContent || '';
      const wrap = document.createElement('pre');
      wrap.className = 'mermaid';
      wrap.setAttribute('data-mmd-id', 'mmd-' + (++mermaidRunCounter));
      wrap.textContent = raw;
      pre.replaceWith(wrap);
      count++;
    });
    return count;
  }

  async function renderMermaidIn(selector) {
    if (!window.mermaid) return;
    initMermaidOnce();
    try {
      // mermaid v11 supports run({ querySelector }) — safer than deprecated init()
      await window.mermaid.run({ querySelector: selector, suppressErrors: true });
    } catch (e) {
      // last-resort: ignore (bad diagram shouldn't break page)
      // console.warn('[mermaid] render failed', e);
    }
  }

  // =========================================================================
  // Curriculum page
  // =========================================================================
  const mdCache = {};

  async function loadModule(id) {
    if (mdCache[id]) return mdCache[id];
    const res = await fetch(`assets/modules/${id}.md`);
    if (!res.ok) throw new Error(`모듈 로드 실패: ${id} (${res.status})`);
    const md = await res.text();
    mdCache[id] = md;
    return md;
  }

  async function renderMarkdown(md, target) {
    if (!target) return;
    const body = stripFrontmatter(md);
    if (window.marked) {
      window.marked.setOptions({ gfm: true, breaks: false });
      target.innerHTML = window.marked.parse(body);
    } else {
      const pre = document.createElement('pre');
      pre.textContent = body;
      target.innerHTML = '';
      target.appendChild(pre);
    }
    // 1) Extract & transform mermaid blocks BEFORE highlight.js touches them
    const mmdCount = transformMermaidBlocks(target);
    // 2) Highlight remaining (non-mermaid) code blocks
    if (window.hljs) {
      $$('#moduleContent pre code', document).forEach((b) => {
        if (b.parentElement && b.parentElement.classList.contains('mermaid')) return;
        try { window.hljs.highlightElement(b); } catch (e) {}
      });
    }
    // 3) Render mermaid
    if (mmdCount > 0) {
      await renderMermaidIn('#moduleContent .mermaid');
    }
    // Build TOC from h2/h3
    buildTOC(target);
  }

  function buildTOC(container) {
    const toc = $('#moduleTOC');
    if (!toc) return;
    const headings = $$('h2, h3', container);
    if (headings.length === 0) {
      toc.innerHTML = '<p class="text-slate-500 text-sm">목차가 없습니다.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    headings.forEach((h, i) => {
      if (!h.id) {
        h.id = `toc-h-${i}-${h.textContent.trim().replace(/\s+/g, '-').replace(/[^\w가-힣-]/g, '').slice(0, 40)}`;
      }
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      a.className = 'block py-1 text-sm transition-colors ' +
        (h.tagName === 'H3' ? 'pl-3 text-slate-400 hover:text-white' : 'text-slate-200 hover:text-white font-medium');
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const t = document.getElementById(h.id);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      frag.appendChild(a);
    });
    toc.innerHTML = '';
    toc.appendChild(frag);
  }

  function setActiveSidebar(id) {
    $$('.sidebar-item').forEach((el) => {
      if (el.dataset.moduleId === id) el.classList.add('active');
      else el.classList.remove('active');
    });
  }

  function updateMetaBar(mod) {
    const bar = $('#moduleMeta');
    if (!bar || !mod) return;
    bar.innerHTML = `
      <span class="num-badge" style="width:2.75rem;height:2.75rem;font-size:1rem;">${String(mod.order).padStart(2, '0')}</span>
      <div class="flex-1 min-w-0">
        <div class="text-xs uppercase tracking-wider text-blue-300 mb-1">Module ${String(mod.order).padStart(2, '0')}</div>
        <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight truncate">${mod.title}</h1>
      </div>
      <div class="hidden sm:flex items-center gap-2 shrink-0">
        <span class="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-full px-3 py-1">${mod.duration}</span>
        <span class="diff-tag diff-${mod.difficulty}">${mod.difficulty}</span>
      </div>`;
  }

  async function route() {
    // (a) scroll reset at start of route handler
    scrollTop();

    const hash = location.hash || '';
    const match = hash.match(/^#\/modules\/(.+)$/);
    const id = (match && match[1]) || DEFAULT_MODULE_ID;
    const mod = MODULES.find((m) => m.id === id) || MODULES[0];
    setActiveSidebar(mod.id);
    updateMetaBar(mod);
    const content = $('#moduleContent');
    if (!content) return;
    content.innerHTML = '<div class="text-slate-400 text-sm py-12 text-center">불러오는 중…</div>';
    try {
      const md = await loadModule(mod.id);
      await renderMarkdown(md, content);
      // (b) scroll reset after markdown rendered + placed
      scrollTop();
    } catch (err) {
      content.innerHTML = `<div class="text-red-300">모듈을 불러오지 못했습니다: ${err.message}</div>`;
    }
    // Close drawer if open (mobile)
    const drawer = $('#sdsDrawer');
    if (drawer) drawer.classList.remove('open');
    drawIcons();
  }

  function buildSidebar() {
    const sidebar = $('#sdsSidebar');
    const drawerList = $('#sdsDrawerList');
    [sidebar, drawerList].forEach((host) => {
      if (!host) return;
      host.innerHTML = '';
      MODULES.forEach((m) => {
        const a = document.createElement('a');
        a.href = `#/modules/${m.id}`;
        a.className = 'sidebar-item';
        a.dataset.moduleId = m.id;
        a.innerHTML = `
          <span class="mini-num">${String(m.order).padStart(2, '0')}</span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-medium truncate">${m.title}</span>
            <span class="block text-xs text-slate-400">${m.duration} · ${m.difficulty}</span>
          </span>`;
        // Same-hash re-click should still scroll to top + re-render top
        a.addEventListener('click', (e) => {
          const currentId = (location.hash.match(/^#\/modules\/(.+)$/) || [])[1];
          if (currentId === m.id) {
            // Re-click of current module: don't hashchange, but reset scroll
            scrollTop();
          }
        });
        host.appendChild(a);
      });
    });
  }

  function initCurriculum() {
    if (!$('#moduleContent')) return; // not on curriculum page
    buildSidebar();
    window.addEventListener('hashchange', route);
    route();
  }

  // =========================================================================
  // Slide viewer
  // =========================================================================
  let slideData = null; // { slides: [...], fallbackByModule: ... }
  let slideState = { list: [], idx: 0, allMode: false };

  async function loadSlideMeta() {
    if (slideData) return slideData;
    try {
      const res = await fetch('assets/slides/meta.json');
      slideData = res.ok ? await res.json() : { slides: [] };
    } catch (e) {
      slideData = { slides: [] };
    }
    if (!slideData.slides) slideData.slides = [];
    return slideData;
  }

  function currentModuleId() {
    const m = (location.hash || '').match(/^#\/modules\/(.+)$/);
    return m ? m[1] : null;
  }

  function moduleById(id) { return MODULES.find((m) => m.id === id); }

  function fallbackSlideFor(m) {
    return {
      module: m.id,
      moduleOrder: m.order,
      title: m.title,
      caption: `Module ${String(m.order).padStart(2, '0')} · ${m.duration} · ${m.difficulty}`,
      fallback: true
    };
  }

  function allSlides() {
    const meta = slideData || { slides: [] };
    if (!meta.slides || meta.slides.length === 0) {
      return MODULES.map(fallbackSlideFor);
    }
    // Sort by module order, then slide order
    const withOrder = meta.slides.map((s) => {
      const mid = s.moduleId || s.module;
      const m = moduleById(mid);
      return Object.assign({}, s, { _mo: m ? m.order : 99, _so: s.order || 0 });
    });
    withOrder.sort((a, b) => (a._mo - b._mo) || (a._so - b._so));
    return withOrder;
  }

  function slidesForCurrent() {
    if (slideState.allMode) return allSlides();
    const mod = currentModuleId();
    const meta = slideData || { slides: [] };
    if (!meta.slides || meta.slides.length === 0) {
      const target = mod ? [moduleById(mod)].filter(Boolean) : MODULES;
      return target.map(fallbackSlideFor);
    }
    if (mod) {
      const filtered = meta.slides.filter((s) => s.module === mod || s.moduleId === mod);
      if (filtered.length > 0) return filtered;
      const m = moduleById(mod);
      if (m) return [fallbackSlideFor(m)];
    }
    return meta.slides;
  }

  function renderSlide() {
    const stage = $('#slideStage');
    if (!stage) return;
    const s = slideState.list[slideState.idx];
    if (!s) {
      stage.innerHTML = '<div class="p-12 text-white text-center">표시할 슬라이드가 없습니다.</div>';
      return;
    }
    const total = slideState.list.length;
    const count = `${slideState.idx + 1} / ${total}`;
    const moduleTag = s.moduleOrder ? `Module ${String(s.moduleOrder).padStart(2, '0')}` : (s.module || s.moduleId || '');
    const img = s.image || s.src || s.imagePath;
    const modeTag = slideState.allMode ? '전체' : '현재 모듈';
    if (s.fallback || !img) {
      stage.innerHTML = `
        <div class="slide-fallback">
          <span class="badge">${moduleTag}</span>
          <h2>${s.title || ''}</h2>
          <p>${s.caption || ''}</p>
        </div>
        <div class="slide-hud">
          <span class="badge-count">${count} · ${modeTag}</span>
          <span class="badge-count">T 썸네일 · A 전체</span>
        </div>`;
    } else {
      // Image onerror fallback: if png missing, degrade to fallback card
      stage.innerHTML = `
        <img src="${img}" alt="${s.title || ''}" onerror="this.outerHTML='<div class=\\'slide-fallback\\'><span class=\\'badge\\'>${moduleTag}</span><h2>${(s.title||'').replace(/'/g,'\\\'')}</h2><p>${(s.caption||'').replace(/'/g,'\\\'')}</p></div>';" />
        <div class="slide-hud">
          <span class="badge-count">${count}${s.title ? ' · ' + s.title : ''} · ${modeTag}</span>
          <span class="badge-count">T 썸네일 · A 전체</span>
        </div>`;
    }
  }

  function openSlideModal(startIdx) {
    const modal = $('#slideModal');
    if (!modal) return;
    slideState.list = slidesForCurrent();
    slideState.idx = Math.max(0, Math.min(startIdx || 0, slideState.list.length - 1));
    renderSlide();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSlideModal() {
    const modal = $('#slideModal');
    const grid = $('#slideGrid');
    if (modal) modal.classList.remove('open');
    if (grid) grid.classList.remove('open');
    document.body.style.overflow = '';
  }
  function nextSlide() {
    if (slideState.list.length === 0) return;
    slideState.idx = (slideState.idx + 1) % slideState.list.length;
    renderSlide();
  }
  function prevSlide() {
    if (slideState.list.length === 0) return;
    slideState.idx = (slideState.idx - 1 + slideState.list.length) % slideState.list.length;
    renderSlide();
  }

  function toggleAllMode() {
    slideState.allMode = !slideState.allMode;
    slideState.list = slidesForCurrent();
    slideState.idx = 0;
    renderSlide();
    // Rebuild grid content if open
    const grid = $('#slideGrid');
    if (grid && grid.classList.contains('open')) buildGrid();
  }

  function buildGrid() {
    const wrap = $('#slideGridWrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    slideState.list.forEach((s, i) => {
      const div = document.createElement('div');
      div.className = 'slide-grid-item';
      const img = s.image || s.src || s.imagePath;
      const modTag = s.moduleOrder ? `M${String(s.moduleOrder).padStart(2, '0')}` : '';
      if (img && !s.fallback) {
        div.innerHTML = `
          <img src="${img}" alt="" onerror="this.remove();" class="slide-grid-thumb" />
          <span class="idx">${String(i + 1).padStart(2, '0')}${modTag ? ' · ' + modTag : ''}</span>
          <span>${s.title || ('Slide ' + (i + 1))}</span>`;
      } else {
        div.innerHTML = `
          <span class="idx">${String(i + 1).padStart(2, '0')}${modTag ? ' · ' + modTag : ''}</span>
          <span>${s.title || ('Slide ' + (i + 1))}</span>`;
      }
      div.addEventListener('click', () => {
        slideState.idx = i;
        const grid = $('#slideGrid');
        if (grid) grid.classList.remove('open');
        renderSlide();
      });
      wrap.appendChild(div);
    });
  }

  function toggleGrid() {
    const grid = $('#slideGrid');
    if (!grid) return;
    if (grid.classList.contains('open')) {
      grid.classList.remove('open');
      return;
    }
    buildGrid();
    grid.classList.add('open');
  }

  function initSlides() {
    loadSlideMeta();
    const triggers = $$('[data-slide-open]');
    triggers.forEach((btn) => {
      btn.addEventListener('click', async () => {
        await loadSlideMeta();
        openSlideModal(0);
      });
    });
    const closeBtn = $('#slideClose');
    const prevBtn = $('#slidePrev');
    const nextBtn = $('#slideNext');
    const allBtn = $('#slideAllToggle');
    if (closeBtn) closeBtn.addEventListener('click', closeSlideModal);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (allBtn) allBtn.addEventListener('click', toggleAllMode);
    document.addEventListener('keydown', (e) => {
      const modal = $('#slideModal');
      if (!modal || !modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeSlideModal();
      else if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === 't' || e.key === 'T') toggleGrid();
      else if (e.key === 'a' || e.key === 'A') toggleAllMode();
    });
    const gridBackdrop = $('#slideGridBackdrop');
    if (gridBackdrop) gridBackdrop.addEventListener('click', () => {
      const g = $('#slideGrid');
      if (g) g.classList.remove('open');
    });
  }

  // =========================================================================
  // Glossary rendering (resources page)
  // =========================================================================
  async function initGlossary() {
    const target = $('#glossaryContent');
    if (!target) return;
    try {
      const res = await fetch('assets/glossary.md');
      if (!res.ok) throw new Error('GLOSSARY 로드 실패');
      const md = await res.text();
      if (window.marked) {
        target.innerHTML = window.marked.parse(stripFrontmatter(md));
      } else {
        target.textContent = md;
      }
    } catch (err) {
      target.innerHTML = `<p class="text-red-600">용어집을 불러오지 못했습니다: ${err.message}</p>`;
    }
  }

  // =========================================================================
  // Mermaid render on static pages (practices.html capstone diagram)
  // =========================================================================
  async function initStaticMermaid() {
    const nodes = $$('pre.mermaid, .mermaid');
    if (nodes.length === 0) return;
    initMermaidOnce();
    await renderMermaidIn('.mermaid');
  }

  // --- Boot ---
  document.addEventListener('DOMContentLoaded', function () {
    drawIcons();
    initNavScroll();
    initDrawer();
    initCurriculum();
    initSlides();
    initGlossary();
    initStaticMermaid();
    // Re-run lucide after dynamic content
    setTimeout(drawIcons, 150);
  });
})();
