/* =====================================================================
   storm.js — Cyberpunk Thunderstorm Background + Audio
   Shared across all pages. Draws drifting clouds, 3 depth layers of
   slanted rain, bottom splash ripples, and forked/sheet lightning every
   3-6s, paired with rain.mp3 (looped) and thunder.mp3.
   Respects prefers-reduced-motion, tab visibility, and Storm on/off.
   ===================================================================== */
(function () {
  const STORAGE_KEY = "storm_off";
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function getSavedState() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "1";
    } catch (e) {
      return true;
    }
  }

  function saveState(on) {
    try {
      localStorage.setItem(STORAGE_KEY, on ? "0" : "1");
    } catch (e) {}
  }

  let enabled = getSavedState();
  let canvas = document.getElementById("rain");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "rain";
    document.body.prepend(canvas);
  }
  const ctx = canvas.getContext("2d");

  /* ---------- Audio (rain.mp3 loop + thunder.mp3 on lightning) ---------- */
  let rainAudio = null;
  let thunderAudio = null;
  try {
    rainAudio = new Audio("rain.mp3");
    rainAudio.loop = true;
    rainAudio.preload = "auto";
    rainAudio.volume = 0.45;

    thunderAudio = new Audio("thunder.mp3");
    thunderAudio.preload = "auto";
    thunderAudio.volume = 0.7;
  } catch (e) {}

  function syncRainAudio() {
    if (!rainAudio) return;
    if (enabled && !document.hidden) {
      const p = rainAudio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      try {
        rainAudio.pause();
      } catch (e) {}
    }
  }

  function playThunderAudio(isSheetOnly) {
    if (!thunderAudio || !enabled || document.hidden) return;
    try {
      thunderAudio.volume = isSheetOnly ? 0.48 : (0.65 + Math.random() * 0.2);
      thunderAudio.currentTime = 0;
    } catch (e) {}
    const p = thunderAudio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  function stopAllAudio() {
    try {
      if (rainAudio) rainAudio.pause();
      if (thunderAudio) {
        thunderAudio.pause();
        thunderAudio.currentTime = 0;
      }
    } catch (e) {}
  }

  /* Unlock audio on first user gesture (required by mobile/desktop browsers) */
  function unlockAudio() {
    if (enabled && !document.hidden && rainAudio && rainAudio.paused) {
      syncRainAudio();
    }
  }
  ["pointerdown", "touchstart", "keydown", "click"].forEach(evt => {
    window.addEventListener(evt, unlockAudio, { passive: true });
  });

  let w = 0, h = 0, dpr = 1;
  let drops = [];
  let splashes = [];
  let clouds = [];
  let rafId = 0;
  let lastTime = 0;

  /* Lightning state — random every 3-6s, capped at <= 3 flashes/sec and <= 0.35 alpha */
  let nextLightningAt = 0;
  let activeFlash = null;
  const flashPeakTimestamps = [];

  const ANGLE = 12 * (Math.PI / 180); // ~12 degrees slant
  const SIN_A = Math.sin(ANGLE);
  const COS_A = Math.cos(ANGLE);

  const LAYERS = [
    { speed: 520, len: 14, alpha: 0.22, width: 1.0, share: 0.45 },
    { speed: 780, len: 22, alpha: 0.38, width: 1.3, share: 0.35 },
    { speed: 1080, len: 32, alpha: 0.58, width: 1.7, share: 0.20 }
  ];

  function scheduleNextLightning(now) {
    nextLightningAt = now + 3000 + Math.random() * 3000; // 3-6 seconds
  }

  function initScene() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth || 360;
    h = window.innerHeight || 640;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isPhone = w <= 500;
    const maxDrops = isPhone ? 170 : 280;
    const count = Math.min(maxDrops, Math.max(70, Math.round((w * h) / 4800)));

    drops = new Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const li = r < LAYERS[0].share ? 0 : (r < LAYERS[0].share + LAYERS[1].share ? 1 : 2);
      const L = LAYERS[li];
      drops[i] = {
        x: Math.random() * (w + 120) - 60,
        y: Math.random() * h,
        li: li,
        speed: L.speed * (0.9 + Math.random() * 0.2),
        len: L.len * (0.85 + Math.random() * 0.3),
        alpha: L.alpha,
        width: L.width,
        yellow: Math.random() < 0.025
      };
    }

    const splashCount = isPhone ? 18 : 30;
    splashes = new Array(splashCount);
    for (let i = 0; i < splashCount; i++) {
      splashes[i] = {
        x: Math.random() * w,
        y: h - 6 - Math.random() * 28,
        r: Math.random() * 8,
        maxR: 5 + Math.random() * 7,
        yellow: Math.random() < 0.05
      };
    }

    clouds = [
      { x: w * 0.15, y: h * 0.12, rx: w * 0.48, ry: h * 0.22, vx: 8 },
      { x: w * 0.65, y: h * 0.08, rx: w * 0.52, ry: h * 0.25, vx: 12 },
      { x: w * 0.40, y: h * 0.20, rx: w * 0.45, ry: h * 0.18, vx: 6 }
    ];
  }

  function buildBoltSegments(startX, startY, endY) {
    const segs = [];
    let cx = startX;
    let cy = startY;
    const steps = 14;
    const dy = (endY - startY) / steps;
    for (let i = 0; i < steps; i++) {
      const nx = cx + (Math.random() - 0.46) * 48;
      const ny = cy + dy;
      segs.push({ x1: cx, y1: cy, x2: nx, y2: ny, main: true });
      if (i > 2 && i < steps - 2 && Math.random() < 0.38) {
        let bx = nx, by = ny;
        const dir = Math.random() < 0.5 ? -1 : 1;
        for (let b = 0; b < 4; b++) {
          const bnx = bx + dir * (12 + Math.random() * 24);
          const bny = by + dy * (0.75 + Math.random() * 0.4);
          segs.push({ x1: bx, y1: by, x2: bnx, y2: bny, main: false });
          bx = bnx;
          by = bny;
        }
      }
      cx = nx;
      cy = ny;
    }
    return segs;
  }

  function canTriggerPeak(now) {
    while (flashPeakTimestamps.length && now - flashPeakTimestamps[0] > 1000) {
      flashPeakTimestamps.shift();
    }
    return flashPeakTimestamps.length < 3;
  }

  function triggerLightning(now) {
    if (reduceMotion || !canTriggerPeak(now)) {
      scheduleNextLightning(now);
      return;
    }
    const isSheetOnly = Math.random() < 0.32;
    const startX = w * (0.15 + Math.random() * 0.7);
    activeFlash = {
      start: now,
      duration: 400,
      boltDuration: 110 + Math.random() * 40, // 110-150 ms
      sheetOnly: isSheetOnly,
      x: startX,
      segs: isSheetOnly ? null : buildBoltSegments(startX, 0, h * (0.58 + Math.random() * 0.25)),
      peak1Recorded: false,
      peak2Recorded: false
    };
    flashPeakTimestamps.push(now);
    activeFlash.peak1Recorded = true;
    playThunderAudio(isSheetOnly);
    scheduleNextLightning(now);
  }

  function getFlashAlpha(now) {
    if (!activeFlash) return 0;
    const t = now - activeFlash.start;
    if (t > activeFlash.duration) {
      activeFlash = null;
      return 0;
    }
    /* Flicker envelope: on (0-80ms), off dip (80-135ms), on (135-210ms), decay (210-400ms) */
    let a = 0;
    if (t < 80) {
      a = 0.32 * Math.sin((t / 80) * Math.PI);
    } else if (t < 135) {
      a = 0.04;
    } else if (t < 210) {
      if (!activeFlash.peak2Recorded) {
        if (canTriggerPeak(now)) {
          flashPeakTimestamps.push(now);
          activeFlash.peak2Recorded = true;
        } else {
          return 0.04;
        }
      }
      a = 0.28 * Math.sin(((t - 135) / 75) * Math.PI);
    } else {
      const k = 1 - (t - 210) / (activeFlash.duration - 210);
      a = 0.20 * k * k;
    }
    return Math.min(0.34, Math.max(0, a));
  }

  function drawFrame(now, dt) {
    ctx.clearRect(0, 0, w, h);

    const flashAlpha = reduceMotion ? 0 : getFlashAlpha(now);

    /* 1. Drifting dark-blue clouds (brighten softly during flash) */
    for (let i = 0; i < clouds.length; i++) {
      const c = clouds[i];
      if (!reduceMotion) {
        c.x += c.vx * dt;
        if (c.x - c.rx > w) c.x = -c.rx * 0.8;
      }
      const g = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.rx);
      const boost = flashAlpha * 0.55;
      g.addColorStop(0, `rgba(${Math.round(18 + boost * 150)}, ${Math.round(42 + boost * 170)}, ${Math.round(125 + boost * 120)}, ${0.28 + boost})`);
      g.addColorStop(1, "rgba(3, 4, 13, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    /* 2. Full-screen pale blue-white flash (never pure white, max ~34% opacity) */
    if (flashAlpha > 0.005) {
      ctx.fillStyle = `rgba(180, 212, 255, ${flashAlpha.toFixed(3)})`;
      ctx.fillRect(0, 0, w, h);
    }

    /* 3. Jagged forked lightning bolt (100-150 ms) */
    if (activeFlash && !activeFlash.sheetOnly && (now - activeFlash.start) <= activeFlash.boltDuration) {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(130, 215, 255, 0.9)";
      ctx.shadowBlur = 16;
      const segs = activeFlash.segs;
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        ctx.strokeStyle = s.main ? "rgba(218, 238, 255, 0.92)" : "rgba(165, 210, 255, 0.65)";
        ctx.lineWidth = s.main ? 2.3 : 1.1;
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
        ctx.stroke();
      }
      ctx.restore();
    }

    /* 4. Slanted rain streaks (3 depth layers + sparse neon-yellow streaks) */
    ctx.lineCap = "round";
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      if (!reduceMotion) {
        d.x += SIN_A * d.speed * dt;
        d.y += COS_A * d.speed * dt;
        if (d.y > h + 30 || d.x > w + 60) {
          d.y = -20 - Math.random() * 40;
          d.x = Math.random() * (w + h * SIN_A) - h * SIN_A;
        }
      }
      ctx.lineWidth = d.width;
      ctx.strokeStyle = d.yellow
        ? "rgba(252, 238, 10, 0.78)"
        : `rgba(190, 216, 255, ${d.alpha})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - SIN_A * d.len, d.y - COS_A * d.len);
      ctx.stroke();
    }

    /* 5. Bottom splash ripples */
    if (!reduceMotion) {
      ctx.lineWidth = 1;
      for (let i = 0; i < splashes.length; i++) {
        const sp = splashes[i];
        sp.r += 16 * dt;
        if (sp.r >= sp.maxR) {
          sp.r = 0;
          sp.x = Math.random() * w;
          sp.y = h - 6 - Math.random() * 28;
        }
        const a = (1 - sp.r / sp.maxR) * 0.35;
        ctx.strokeStyle = sp.yellow
          ? `rgba(252, 238, 10, ${a.toFixed(3)})`
          : `rgba(185, 215, 255, ${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.ellipse(sp.x, sp.y, sp.r * 1.8, sp.r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function loop(now) {
    if (!enabled || document.hidden || reduceMotion) {
      rafId = 0;
      return;
    }
    if (!lastTime) lastTime = now;
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    if (now >= nextLightningAt) {
      triggerLightning(now);
    }
    drawFrame(now, dt);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    canvas.style.display = enabled ? "block" : "none";
    if (!enabled) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      ctx.clearRect(0, 0, w, h);
      stopAllAudio();
      return;
    }
    syncRainAudio();
    if (reduceMotion) {
      /* Draw one static subtle rain frame with no flashes */
      drawFrame(performance.now(), 0);
      return;
    }
    if (!rafId && !document.hidden) {
      lastTime = performance.now();
      if (!nextLightningAt) scheduleNextLightning(lastTime);
      rafId = requestAnimationFrame(loop);
    }
  }

  function setStorm(on) {
    enabled = !!on;
    saveState(enabled);
    start();
    const btn = document.getElementById("stormToggle");
    if (btn) {
      btn.setAttribute("aria-pressed", enabled ? "true" : "false");
      btn.textContent = enabled ? "STORM: ON" : "STORM: OFF";
    }
  }

  window.STORM = {
    isOn: () => enabled,
    set: setStorm,
    toggle: () => setStorm(!enabled)
  };

  initScene();
  scheduleNextLightning(performance.now());
  start();

  window.addEventListener("resize", () => {
    initScene();
    if (enabled && reduceMotion) drawFrame(performance.now(), 0);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      stopAllAudio();
    } else {
      lastTime = 0;
      start();
    }
  });
})();
