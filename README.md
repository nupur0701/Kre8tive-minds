# Kre8tive Minds — Website

A premium, responsive marketing website for **Kre8tive Minds**, an event management company in India. Built with plain **HTML, CSS and vanilla JavaScript** — no build step, no dependencies. Open any page in a browser and it just works.

## Pages

| File | Purpose | Conversion goal |
|------|---------|-----------------|
| `index.html` | Home — hero, services, why-us, portfolio, process, stats, testimonials, FAQ, CTA | Request Event Proposal |
| `services.html` | All 10 services with intro, ideal client, problems solved, inclusions, CTA | Request a custom proposal |
| `portfolio.html` | Filterable work showcase by category + "View More" | Explore work → contact |
| `about.html` | Story, mission, vision, 6 values, philosophy, team, milestones | Build trust → contact |
| `contact.html` | Consultation form + contact details + FAQ | Submit consultation request |

## Project structure

```
website-Kre8tive-minds/
├── index.html
├── services.html
├── portfolio.html
├── about.html
├── contact.html
├── assets/
│   ├── css/styles.css   # full design system + components
│   ├── js/main.js       # nav, scroll reveal, counters, FAQ, form, portfolio filter
│   └── img/logo.svg     # brand logo (mark + wordmark)
└── README.md
```

## Design system (visual style guide)

- **Palette** — Ink `#0B0B10` base · Cream `#F6F3EC` text · brand **Orange `#F26A1B`** accent (from the logo) · warm Orange→Amber gradient (`#F2691E → #FF9D4D`)
- **Type** — `Fraunces` (display serif, headings) + `Plus Jakarta Sans` (body), loaded from Google Fonts
- **Radius** — 10 / 16 / 24 / 32px + pill · **Spacing** — 8pt scale (CSS custom properties in `:root`)
- **Motion** — scroll-reveal, animated stat counters, hover lifts; respects `prefers-reduced-motion`
- **Mood** — luxury, creative, premium, modern, vibrant, trustworthy

All tokens live as CSS variables at the top of `assets/css/styles.css` — change brand colors, fonts or spacing in one place.

## Run locally

Just open `index.html` in a browser. Or serve the folder (recommended, for clean relative paths):

```bash
# Python
python -m http.server 8000
# Node
npx serve .
```

Then visit <http://localhost:8000>.

## Before going live

1. **Contact form** — `assets/js/main.js` currently *simulates* submission. Wire the form in `contact.html` to a real backend or service (Formspree, Getform, Netlify Forms, or your own endpoint).
2. **Contact details** — replace placeholder email `hello@kre8tiveminds.in`, phone `+91 90000 00000`, social links and studio cities with the real ones (find/replace across all files).
3. **Images** — portfolio/team images load from Unsplash & pravatar placeholders. Swap them for real event photography for the premium feel (and best SEO).
   - **Logo** — `assets/img/logo.svg` is a scalable SVG recreation of the brand mark. To use your exact raster, save it as `assets/img/logo.png` and update the `src` in the `.brand__logo` `<img>` tags (nav + footer on each page).
4. **Domain / SEO** — update the `canonical` and `og:url` tags (currently `https://www.kre8tiveminds.in/`) and add a `sitemap.xml` + `robots.txt` once the domain is final.
5. **Analytics** — drop in your GA4 / Plausible snippet before `</head>`.

## SEO notes

- Each page has unique `<title>`, meta description, canonical and Open Graph tags.
- Homepage includes `ProfessionalService` JSON-LD structured data.
- Primary keyword: *event management company in India*; related keywords (corporate event planner, conference organizer, exhibition management, MICE event management, brand activation agency, etc.) are woven through the services copy naturally.
- Images use descriptive `alt` text.
