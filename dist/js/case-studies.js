/* =========================================================================
   KRE8TIVE MINDS — Case Studies
   Single data store powering the reusable case-study.html template.
   Each portfolio tile links to: case-study.html?id=<slug>
   To add a new case study, just add an entry below — no new HTML needed.
   ========================================================================= */
(function () {
  "use strict";

  // Helper: build an Unsplash URL from a photo id
  const img = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 800}&q=80`;

  // Reusable image ids (placeholders — swap for real event photography)
  const P = {
    summit: "1505373877841-8d25f7d46678",
    speaker: "1475721027785-f74eccf877e2",
    launch: "1540575467063-178a50c2df87",
    popup: "1531058020387-3be344556be6",
    gala: "1464366400600-7168b8af9bc3",
    network: "1523580494863-6f3031224c94",
    lights: "1511795409834-ef04bbd61622",
    confetti: "1492684223066-81342ee5ff30",
    team: "1556761175-b413da4baf72",
  };

  const DATA = {
    "annual-leadership-summit": {
      title: "Annual Leadership Summit",
      cat: "corporate", catLabel: "Corporate Event",
      meta: "900 delegates · 2 days · Mumbai",
      hero: P.summit,
      overview: "A two-day flagship summit bringing 900 leaders together to align on strategy, celebrate the year's wins and set the agenda ahead.",
      challenge: "Nine hundred senior stakeholders, a packed two-day programme and zero tolerance for downtime — all under intense leadership scrutiny.",
      approach: [
        "Designed the theme, stage and full run-of-show",
        "Managed venue, AV, multi-session scheduling and rehearsals",
        "Coordinated speakers, catering and delegate hospitality",
        "Ran the live show with a minute-by-minute production crew",
      ],
      gallery: [P.speaker, P.team, P.confetti],
      results: [
        { num: "900", label: "leaders hosted" },
        { num: "2 days", label: "flawless run" },
        { num: "96%", label: "satisfaction score" },
      ],
      quote: { text: "The most seamless internal event we've ever run. Every detail was handled before we even thought to ask.", who: "Sneha Rao", role: "Events Lead, Nimbus" },
    },

    "tech-founders-conference": {
      title: "Tech Founders Conference",
      cat: "conferences", catLabel: "Conference",
      meta: "1,200 attendees · single track · Bengaluru",
      hero: P.speaker,
      overview: "A single-track flagship conference for 1,200 founders, operators and investors — built around big-stage keynotes and high-value networking.",
      challenge: "Scaling registration, AV and hospitality for 1,200 delegates while keeping the experience intimate and the schedule on time.",
      approach: [
        "Built delegate registration, ticketing and check-in flow",
        "Engineered the main stage, AV and live-stream setup",
        "Managed 20+ speakers, green rooms and run-throughs",
        "Curated networking lounges, catering and after-party",
      ],
      gallery: [P.summit, P.network, P.lights],
      results: [
        { num: "1,200", label: "attendees" },
        { num: "20+", label: "speakers managed" },
        { num: "4.8/5", label: "delegate rating" },
      ],
      quote: { text: "Flawless logistics across two days. We've already rebooked for next year.", who: "Sneha Rao", role: "Events Lead, Nimbus" },
    },

    "global-trade-expo-pavilion": {
      title: "Global Trade Expo Pavilion",
      cat: "exhibitions", catLabel: "Exhibition",
      meta: "Custom-build stand · Delhi",
      hero: P.launch,
      overview: "A show-stopping custom pavilion designed to own the floor at a national trade expo and turn footfall into qualified leads.",
      challenge: "Standing out among hundreds of exhibitors and converting casual visitors into captured, sales-ready leads.",
      approach: [
        "Designed and fabricated a double-height brand pavilion",
        "Engineered lighting, LED walls and product displays",
        "Built footfall-driving demos and live activations",
        "Deployed trained staff and a lead-capture system",
      ],
      gallery: [P.popup, P.network, P.summit],
      results: [
        { num: "3,400", label: "stand visitors" },
        { num: "640", label: "leads captured" },
        { num: "#1", label: "most-visited stand" },
      ],
      quote: null,
    },

    "international-dealer-meet": {
      title: "International Dealer Meet",
      cat: "mice", catLabel: "MICE & Incentives",
      meta: "3-day incentive program · Dubai",
      hero: P.network,
      overview: "A three-day international incentive program rewarding 600 top-performing partners with business sessions, experiences and evenings to remember.",
      challenge: "Coordinating travel, visas, venues and a multi-day agenda for 600 delegates across an international destination — as a reward, not a chore.",
      approach: [
        "Sourced destination, hotels and conference venues",
        "Managed flights, visas and ground logistics end to end",
        "Designed business sessions plus curated team experiences",
        "Ran on-ground hospitality and delegate management",
      ],
      gallery: [P.lights, P.gala, P.confetti],
      results: [
        { num: "600", label: "delegates flown" },
        { num: "3 cities", label: "seamless program" },
        { num: "0", label: "logistics escalations" },
      ],
      quote: { text: "Travel, venues, sessions and evenings across three cities without a hitch. Our partners are still talking about it.", who: "Vikram Shah", role: "GM Sales, Indigo Co." },
    },

    "flagship-product-reveal": {
      title: "Flagship Product Reveal",
      cat: "launches", catLabel: "Product Launch",
      meta: "Press launch · 400 guests",
      hero: P.launch,
      overview: "A high-impact press and partner launch built to earn attention, media pickup and conversation from the moment the curtain dropped.",
      challenge: "Creating a reveal moment memorable enough to dominate press and social — and packing the room with the right audience.",
      approach: [
        "Designed the creative reveal concept and staging",
        "Managed guest list, RSVPs and press coordination",
        "Produced content, photography and live-stream",
        "Coordinated influencers and media on the night",
      ],
      gallery: [P.confetti, P.lights, P.speaker],
      results: [
        { num: "400", label: "guests hosted" },
        { num: "70+", label: "media pickups" },
        { num: "2.1M", label: "social reach" },
      ],
      quote: { text: "Kre8tive Minds took our launch from idea to sold-out reality in six weeks. The press coverage paid for the event twice over.", who: "Aarav Mehta", role: "Head of Marketing, Vertex" },
    },

    "mall-pop-up-activation": {
      title: "Mall Pop-Up Activation",
      cat: "activations", catLabel: "Brand Activation",
      meta: "5 cities · 30-day tour",
      hero: P.popup,
      overview: "A travelling experiential pop-up that put the brand in shoppers' hands across five cities over a 30-day national tour.",
      challenge: "Delivering a consistent, high-energy brand experience — and capturing leads — across five cities and thirty days on the road.",
      approach: [
        "Designed and fabricated a modular, tourable experience",
        "Planned the multi-city rollout and local staffing",
        "Built interactive tech and gamified engagement",
        "Captured leads and reported performance per city",
      ],
      gallery: [P.network, P.confetti, P.lights],
      results: [
        { num: "5 cities", label: "30-day tour" },
        { num: "48k", label: "people engaged" },
        { num: "12k", label: "leads captured" },
      ],
      quote: null,
    },

    "national-awards-night": {
      title: "National Awards Night",
      cat: "awards", catLabel: "Award Function",
      meta: "Black-tie gala · 600 guests",
      hero: P.gala,
      overview: "A black-tie awards gala honouring industry excellence — paced and polished so every honouree felt like the star of the show.",
      challenge: "Keeping a long awards programme tight, glamorous and emotionally engaging across 600 black-tie guests.",
      approach: [
        "Designed the theme, set and trophy presentation",
        "Scripted the show flow and hosting for pace",
        "Programmed entertainment and live performances",
        "Managed red carpet, AV and guest experience",
      ],
      gallery: [P.lights, P.confetti, P.summit],
      results: [
        { num: "600", label: "black-tie guests" },
        { num: "32", label: "awards presented" },
        { num: "3 hrs", label: "perfectly paced" },
      ],
      quote: null,
    },

    "quarterly-town-hall": {
      title: "Quarterly Town Hall",
      cat: "corporate", catLabel: "Corporate Event",
      meta: "Hybrid event · 1,500 viewers",
      hero: P.team,
      overview: "A polished hybrid town hall connecting in-room leadership with 1,500 remote employees on a single, reliable broadcast.",
      challenge: "Delivering one seamless experience for both an in-room audience and 1,500 remote viewers, with broadcast-grade reliability.",
      approach: [
        "Built the broadcast set, AV and streaming stack",
        "Produced live graphics, lower-thirds and roll-ins",
        "Ran rehearsals and a redundant streaming setup",
        "Managed live Q&A across room and remote audiences",
      ],
      gallery: [P.speaker, P.summit, P.network],
      results: [
        { num: "1,500", label: "remote viewers" },
        { num: "99.9%", label: "stream uptime" },
        { num: "0", label: "technical drops" },
      ],
      quote: null,
    },

    "healthcare-innovation-summit": {
      title: "Healthcare Innovation Summit",
      cat: "conferences", catLabel: "Conference",
      meta: "3 stages · 800 delegates",
      hero: P.summit,
      overview: "A multi-stage summit gathering 800 clinicians, founders and investors across three parallel tracks of talks and workshops.",
      challenge: "Running three concurrent stages on schedule while keeping delegates flowing smoothly between sessions.",
      approach: [
        "Scheduled three parallel tracks with zero clashes",
        "Equipped each stage with AV and dedicated crews",
        "Managed 30+ speakers and session changeovers",
        "Designed wayfinding, catering and networking breaks",
      ],
      gallery: [P.speaker, P.network, P.team],
      results: [
        { num: "800", label: "delegates" },
        { num: "3 stages", label: "in sync" },
        { num: "30+", label: "speakers" },
      ],
      quote: null,
    },

    "auto-expo-brand-stand": {
      title: "Auto Expo Brand Stand",
      cat: "exhibitions", catLabel: "Exhibition",
      meta: "Double-decker build · Greater Noida",
      hero: P.launch,
      overview: "A double-decker exhibition stand built to anchor a brand's presence at a major auto expo and host VIP product reveals.",
      challenge: "Maximising impact and hospitality space on a premium footprint — with a private VIP reveal area built in.",
      approach: [
        "Designed a double-decker stand with VIP lounge",
        "Fabricated, transported and installed on-site",
        "Integrated lighting, LED and vehicle displays",
        "Staffed reception, demos and VIP hosting",
      ],
      gallery: [P.popup, P.lights, P.summit],
      results: [
        { num: "2 levels", label: "premium build" },
        { num: "5,000+", label: "stand visitors" },
        { num: "40", label: "VIP reveals" },
      ],
      quote: null,
    },

    "sales-incentive-retreat": {
      title: "Sales Incentive Retreat",
      cat: "mice", catLabel: "MICE & Incentives",
      meta: "Top performers · Bali",
      hero: P.lights,
      overview: "An incentive retreat in Bali rewarding the year's top sales performers with a blend of recognition, relaxation and shared experiences.",
      challenge: "Designing a reward program that felt genuinely special and effortless for high performers — every detail handled.",
      approach: [
        "Sourced resort, experiences and private venues",
        "Managed travel, visas and ground transfers",
        "Designed the recognition evening and team activities",
        "Provided on-trip hosts and 24/7 support",
      ],
      gallery: [P.network, P.gala, P.confetti],
      results: [
        { num: "120", label: "top performers" },
        { num: "5 days", label: "fully hosted" },
        { num: "5/5", label: "experience rating" },
      ],
      quote: null,
    },

    "app-launch-night": {
      title: "App Launch Night",
      cat: "launches", catLabel: "Product Launch",
      meta: "Founder keynote · 350 guests",
      hero: P.launch,
      overview: "An energetic launch night built around a founder keynote, live demo and a celebration that turned users into advocates.",
      challenge: "Translating a digital product into a tangible, exciting in-person moment that drove downloads and buzz.",
      approach: [
        "Designed the keynote stage and live-demo flow",
        "Managed guest list, RSVPs and press",
        "Produced content capture and social amplification",
        "Programmed entertainment and the after-party",
      ],
      gallery: [P.confetti, P.lights, P.speaker],
      results: [
        { num: "350", label: "guests" },
        { num: "18k", label: "launch-week installs" },
        { num: "1.4M", label: "social impressions" },
      ],
      quote: null,
    },

    "festival-brand-experience": {
      title: "Festival Brand Experience",
      cat: "activations", catLabel: "Brand Activation",
      meta: "Music festival zone · Pune",
      hero: P.confetti,
      overview: "An immersive branded zone at a major music festival — a destination within the festival that fans actively sought out.",
      challenge: "Earning attention and dwell time in a high-stimulation festival environment full of competing experiences.",
      approach: [
        "Designed and built an immersive branded zone",
        "Created shareable, interactive installations",
        "Staffed engagement and sampling activations",
        "Captured content and on-ground data",
      ],
      gallery: [P.lights, P.network, P.popup],
      results: [
        { num: "3 days", label: "festival run" },
        { num: "60k", label: "zone footfall" },
        { num: "22k", label: "social shares" },
      ],
      quote: null,
    },

    "excellence-awards-gala": {
      title: "Excellence Awards Gala",
      cat: "awards", catLabel: "Award Function",
      meta: "Recognition night · 500 guests",
      hero: P.gala,
      overview: "A recognition gala celebrating standout teams and individuals, choreographed for emotion, pace and prestige.",
      challenge: "Honouring dozens of winners while keeping the evening glamorous, moving and perfectly on time.",
      approach: [
        "Designed the set, lighting and trophy moment",
        "Scripted and rehearsed the full show flow",
        "Programmed performances and host segments",
        "Managed AV, seating and guest experience",
      ],
      gallery: [P.lights, P.confetti, P.summit],
      results: [
        { num: "500", label: "guests" },
        { num: "28", label: "winners honoured" },
        { num: "100%", label: "on-time finish" },
      ],
      quote: null,
    },
  };

  const order = Object.keys(DATA);

  /* --------------------- Index page render (case-studies.html) ---------- */
  const indexEl = document.querySelector("[data-cs-index]");
  if (indexEl) {
    indexEl.innerHTML = order
      .map((slug) => {
        const d = DATA[slug];
        const stats = d.results
          .map((r) => `<span class="cs-card__stat"><b>${r.num}</b> ${r.label}</span>`)
          .join("");
        return `
        <article class="cs-card reveal">
          <a class="cs-card__media" href="case-study.html?id=${slug}" aria-label="${d.title}">
            <img src="${img(d.hero, 800)}" alt="${d.title} — ${d.catLabel}" loading="lazy" />
          </a>
          <div class="cs-card__body">
            <span class="feature__tag cs-card__tag">${d.catLabel}</span>
            <h3><a href="case-study.html?id=${slug}">${d.title}</a></h3>
            <p>${d.overview}</p>
            <div class="cs-card__stats">${stats}</div>
            <a class="card__link" href="case-study.html?id=${slug}">Read case study <span class="arrow">→</span></a>
          </div>
        </article>`;
      })
      .join("");
    return;
  }

  /* --------------------------- Detail render ---------------------------- */
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const data = id && DATA[id];

  const elNotFound = document.querySelector("[data-cs-notfound]");
  const elArticle = document.querySelector("[data-cs-article]");

  if (!data) {
    if (elNotFound) elNotFound.style.display = "block";
    if (elArticle) elArticle.style.display = "none";
    document.title = "Case study not found | Kre8tive Minds";
    return;
  }

  const set = (sel, value) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = value;
  };

  // Head + hero
  document.title = `${data.title} | Kre8tive Minds`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", data.overview);

  set("[data-cs-eyebrow]", data.catLabel);
  set("[data-cs-crumb]", data.title);
  set("[data-cs-title]", data.title);
  set("[data-cs-overview]", data.overview);
  set("[data-cs-meta]", data.meta);
  set("[data-cs-challenge]", data.challenge);

  const heroImg = document.querySelector("[data-cs-hero-img]");
  if (heroImg) {
    heroImg.src = img(data.hero, 1400);
    heroImg.alt = `${data.title} — ${data.catLabel} by Kre8tive Minds`;
  }

  // Approach list
  const approach = document.querySelector("[data-cs-approach]");
  if (approach) {
    approach.innerHTML = data.approach.map((a) => `<li>${a}</li>`).join("");
  }

  // Results
  const results = document.querySelector("[data-cs-results]");
  if (results) {
    results.innerHTML = data.results
      .map((r) => `<div class="stat"><div class="stat__num">${r.num}</div><div class="stat__lbl">${r.label}</div></div>`)
      .join("");
  }

  // Gallery
  const gallery = document.querySelector("[data-cs-gallery]");
  if (gallery) {
    gallery.innerHTML = data.gallery
      .map((g, i) => `<img src="${img(g, 900)}" alt="${data.title} gallery image ${i + 1}" loading="lazy" />`)
      .join("");
  }

  // Quote
  const quoteWrap = document.querySelector("[data-cs-quote-wrap]");
  if (quoteWrap) {
    if (data.quote) {
      set("[data-cs-quote-text]", data.quote.text);
      set("[data-cs-quote-who]", data.quote.who);
      set("[data-cs-quote-role]", data.quote.role);
    } else {
      quoteWrap.style.display = "none";
    }
  }

  // Prev / Next navigation
  const idx = order.indexOf(id);
  const prev = order[(idx - 1 + order.length) % order.length];
  const next = order[(idx + 1) % order.length];
  const prevLink = document.querySelector("[data-cs-prev]");
  const nextLink = document.querySelector("[data-cs-next]");
  if (prevLink) { prevLink.href = `case-study.html?id=${prev}`; prevLink.querySelector("[data-cs-prev-title]").textContent = DATA[prev].title; }
  if (nextLink) { nextLink.href = `case-study.html?id=${next}`; nextLink.querySelector("[data-cs-next-title]").textContent = DATA[next].title; }
})();
