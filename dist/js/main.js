/* =========================================================================
   KRE8TIVE MINDS — Interactions
   - Sticky nav state on scroll
   - Mobile nav toggle
   - Scroll-reveal animations
   - Animated stat counters
   - FAQ accordion
   - Contact form (client-side feedback)
   - Footer year
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- Sticky navbar ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav__toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll("[data-count]");
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) {
      el.textContent = (target % 1 === 0 ? target : target.toFixed(1)) + suffix;
      return;
    }
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const io2 = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            io2.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => io2.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq__item").forEach((item) => {
    const q = item.querySelector(".faq__q");
    const a = item.querySelector(".faq__a");
    if (!q || !a) return;
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.style.maxHeight = open ? a.scrollHeight + "px" : null;
    });
  });

  /* ---------- Contact form ---------- */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const showNotice = (msg, kind) => {
      let box = form.querySelector("[data-form-error]");
      if (!box) {
        box = document.createElement("div");
        box.setAttribute("data-form-error", "");
        box.setAttribute("role", "alert");
        form.appendChild(box);
      }
      const info = kind === "info";
      box.style.cssText =
        "margin-top:1rem;padding:1rem 1.25rem;border-radius:10px;font-size:.92rem;" +
        (info
          ? "border:1px solid var(--gold);background:var(--gold-soft);color:var(--cream);"
          : "border:1px solid #e5484d;background:rgba(229,72,77,0.12);color:#ffb4b4;");
      box.textContent = msg;
      box.style.display = "block";
    };
    const showError = (msg) => showNotice(msg, "error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const success = form.querySelector(".form__success");
      const btn = form.querySelector("button[type=submit]");
      const errBox = form.querySelector("[data-form-error]");
      if (errBox) errBox.style.display = "none";

      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      try {
        // Web3Forms — delivers to the inbox registered to the access key.
        const keyField = form.querySelector('input[name="access_key"]');
        const key = keyField ? keyField.value.trim() : "";
        if (!key || key === "YOUR_ACCESS_KEY_HERE") {
          showNotice(
            "Email delivery isn't configured yet. Get a free access key at web3forms.com (enter Kre8tiveeminds@gmail.com) and paste it into the form's access_key field.",
            "info"
          );
          return;
        }
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success === true) {
          form.reset();
          if (success) {
            success.classList.add("show");
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          throw new Error((data && data.message) || "Submission failed");
        }
      } catch (err) {
        showError("Sorry, we couldn't send your request just now. Please try again, or email Kre8tiveeminds@gmail.com directly.");
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = "Book My Consultation"; }
      }
    });
  }

  /* ---------- Contact: pre-fill from ?city= (city links on home) ---------- */
  if (form) {
    const city = new URLSearchParams(window.location.search).get("city");
    if (city) {
      const safeCity = city.replace(/[<>]/g, "").slice(0, 40);
      const message = form.querySelector("#message");
      if (message && !message.value) {
        message.value = `Hi Kre8tive Minds, I'd like to plan an event in ${safeCity}. Here are the details: `;
      }
      // Friendly banner above the form
      const note = document.createElement("div");
      note.className = "form__success show";
      note.style.marginBottom = "1.25rem";
      note.textContent = `📍 Planning an event in ${safeCity}? You're in the right place — tell us more below.`;
      form.prepend(note);
      // Move focus to the end of the message for a smooth start
      if (message) {
        const len = message.value.length;
        message.focus();
        message.setSelectionRange(len, len);
      }
    }
  }

  /* ---------- Portfolio: category filter + view more ---------- */
  const pf = document.querySelector("[data-portfolio]");
  if (pf) {
    const items = Array.from(pf.querySelectorAll(".pf-item"));
    const chips = Array.from(pf.querySelectorAll(".pf-filter button"));
    const moreBtn = pf.querySelector("[data-pf-more]");
    const moreWrap = pf.querySelector(".pf-more");
    const empty = pf.querySelector("[data-pf-empty]");
    const LIMIT = 9; // items shown before "View More" on the "All" view
    let filter = "all";
    let expanded = false;

    const matches = (it) => filter === "all" || it.dataset.cat === filter;

    const render = () => {
      let shown = 0;
      items.forEach((it) => {
        let show = false;
        if (matches(it)) {
          // Filtered categories show everything; "All" view is capped until expanded
          if (filter !== "all" || expanded || shown < LIMIT) {
            show = true;
            shown++;
          }
        }
        it.style.display = show ? "" : "none";
      });

      const total = items.filter(matches).length;
      const hasMore = filter === "all" && !expanded && total > LIMIT;
      if (moreWrap) moreWrap.style.display = hasMore ? "" : "none";
      if (empty) empty.style.display = total === 0 ? "block" : "none";
    };

    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        filter = chip.dataset.filter;
        expanded = false;
        render();
      })
    );
    if (moreBtn) moreBtn.addEventListener("click", () => { expanded = true; render(); });

    render();
  }

  /* ---------- Portfolio lightbox (image popup) ---------- */
  const lb = document.querySelector("[data-lightbox]");
  if (lb) {
    const lbImg = lb.querySelector("[data-lb-img]");
    const lbTitle = lb.querySelector("[data-lb-title]");
    const lbDesc = lb.querySelector("[data-lb-desc]");
    let list = [];
    let idx = 0;

    const visibleItems = () =>
      Array.from(document.querySelectorAll(".pf-item")).filter((el) => el.style.display !== "none");

    const render = () => {
      const el = list[idx];
      if (!el) return;
      const img = el.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt || "";
      lbTitle.textContent = el.getAttribute("data-title") || "";
      const d = el.getAttribute("data-desc");
      lbDesc.textContent = d ? " · " + d : "";
    };

    let lastFocused = null;
    const openAt = (el) => {
      list = visibleItems();
      idx = list.indexOf(el);
      if (idx < 0) return;
      lastFocused = el;
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      render();
      const closeBtn = lb.querySelector("[data-lb-close]");
      if (closeBtn) closeBtn.focus();
    };
    const close = () => {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lbImg.src = "";
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };
    const step = (dir) => {
      if (!list.length) return;
      idx = (idx + dir + list.length) % list.length;
      render();
    };

    // Make every gallery tile keyboard-operable (button semantics)
    document.querySelectorAll(".pf-item").forEach((el) => {
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      if (!el.getAttribute("aria-label")) {
        const t = el.getAttribute("data-title");
        if (t) el.setAttribute("aria-label", "View " + t);
      }
      el.addEventListener("click", () => openAt(el));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openAt(el);
        }
      });
    });
    lb.querySelector("[data-lb-close]").addEventListener("click", close);
    lb.querySelector("[data-lb-prev]").addEventListener("click", () => step(-1));
    lb.querySelector("[data-lb-next]").addEventListener("click", () => step(1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "Tab") {
        // trap focus within the dialog controls
        const f = Array.from(lb.querySelectorAll("button")).filter((b) => b.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Hero banner video: load after first paint, skip on reduced-motion ---------- */
  const heroVideo = document.querySelector("[data-hero-video]");
  if (heroVideo) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mount = () => {
      if (heroVideo.dataset.loaded || reduce) return;
      heroVideo.dataset.loaded = "1";
      const id = heroVideo.getAttribute("data-yt");
      const f = document.createElement("iframe");
      f.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&mute=1&loop=1&playlist=" + id +
              "&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1";
      f.title = "Kre8tive Minds event showreel";
      f.setAttribute("frameborder", "0");
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      heroVideo.appendChild(f);
    };
    // defer past the initial paint so the poster is the LCP, not YouTube's player
    if (!reduce) {
      if (document.readyState === "complete") setTimeout(mount, 300);
      else window.addEventListener("load", () => setTimeout(mount, 300));
    }
  }

  /* ---------- Logo strip: drag to scroll (desktop) ---------- */
  const marquee = document.querySelector(".marquee");
  if (marquee) {
    let down = false, startX = 0, startScroll = 0, moved = false;
    marquee.addEventListener("pointerdown", (e) => {
      down = true; moved = false;
      startX = e.pageX;
      startScroll = marquee.scrollLeft;
      marquee.classList.add("is-dragging");
    });
    marquee.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 4) moved = true;
      marquee.scrollLeft = startScroll - dx;
    });
    const end = () => { down = false; marquee.classList.remove("is-dragging"); };
    marquee.addEventListener("pointerup", end);
    marquee.addEventListener("pointerleave", end);
    // a drag shouldn't count as a click on a logo
    marquee.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    // vertical wheel -> horizontal scroll while hovering the strip
    marquee.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        marquee.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  }

  /* ---------- Date inputs: open the picker when the whole field is clicked ---------- */
  document.querySelectorAll('input[type="date"]').forEach((inp) => {
    inp.addEventListener("click", () => {
      if (typeof inp.showPicker === "function") {
        try { inp.showPicker(); } catch (e) { /* ignore if already open / not allowed */ }
      }
    });
  });

  /* ---------- Footer year ---------- */
  const yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
