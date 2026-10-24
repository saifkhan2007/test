/* =====================================================================
   site.js — Hub & Section Engine
   Renders the hub (index.html) or any section page (<body data-section="...">)
   from config.js, plus Quick Launch, NEW badges, Forum, Photos, ticker,
   clock, typewriter, once-per-session boot sequence, and glitch-wipe.
   ===================================================================== */
(function () {
  const $ = id => document.getElementById(id);
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const sectionId = document.body.dataset.section || "";
  const isHub = !sectionId;
  document.body.classList.toggle("is-hub", isHub);

  /* ---------- NEW badge helper (added within last 7 days) ---------- */
  function isNew(addedStr) {
    if (!addedStr) return false;
    const ms = Date.parse(addedStr);
    if (isNaN(ms)) return false;
    const diffDays = (Date.now() - ms) / 86400000;
    return diffDays >= -1 && diffDays <= 7;
  }

  function sectionHasNew(sec) {
    return Array.isArray(sec.links) && sec.links.some(l => isNew(l.added));
  }

  /* ---------- ensure shared chrome exists ---------- */
  if (!document.querySelector(".floor")) {
    document.body.insertAdjacentHTML("afterbegin", '<div class="floor"></div><div class="scan"></div>');
  }
  if (!$("wipe")) {
    document.body.insertAdjacentHTML("beforeend", '<div id="wipe" aria-hidden="true"></div>');
  }

  /* ---------- boot sequence: play once per browser session ---------- */
  let bootSeen = false;
  try {
    bootSeen = sessionStorage.getItem("pomboboot") === "1";
    sessionStorage.setItem("pomboboot", "1");
  } catch (e) {}

  let bootEl = $("boot");
  if (!bootEl && !bootSeen && !reduce) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<div id="boot"><div><p>running pomboboot <br> >WORLD.EXECUTE(ME)</p><span class="bar"><i></i></span></div></div>'
    );
    bootEl = $("boot");
  }
  if (bootEl && (bootSeen || reduce)) {
    bootEl.classList.add("done");
  }

  /* Clear glitch-wipe overlay when navigating back (bfcache) */
  window.addEventListener("pageshow", () => {
    const w = $("wipe");
    if (w) w.classList.remove("go");
  });

  function navigateWithWipe(href) {
    if (!href) return;
    const w = $("wipe");
    if (reduce || !w) {
      window.location.href = href;
      return;
    }
    w.classList.add("go");
    setTimeout(() => {
      window.location.href = href;
    }, 220);
  }

  /* ---------- SVG icons for hub tiles ---------- */
  function iconFor(id) {
    const icons = {
      forum: '<svg class="tile-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
      photos: '<svg class="tile-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="M21 15l-5-5L5 19"/></svg>',
      games: '<svg class="tile-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 12h4M8 10v4"/><circle cx="15.5" cy="11" r="1" fill="currentColor"/><circle cx="18" cy="13" r="1" fill="currentColor"/></svg>',
      tools: '<svg class="tile-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
      files: '<svg class="tile-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>',
      random: '<svg class="tile-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
    };
    return icons[id] || icons.random;
  }

  /* ---------- build shell if section page is minimal ---------- */
  let wrap = document.querySelector(".wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "wrap";
    document.body.appendChild(wrap);
  }
  if (!document.querySelector(".ticker")) {
    document.body.insertAdjacentHTML("beforeend", '<div class="ticker" aria-hidden="true"><div id="tick"></div></div>');
  }

  const stormOn = window.STORM ? window.STORM.isOn() : true;
  const stormBtnHtml = `<button type="button" class="storm-btn" id="stormToggle" aria-pressed="${stormOn ? "true" : "false"}">${stormOn ? "STORM: ON" : "STORM: OFF"}</button>`;

  /* ---------- FORUM & PHOTOS renderers (exact preserved behavior) ---------- */
  const SETUP = `<div class="setup"><b>Forum is not connected yet</b>Do this once:<ol>
<li>Pick a public GitHub repo (the one that hosts this site is fine) and turn on <code>Discussions</code> in its Settings.</li>
<li>Install the giscus app on that repo: <a href="https://github.com/apps/giscus" target="_blank" rel="noopener">github.com/apps/giscus</a></li>
<li>Open <a href="https://giscus.app" target="_blank" rel="noopener">giscus.app</a>, enter your repo, choose a category, and copy the four values it shows.</li>
<li>Paste them into the <code>FORUM</code> block in <code>config.js</code>.</li></ol></div>`;

  const PIC_OK = /^https:\/\/(github\.com\/user-attachments\/assets\/|user-images\.githubusercontent\.com\/)/;

  function picsOf(body) {
    const out = [], re = /!\[[^\]]*\]\((https:\/\/[^)\s]+)\)|<img\b[^>]*?\bsrc="(https:\/\/[^"]+)"/gi;
    let m;
    while ((m = re.exec(body || ""))) {
      const u = m[1] || m[2];
      if (PIC_OK.test(u) && !out.includes(u)) out.push(u);
    }
    return out;
  }

  async function getShots(repo) {
    const key = "shots:" + repo;
    try {
      const c = JSON.parse(sessionStorage.getItem(key));
      if (c && Date.now() - c.t < 300000) return c.d;
    } catch (e) {}
    const r = await fetch(`https://api.github.com/repos/${repo}/issues?state=open&sort=created&direction=desc&per_page=100`, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!r.ok) throw new Error("GitHub said " + r.status);
    const d = [];
    (await r.json()).forEach(i => {
      if (i.pull_request) return;
      picsOf(i.body).forEach(src =>
        d.push({
          src,
          title: String(i.title).replace(/^photo:\s*/i, "").trim() || "Untitled",
          by: (i.user || {}).login || "ghost",
          url: i.html_url,
          at: i.created_at
        })
      );
    });
    try {
      sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d }));
    } catch (e) {}
    return d;
  }

  function renderPhotos(s, container) {
    const repo = PHOTOS.repo;
    if (!repo) {
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="forum"><div class="setup"><b>Photos are not connected yet</b>Set <code>repo</code> in the <code>PHOTOS</code> block (or fill in the <code>FORUM</code> block) in <code>config.js</code>.</div></div>`
      );
      return;
    }
    const up = `https://github.com/${repo}/issues/new?title=${encodeURIComponent("Photo: ")}`;
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="up"><a class="btn" href="${esc(up)}" target="_blank" rel="noopener">Upload a photo</a>
      <p class="fnote">GitHub opens in a new tab. Attach or paste your photo, press Submit new issue, then refresh this page. Needs a free GitHub account.</p></div>
      <ul class="shots" id="shots"></ul>
      <p class="fnote" id="shotsMsg">Loading photos...</p>
      <button class="btn more" id="shotsMore" hidden>Show more</button>`
    );
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div id="lb" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
      <button class="lbc" data-a="x" aria-label="Close">✕</button><button class="lbn p" data-a="p" aria-label="Previous photo">‹</button>
      <figure><img id="lbi" alt=""><figcaption id="lbt"></figcaption></figure>
      <button class="lbn n" data-a="n" aria-label="Next photo">›</button></div>`
    );

    const grid = $("shots"), msg = $("shotsMsg"), more = $("shotsMore"), lb = $("lb"), lbi = $("lbi"), lbt = $("lbt"), step = PHOTOS.perPage || 24;
    let shots = [], shown = step, cur = 0;
    const draw = () => {
      grid.innerHTML = shots
        .slice(0, shown)
        .map(
          (p, i) =>
            `<li><button class="shot" data-i="${i}" aria-label="Open photo: ${esc(p.title)}"><img src="${esc(p.src)}" alt="${esc(p.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="cap">${esc(p.title)}</span></button></li>`
        )
        .join("");
      more.hidden = shown >= shots.length;
    };
    const open = i => {
      cur = (i + shots.length) % shots.length;
      const p = shots[cur];
      lbi.src = p.src;
      lbi.alt = p.title;
      lbt.innerHTML = `${esc(p.title)}<small>by <a href="https://github.com/${esc(p.by)}" target="_blank" rel="noopener">${esc(p.by)}</a> · ${esc(new Date(p.at).toLocaleDateString())} · <a href="${esc(p.url)}" target="_blank" rel="noopener">View on GitHub</a></small>`;
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lb.hidden = true;
      lbi.removeAttribute("src");
      document.body.style.overflow = "";
    };
    grid.addEventListener("click", e => {
      const b = e.target.closest(".shot");
      if (b) open(+b.dataset.i);
    });
    more.onclick = () => {
      shown += step;
      draw();
    };
    lb.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (b) {
        if (b.dataset.a === "x") close();
        else open(cur + (b.dataset.a === "n" ? 1 : -1));
      } else if (e.target === lb) close();
    });
    addEventListener("keydown", e => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") open(cur + 1);
      else if (e.key === "ArrowLeft") open(cur - 1);
    });

    getShots(repo)
      .then(d => {
        shots = d;
        draw();
        if (d.length) msg.hidden = true;
        else msg.textContent = "No photos yet. Be the first to upload one.";
      })
      .catch(err => {
        msg.innerHTML = `Could not load the photos (${esc(err.message)}). GitHub limits how often a page can ask, so try again in a few minutes, or look at them on <a href="https://github.com/${esc(repo)}/issues" target="_blank" rel="noopener">GitHub</a>.`;
      });
  }

  function renderForum(s, container) {
    const F = FORUM, ready = F.repo && F.repoId && F.category && F.categoryId;
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="forum" id="forumBox">${ready ? "" : SETUP}</div>
      <p class="fnote">Posting needs a free GitHub account. Links turn clickable on their own.</p>`
    );
    if (!ready) return;
    const sc = document.createElement("script");
    sc.src = "https://giscus.app/client.js";
    Object.entries({
      "repo": F.repo,
      "repo-id": F.repoId,
      "category": F.category,
      "category-id": F.categoryId,
      "mapping": "specific",
      "term": F.term || "Forum",
      "strict": "0",
      "reactions-enabled": "1",
      "emit-metadata": "0",
      "input-position": "top",
      "theme": F.theme || "transparent_dark",
      "lang": "en",
      "loading": "lazy"
    }).forEach(([k, v]) => sc.setAttribute("data-" + k, v));
    sc.crossOrigin = "anonymous";
    sc.async = true;
    $("forumBox").appendChild(sc);
  }

  /* ---------- HUB RENDERING ---------- */
  function buildHub() {
    document.title = SITE.title;
    if (!$("title")) {
      wrap.innerHTML = `
        <header class="top">
          <div class="brand"><b>"Brand logo" ahh</b><span id="brand"></span></div>
          <div class="status">${stormBtnHtml}<i class="dot"></i><span id="clock">--:--:--</span></div>
        </header>
        <div class="hero">
          <h1 class="glitch" id="title" data-text="">"tittle" ahh</h1>
          <p class="tw" id="tw"></p>
        </div>
        <div class="ql" id="ql">
          <div class="ql-bar">
            <svg class="ql-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
            <input type="search" class="ql-in" id="qlIn" placeholder="Quick launch — search games, tools, forum, photos..." autocomplete="off" aria-label="Quick launch" aria-expanded="false" aria-controls="qlDrop">
            <button type="button" class="ql-clear" id="qlClear" hidden aria-label="Clear search">✕</button>
          </div>
          <ul class="ql-drop" id="qlDrop" role="listbox" hidden></ul>
        </div>
        <main class="tiles" id="tiles" aria-label="Sections"></main>
      `;
    } else {
      const st = wrap.querySelector(".status");
      if (st && !$("stormToggle")) st.insertAdjacentHTML("afterbegin", stormBtnHtml);
    }

    $("title").textContent = SITE.title;
    $("title").dataset.text = SITE.title;
    if ($("brand")) $("brand").textContent = SITE.title;

    const tilesEl = $("tiles");
    tilesEl.innerHTML = SECTIONS.map(s => {
      let countLabel = "";
      if (s.forum) countLabel = "BOARD";
      else if (s.photos) {
        let cachedCount = null;
        try {
          const c = JSON.parse(sessionStorage.getItem("shots:" + PHOTOS.repo));
          if (c && Array.isArray(c.d)) cachedCount = c.d.length;
        } catch (e) {}
        countLabel = cachedCount !== null ? `${cachedCount} SHOTS` : "GALLERY";
      } else {
        const n = (s.links || []).length;
        countLabel = `${n} ${n === 1 ? "LINK" : "LINKS"}`;
      }
      const newBadge = sectionHasNew(s) ? '<span class="badge-new">NEW</span>' : "";
      return `
        <a class="tile" href="${esc(s.id)}.html" data-sec="${esc(s.id)}">
          <div class="tile-top">
            ${iconFor(s.id)}
            <span class="tile-meta">${newBadge}<span>${esc(countLabel)}</span></span>
          </div>
          <div class="tile-body">
            <h2>${esc(s.title)}</h2>
            <p>${esc(s.blurb || "")}</p>
          </div>
        </a>`;
    }).join("");

    tilesEl.addEventListener("click", e => {
      const a = e.target.closest("a.tile");
      if (!a) return;
      if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigateWithWipe(a.getAttribute("href"));
      }
    });

    initQuickLaunch();
    initTypewriter();
  }

  /* ---------- QUICK LAUNCH SEARCH ---------- */
  function initQuickLaunch() {
    const input = $("qlIn");
    const drop = $("qlDrop");
    const clearBtn = $("qlClear");
    const qlBox = $("ql");
    if (!input || !drop) return;

    const searchIndex = [];
    SECTIONS.forEach(s => {
      searchIndex.push({
        name: s.title,
        section: "Section",
        desc: s.blurb || "",
        url: s.id + ".html",
        isNew: sectionHasNew(s),
        keywords: `${s.title} ${s.id} ${s.blurb || ""} ${s.forum ? "forum discussions comments post board" : ""} ${s.photos ? "photos gallery images pictures upload" : ""}`.toLowerCase()
      });
      if (Array.isArray(s.links)) {
        s.links.forEach(l => {
          searchIndex.push({
            name: l.name,
            section: s.title,
            desc: l.desc || "",
            url: l.url || (s.id + ".html"),
            isNew: isNew(l.added),
            keywords: `${l.name} ${s.title} ${s.id} ${l.desc || ""} ${l.url || ""}`.toLowerCase()
          });
        });
      }
    });

    let matches = [];
    let activeIdx = -1;

    function closeDrop() {
      drop.hidden = true;
      input.setAttribute("aria-expanded", "false");
      activeIdx = -1;
    }

    function renderDrop() {
      const q = input.value.trim().toLowerCase();
      clearBtn.hidden = !q.length;
      if (!q) {
        closeDrop();
        return;
      }
      const tokens = q.split(/\s+/);
      matches = searchIndex
        .filter(item => tokens.every(t => item.keywords.includes(t)))
        .sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
          const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
          if (aStarts !== bStarts) return aStarts - bStarts;
          const aLink = a.section === "Section" ? 1 : 0;
          const bLink = b.section === "Section" ? 1 : 0;
          return aLink - bLink;
        })
        .slice(0, 6);

      if (!matches.length) {
        drop.innerHTML = '<li class="ql-empty">No matches found</li>';
        drop.hidden = false;
        input.setAttribute("aria-expanded", "true");
        activeIdx = -1;
        return;
      }

      activeIdx = 0;
      drop.innerHTML = matches
        .map(
          (m, idx) => `
        <li role="option" aria-selected="${idx === activeIdx}">
          <a class="ql-item${idx === activeIdx ? " active" : ""}" href="${esc(m.url)}" data-idx="${idx}">
            <div class="ql-main">
              <div class="ql-name"><span>${esc(m.name)}</span>${m.isNew ? '<span class="badge-new">NEW</span>' : ""}</div>
              <div class="ql-desc">${esc(m.desc)}</div>
            </div>
            <span class="ql-sec">${esc(m.section)}</span>
          </a>
        </li>`
        )
        .join("");
      drop.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    function updateHighlight(newIdx) {
      if (!matches.length) return;
      activeIdx = (newIdx + matches.length) % matches.length;
      const items = drop.querySelectorAll(".ql-item");
      items.forEach((el, i) => {
        el.classList.toggle("active", i === activeIdx);
        if (el.parentElement) el.parentElement.setAttribute("aria-selected", i === activeIdx ? "true" : "false");
      });
    }

    input.addEventListener("input", renderDrop);
    input.addEventListener("focus", () => {
      if (input.value.trim()) renderDrop();
    });
    input.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        if (!drop.hidden) {
          e.preventDefault();
          closeDrop();
        } else {
          input.value = "";
          clearBtn.hidden = true;
        }
        return;
      }
      if (drop.hidden || !matches.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        updateHighlight(activeIdx + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        updateHighlight(activeIdx - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const chosen = matches[activeIdx >= 0 ? activeIdx : 0];
        if (chosen && chosen.url) {
          window.location.href = chosen.url;
        }
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      clearBtn.hidden = true;
      closeDrop();
      input.focus();
    });

    document.addEventListener("pointerdown", e => {
      if (qlBox && !qlBox.contains(e.target)) closeDrop();
    });
  }

  /* ---------- SECTION PAGE RENDERING ---------- */
  function buildSectionPage() {
    const s = SECTIONS.find(x => x.id === sectionId);
    const pageTitle = s ? `${s.title} — ${SITE.title}` : SITE.title;
    document.title = pageTitle;

    const chipsHtml = SECTIONS.map(
      sec => `<a class="chip" href="${esc(sec.id)}.html"${sec.id === sectionId ? ' aria-current="page"' : ""}>${esc(sec.title)}</a>`
    ).join("");

    wrap.innerHTML = `
      <header class="top">
        <div class="brand">
          <a class="back-link" href="index.html"><i class="chev-l"></i>Back to hub</a>
          <b>"Brand logo" ahh</b>
          <span id="brand">${esc(SITE.title)}</span>
        </div>
        <div class="status">${stormBtnHtml}<i class="dot"></i><span id="clock">--:--:--</span></div>
      </header>
      <div class="sec-head">
        <div class="sh">
          <h1 class="glitch" id="title" data-text="${esc(s ? s.title : "Not Found")}">${esc(s ? s.title : "Not Found")}</h1>
          <span class="rule"></span>
        </div>
        <p class="blurb">${esc(s ? s.blurb || "" : "Section not found in config.js.")}</p>
        <nav class="chips" aria-label="Jump to section">${chipsHtml}</nav>
      </div>
      <main id="sectionContent"></main>
    `;

    const content = $("sectionContent");
    if (!s) {
      content.innerHTML = `<div class="empty"><b>Section "${esc(sectionId)}" not found</b>Add an entry with <code>id: "${esc(sectionId)}"</code> to <code>SECTIONS</code> in <code>config.js</code>.</div>`;
      return;
    }

    if (s.forum) {
      renderForum(s, content);
      return;
    }
    if (s.photos) {
      renderPhotos(s, content);
      return;
    }

    const links = Array.isArray(s.links) ? s.links : [];
    const cards = links.length
      ? links
          .map(l => {
            const badge = isNew(l.added) ? '<span class="badge-new">NEW</span>' : "";
            return `
        <li class="cell"><a class="card" href="${esc(l.url)}">
          <h3><span>${esc(l.name)}</span>${badge}</h3>
          <p>${esc(l.desc || "")}</p>
          <div class="foot"><span>${esc(l.url)}</span><span>Open<i class="chev"></i></span></div>
        </a></li>`;
          })
          .join("")
      : `<li class="empty"><b>Nothing here yet</b>Add a link to the <code>${esc(s.id)}</code> list in <code>config.js</code> and it shows up here.</li>`;

    content.innerHTML = `<ul class="grid">${cards}</ul>`;
  }

  /* ---------- initialize hub or section ---------- */
  if (isHub) {
    buildHub();
  } else {
    buildSectionPage();
  }

  /* ---------- storm button hookup ---------- */
  const stormBtn = $("stormToggle");
  if (stormBtn) {
    stormBtn.addEventListener("click", () => {
      if (window.STORM) window.STORM.toggle();
    });
  }

  /* ---------- ticker ---------- */
  const tickEl = $("tick");
  if (tickEl) {
    const tickText = [
      "NIGHT CITY ONLINE",
      ...SECTIONS.map(s => s.title.toUpperCase() + (s.links ? " " + s.links.length : "")),
      "STAY SHARP, CHOOMBA"
    ]
      .map(t => `<span>${esc(t)}</span>`)
      .join("");
    tickEl.innerHTML = tickText.repeat(6);
  }

  /* ---------- clock ---------- */
  const clockEl = $("clock");
  if (clockEl) {
    const tickClock = () => {
      clockEl.textContent = "ONLINE  " + new Date().toLocaleTimeString([], { hour12: false });
    };
    tickClock();
    setInterval(tickClock, 1000);
  }

  /* ---------- typewriter (hub) ---------- */
  function initTypewriter() {
    const el = $("tw");
    if (!el) return;
    const lines = SITE.messages.map(m => "> " + m.toUpperCase());
    if (reduce) {
      el.textContent = lines[1] || lines[0];
      return;
    }
    let li = 0, ci = 0, del = false;
    (function step() {
      const s = lines[li];
      ci += del ? -1 : 1;
      el.textContent = s.slice(0, ci);
      let t = del ? 22 : 55;
      if (!del && ci === s.length) {
        del = true;
        t = 1800;
      } else if (del && ci === 0) {
        del = false;
        li = (li + 1) % lines.length;
        t = 350;
      }
      setTimeout(step, t);
    })();
  }
})();
