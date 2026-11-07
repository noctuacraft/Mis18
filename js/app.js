/**
 * ============================================================================
 * MIS 18 · EDICIÓN INGENIERÍA EN INFORMÁTICA
 * Lógica: Audio, Entrada, Glitch, Typewriter, Countdown y Agendado Universal
 * ============================================================================
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Elementos DOM
  const gate = document.getElementById("gate");
  const audio = document.getElementById("bgm");
  const musicBtn = document.getElementById("music");
  const numGlitch = document.getElementById("num");
  const typedEl = document.getElementById("typed");
  const textToType = "Venite a festejar mis 18";

  // ==========================================================================
  // 1. CONTROL DE AUDIO Y ECUALIZADOR
  // ==========================================================================
  function updateMusicUI(isPlaying) {
    if (!musicBtn) return;
    musicBtn.classList.toggle("off", !isPlaying);
    musicBtn.setAttribute("aria-pressed", String(isPlaying));
    musicBtn.setAttribute("aria-label", isPlaying ? "Pausar música" : "Activar música");
  }

  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        updateMusicUI(true);
      }).catch(() => {
        updateMusicUI(false);
      });
    } else {
      audio.pause();
      updateMusicUI(false);
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", toggleAudio);
  }

  // ==========================================================================
  // 2. EFECTO GLITCH EN EL NÚMERO 18
  // ==========================================================================
  function triggerGlitch() {
    if (prefersReducedMotion || !numGlitch) return;
    numGlitch.classList.remove("glitch");
    void numGlitch.offsetWidth; // Forzar reflow
    numGlitch.classList.add("glitch");
    setTimeout(() => {
      numGlitch.classList.remove("glitch");
    }, 450);
  }

  if (numGlitch) {
    numGlitch.addEventListener("pointerenter", triggerGlitch);
    numGlitch.addEventListener("pointerdown", triggerGlitch);
  }

  // ==========================================================================
  // 3. EFECTO TERMINAL TYPEWRITER
  // ==========================================================================
  function startTypewriter() {
    if (!typedEl) return;
    if (prefersReducedMotion) {
      typedEl.textContent = textToType;
      return;
    }

    let charIndex = 0;
    function typeChar() {
      typedEl.textContent = textToType.slice(0, ++charIndex);
      if (charIndex < textToType.length) {
        setTimeout(typeChar, 75);
      }
    }
    typeChar();
  }

  // ==========================================================================
  // 4. PRECARGA DE RECURSOS (PRELOADER ASSETS WEBP / JPEG)
  // ==========================================================================
  const gateProgressBar = document.getElementById("gate-progress-bar");
  const gateProgressVal = document.getElementById("gate-progress-val");
  const gateLog = document.getElementById("gate-log");
  const gateBtnText = document.getElementById("gate-btn-text");
  const gateBtnSub = document.getElementById("gate-btn-sub");

  let isReady = false;

  function markReady() {
    if (isReady) return;
    isReady = true;
    if (gate) gate.classList.add("is-ready");
    if (gateProgressBar) gateProgressBar.style.width = "100%";
    if (gateProgressVal) gateProgressVal.textContent = "100%";
    if (gateLog) gateLog.textContent = "> Sistema listo. [OK]";
    if (gateBtnText) gateBtnText.textContent = "init_party() [ENTER]";
    if (gateBtnSub) gateBtnSub.textContent = "// Tocá para acceder a la invitación";
  }

  function checkWebpSupport() {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0 && img.height > 0);
      img.onerror = () => resolve(false);
      img.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
    });
  }

  checkWebpSupport().then((hasWebp) => {
    const ext = hasWebp ? "webp" : "jpeg";
    const totalAssets = 8;
    let loadedAssets = 0;

    // Timeout de seguridad de 3.5s para no bloquear en redes inestables
    const safetyTimeout = setTimeout(markReady, 3500);

    for (let i = 1; i <= totalAssets; i++) {
      const img = new Image();
      const src = `assets/${i}.${ext}`;
      const onDone = () => {
        loadedAssets++;
        const pct = Math.round((loadedAssets / totalAssets) * 100);
        if (gateProgressBar) gateProgressBar.style.width = `${pct}%`;
        if (gateProgressVal) gateProgressVal.textContent = `${pct}%`;
        if (gateLog) gateLog.textContent = `> Cargando foto ${loadedAssets}/${totalAssets} (${ext.toUpperCase()})...`;

        if (loadedAssets >= totalAssets) {
          clearTimeout(safetyTimeout);
          setTimeout(markReady, 120);
        }
      };

      img.onload = () => {
        if ("decode" in img) {
          img.decode().then(onDone).catch(onDone);
        } else {
          onDone();
        }
      };
      img.onerror = onDone;
      img.src = src;
    }
  });

  // ==========================================================================
  // 5. GATE DE ENTRADA (BOOT SYSTEM)
  // ==========================================================================
  if (gate) {
    gate.addEventListener("click", () => {
      if (!isReady) {
        markReady();
      }

      if (audio) {
        audio.volume = 0.65;
        const playPromise = audio.play();
        if (playPromise && playPromise.then) {
          playPromise
            .then(() => updateMusicUI(true))
            .catch(() => updateMusicUI(false));
        }
      }

      gate.classList.add("hide");
      document.body.classList.remove("lock");

      setTimeout(() => {
        gate.style.display = "none";
      }, 750);

      setTimeout(triggerGlitch, 250);
      setTimeout(startTypewriter, 500);
    });
  }

  // ==========================================================================
  // 5. CUENTA REGRESIVA EN TIEMPO REAL AL 19.12
  // ==========================================================================
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins = document.getElementById("cd-mins");
  const cdSecs = document.getElementById("cd-secs");

  function runCountdown() {
    if (!cdDays || !cdHours || !cdMins || !cdSecs) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    let eventDate = new Date(currentYear, 11, 19, 10, 0, 0); // 19 de Diciembre a las 10:00 AM

    if (now > eventDate) {
      eventDate = new Date(currentYear + 1, 11, 19, 10, 0, 0);
    }

    const diff = eventDate - now;

    if (diff <= 0) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMins.textContent = "00";
      cdSecs.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = d < 10 ? "0" + d : String(d);
    cdHours.textContent = h < 10 ? "0" + h : String(h);
    cdMins.textContent = m < 10 ? "0" + m : String(m);
    cdSecs.textContent = s < 10 ? "0" + s : String(s);
  }

  // ==========================================================================
  // 6. GENERADOR DE EVENTO UNIVERSAL (.ICS - CUALQUIER CELULAR)
  // ==========================================================================
  function triggerCalendarDownload() {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mis 18//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:mis-18-20261219@cumple.party",
      "DTSTAMP:20261107T120000Z",
      "DTSTART:20261219T130000Z",
      "DTEND:20261219T220000Z",
      "SUMMARY:Mis 18 · Festejo & Pileta",
      "DESCRIPTION:Cumple de 18. Pileta activa: llevá malla, toalla y ojotas.",
      "LOCATION:Esteban Fernández 790, González Catán, Buenos Aires",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const tempLink = document.createElement("a");
    tempLink.href = url;
    tempLink.setAttribute("download", "mis_18.ics");
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }

  const btnSmartCalendar = document.getElementById("btn-smart-calendar");
  if (btnSmartCalendar) {
    btnSmartCalendar.addEventListener("click", triggerCalendarDownload);
  }

  // ==========================================================================
  // 7. CONSOLE EASTER EGG (INGENIERÍA EN INFORMÁTICA)
  // ==========================================================================
  console.log(
    "%c[INGENIERÍA EN INFORMÁTICA]",
    "color: #00ff9d; font-family: monospace; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(0,255,157,0.5);"
  );
  console.log(
    "%cMIS 18 // Release: v18.0.0-release [STABLE]",
    "color: #34e0ff; font-family: monospace; font-size: 13px;"
  );
  console.log(
    "%c> Stack: Buena música + Pileta + Asado/Bebida + Amigos",
    "color: #ff3fd0; font-family: monospace; font-size: 12px;"
  );
  console.log(
    "%cwhile (fiesta) { disfrutar(); brindar(); repeat(); }",
    "color: #c9d3e6; font-family: monospace; font-size: 11px; font-style: italic;"
  );

  // Inicializaciones
  runCountdown();
  setInterval(runCountdown, 1000);
})();
