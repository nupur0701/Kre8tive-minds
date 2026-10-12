/* =========================================================================
   KRE8TIVE MINDS — Portfolio PDF export (designed)
   Branded cover + 2-column card grid (image, category, title, description).
   Fully client-side via jsPDF.
   ========================================================================= */
(function () {
  "use strict";

  const btn = document.querySelector("[data-download-pdf]");
  if (!btn) return;

  const ORANGE = [255, 99, 2];
  const ORANGE_SOFT = [255, 240, 230];
  const INK = [14, 14, 18];
  const CREAM = [246, 243, 236];
  const GREY = [110, 110, 116];
  const LINE = [228, 226, 222];

  /* ---- Load + center-crop an image to a target aspect (cover) ---- */
  function loadImage(url, aspect) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        try {
          const sw = img.naturalWidth, sh = img.naturalHeight;
          let cropW = sw, cropH = sh;
          if (sw / sh > aspect) cropW = sh * aspect;
          else cropH = sw / aspect;
          const sx = (sw - cropW) / 2, sy = (sh - cropH) / 2;
          const outW = 1000, outH = Math.round(outW / aspect);
          const c = document.createElement("canvas");
          c.width = outW; c.height = outH;
          const ctx = c.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, outW, outH);
          ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, outW, outH);
          resolve(c.toDataURL("image/jpeg", 0.82));
        } catch (e) { resolve(null); }
      };
      img.onerror = function () { resolve(null); };
      img.src = url + (url.indexOf("?") > -1 ? "&" : "?") + "pdf=1";
    });
  }

  /* ---- Rasterise the SVG logo for the cover ---- */
  function loadLogo() {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        try {
          const aspect = (img.naturalWidth && img.naturalHeight)
            ? img.naturalWidth / img.naturalHeight : 612 / 223.93;
          const w = 1224, h = Math.round(w / aspect);
          const c = document.createElement("canvas");
          c.width = w; c.height = h;
          c.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve({ data: c.toDataURL("image/png"), aspect: aspect });
        } catch (e) { resolve(null); }
      };
      img.onerror = function () { resolve(null); };
      img.src = "img/logo.svg";
    });
  }

  async function buildPdf() {
    const items = Array.from(document.querySelectorAll(".pf-item"));
    if (!items.length || !window.jspdf) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const PW = doc.internal.pageSize.getWidth();
    const PH = doc.internal.pageSize.getHeight();
    const M = 16;
    const CW = PW - M * 2;

    const setFill = (c) => doc.setFillColor(c[0], c[1], c[2]);
    const setText = (c) => doc.setTextColor(c[0], c[1], c[2]);
    const setDraw = (c) => doc.setDrawColor(c[0], c[1], c[2]);

    /* ================= COVER ================= */
    setFill(INK); doc.rect(0, 0, PW, PH, "F");
    // decorative orange rings (bottom-right)
    setDraw(ORANGE); doc.setLineWidth(0.6);
    doc.circle(PW - 6, PH - 18, 46);
    doc.setLineWidth(0.3);
    doc.circle(PW - 6, PH - 18, 62);
    // small dot cluster (top-right)
    setFill(ORANGE);
    for (let r = 0; r < 3; r++) for (let col = 0; col < 3; col++) {
      doc.circle(PW - 40 + col * 6, 26 + r * 6, 1.1, "F");
    }
    // top accent bar
    setFill(ORANGE); doc.rect(0, 0, PW, 6, "F");

    const logo = await loadLogo();
    if (logo) {
      const lw = 74, lh = lw / logo.aspect;
      doc.addImage(logo.data, "PNG", M, 40, lw, lh);
    }
    setText(ORANGE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("E V E N T   M A N A G E M E N T   ·   I N D I A", M, 92);

    setText(CREAM);
    doc.setFont("times", "bold");
    doc.setFontSize(52);
    doc.text("Portfolio", M, 130);

    setText([200, 198, 192]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
      "A premium event management company crafting corporate events,\nconferences, exhibitions, MICE, launches, activations & more.",
      M, 145
    );

    // bottom contact bar
    setFill(ORANGE); doc.rect(0, PH - 20, PW, 20, "F");
    setText(INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("connect@kre8tiveminds.com     +91 9967129340     www.kre8tiveminds.com", PW / 2, PH - 8, { align: "center" });

    /* ================= CONTENT (2-col card grid) ================= */
    const COLGAP = 8;
    const cardW = (CW - COLGAP) / 2;
    const imgAspect = 2.0;
    const pad = 4;
    const imgW = cardW - pad * 2;
    const imgH = imgW / imgAspect;
    const cardH = pad + imgH + 8 + 5 + 12 + 10 + pad; // img + pill + title + desc
    const rowsPerPage = 3;
    const perPage = rowsPerPage * 2;
    const startY = 24;
    const usableBottom = PH - 12;
    // distribute rows so full pages fill vertically (no bottom whitespace)
    let rowGap = (usableBottom - startY - rowsPerPage * cardH) / (rowsPerPage - 1);
    if (rowGap < 7) rowGap = 7;
    const colX = [M, M + cardW + COLGAP];

    let page = 0;
    function header() {
      page += 1;
      doc.addPage();
      setFill([255, 255, 255]); doc.rect(0, 0, PW, PH, "F");
      setFill(ORANGE); doc.rect(0, 0, PW, 4, "F");
      doc.setFont("times", "bold"); doc.setFontSize(12); setText(INK);
      doc.text("Kre8tive Minds", M, 14);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); setText(GREY);
      doc.text("Selected Work", M + 34, 14);
      doc.text("Page " + page, PW - M, 14, { align: "right" });
      setDraw(LINE); doc.setLineWidth(0.3);
      doc.line(M, 18, PW - M, 18);
    }

    async function drawCard(x, y, el) {
      const imgEl = el.querySelector("img");
      const title = el.getAttribute("data-title") || (imgEl && imgEl.alt) || "Event";
      const desc = el.getAttribute("data-desc") || "";
      const catEl = el.querySelector(".feature__tag");
      const cat = catEl ? catEl.textContent.trim() : "";
      const imgData = imgEl ? await loadImage(imgEl.src, imgAspect) : null;

      // card panel
      setFill([255, 255, 255]); setDraw(LINE); doc.setLineWidth(0.4);
      doc.roundedRect(x, y, cardW, cardH, 3, 3, "FD");

      // image
      if (imgData) {
        doc.addImage(imgData, "JPEG", x + pad, y + pad, imgW, imgH, undefined, "FAST");
      } else {
        setFill([242, 242, 242]); doc.rect(x + pad, y + pad, imgW, imgH, "F");
        setText([170, 170, 170]); doc.setFontSize(8);
        doc.text("(image unavailable)", x + pad + 3, y + pad + imgH / 2);
      }

      let ty = y + pad + imgH + 8;
      // category pill
      if (cat) {
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
        const label = cat.toUpperCase();
        const pw = doc.getTextWidth(label) + 6;
        setFill(ORANGE_SOFT); setDraw(ORANGE); doc.setLineWidth(0.3);
        doc.roundedRect(x + pad, ty - 3.6, pw, 5, 2.5, 2.5, "FD");
        setText(ORANGE);
        doc.text(label, x + pad + 3, ty);
        ty += 6.5;
      }
      // title
      doc.setFont("times", "bold"); doc.setFontSize(13); setText(INK);
      const tLines = doc.splitTextToSize(title, imgW).slice(0, 2);
      doc.text(tLines, x + pad, ty);
      ty += tLines.length * 5.4 + 1.5;
      // description
      if (desc) {
        doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); setText(GREY);
        const dLines = doc.splitTextToSize(desc.replace(/\|/g, "·"), imgW).slice(0, 2);
        doc.text(dLines, x + pad, ty);
      }
    }

    header();
    let slot = 0;
    for (let i = 0; i < items.length; i++) {
      if (slot === perPage) { header(); slot = 0; }
      const col = slot % 2;
      const row = Math.floor(slot / 2);
      const x = colX[col];
      const y = startY + row * (cardH + rowGap);
      await drawCard(x, y, items[i]);
      slot++;
    }

    // footer note on last page
    setText(GREY); doc.setFont("helvetica", "italic"); doc.setFontSize(8);
    doc.text("Kre8tive Minds Productions LLP · Thane, Maharashtra · India", PW / 2, PH - 8, { align: "center" });

    doc.save("Kre8tive-Minds-Portfolio.pdf");
  }

  btn.addEventListener("click", async function () {
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.style.opacity = "0.75";
    btn.textContent = "Preparing PDF…";
    try {
      await buildPdf();
    } catch (e) {
      console.error(e);
      alert("Sorry, the PDF couldn't be generated. Please check your connection and try again.");
    } finally {
      btn.disabled = false;
      btn.style.opacity = "";
      btn.innerHTML = label;
    }
  });
})();
