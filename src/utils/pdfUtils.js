import { COMPANY } from "../constants/company";

/**
 * Converts a local image src to base64 data URL.
 * Required because hidden iframes can't load local file:// images.
 */
export const imgToBase64 = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth || 100;
        c.height = img.naturalHeight || 100;
        c.getContext("2d").drawImage(img, 0, 0);
        resolve(c.toDataURL("image/jpeg", 0.9));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });

/**
 * Opens a hidden iframe with given HTML and triggers browser print-to-PDF.
 * User selects "Save as PDF" in the system print dialog.
 * @param {string} html   - Full HTML document string
 * @param {number} delay  - ms to wait for fonts/QR to render (default 1200)
 */
export const printHtmlAsPdf = async (html, delay = 1200) => {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;visibility:hidden;";
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  await new Promise((r) => setTimeout(r, delay));
  iframe.contentWindow.focus();
  iframe.contentWindow.print();
  setTimeout(() => {
    if (document.body.contains(iframe)) document.body.removeChild(iframe);
  }, 4000);
};

/**
 * Full PDF flow: logo → base64 → build HTML → print.
 * @param {(logoB64: string) => string} buildHtmlFn  - Returns full HTML string
 * @param {string}   logoSrc   - Import path / URL for logo image
 * @param {Function} setLoading - React setState to toggle loading spinner
 */
export const downloadAsPdf = async (buildHtmlFn, logoSrc, setLoading) => {
  setLoading(true);
  try {
    const logoB64 = await imgToBase64(logoSrc);
    const html = buildHtmlFn(logoB64);
    await printHtmlAsPdf(html);
  } catch (err) {
    console.error("PDF error:", err);
    alert("PDF generation failed. Please try again.");
  }
  setLoading(false);
};

// ─── Shared PDF HTML snippets ─────────────────────────────────────────────────

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>`;
const BASE_STYLE = `<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'DM Sans',sans-serif;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact;}</style>`;

/** Gradient bar (top or bottom) */
export const pdfBar = (gradient, height = 6) =>
  `<div style="height:${height}px;background:${gradient}"></div>`;

/** Company logo + name + tagline + contact block */
export const pdfCompanyBlock = (logoB64, accentColor = "#7c6fff") => `
  <div>
    ${
      logoB64
        ? `<img src="${logoB64}" style="width:54px;height:54px;border-radius:50%;object-fit:cover;margin-bottom:10px;border:2px solid ${accentColor};display:block"/>`
        : `<div style="width:54px;height:54px;border-radius:50%;background:${accentColor};margin-bottom:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px">G</div>`
    }
    <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700">${COMPANY.name}</div>
    <div style="color:${accentColor};font-size:9px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;margin-top:2px">${COMPANY.tagline}</div>
    <div style="margin-top:8px;color:#555;font-size:11px;line-height:1.8">
      <div>${COMPANY.address}</div>
      <div>${COMPANY.email} · ${COMPANY.phone}</div>
      <div>GSTIN: ${COMPANY.gstin}</div>
    </div>
  </div>`;

/** Client / Bill To block */
export const pdfClientBlock = (
  client,
  label = "Bill To",
  accent = "#7c6fff",
  bg = "#f8f8ff",
) => `
  <div style="padding:16px 36px;border-bottom:1px solid #eee;background:${bg}">
    <div style="font-size:9px;font-weight:700;color:${accent};letter-spacing:2.5px;text-transform:uppercase;margin-bottom:6px">${label}</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600">${client.name}</div>
    ${client.email ? `<div style="color:#555;font-size:11.5px;margin-top:2px">${client.email}</div>` : ""}
    ${client.phone ? `<div style="color:#555;font-size:11.5px">${client.phone}</div>` : ""}
    ${client.address ? `<div style="color:#555;font-size:11.5px;margin-top:2px;line-height:1.5">${client.address}</div>` : ""}
    ${client.gstin ? `<div style="color:#888;font-size:11px;margin-top:2px">GSTIN: ${client.gstin}</div>` : ""}
  </div>`;

/** Footer bar */
export const pdfFooter = (
  gradient,
  rightText = "Thank you for your business",
) => `
  <div style="background:${gradient};padding:10px 36px;display:flex;justify-content:space-between;align-items:center">
    <span style="color:rgba(255,255,255,0.25);font-size:10px">GA Tech Solutions</span>
    <span style="color:#fcd34d;font-size:10px;font-family:'Cormorant Garamond',serif;font-style:italic">${rightText}</span>
  </div>`;

/** Meta info grid (Invoice No / Date / Due / Status etc.) */
export const pdfMetaGrid = (rows) => `
  <table style="margin-top:14px;margin-left:auto;border-collapse:collapse">
    ${rows
      .map(
        ([label, value, color]) => `
      <tr>
        <td style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:2px 14px 2px 0;text-align:left">${label}</td>
        <td style="font-size:11px;font-weight:700;color:${color || "#1a1a1a"}">${value}</td>
      </tr>`,
      )
      .join("")}
  </table>`;

/** Table header row */
export const pdfTableHeader = (cols, gradient, textColor = "#a5b4fc") => `
  <tr style="background:${gradient}">
    ${cols.map((c, i) => `<th style="padding:9px 11px;color:${textColor};font-weight:600;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;text-align:${i > 1 ? "right" : "left"}">${c}</th>`).join("")}
  </tr>`;

/** Totals block (subtotal / discount / tax / total) */
export const pdfTotalsBlock = ({
  subtotal,
  taxTotal = 0,
  discountAmt = 0,
  discount = {},
  total,
  gradient,
  accentText = "#a5b4fc",
  totalLabel = "Total Due",
  taxLabel = "Total GST",
  fmtFn,
}) => {
  const f =
    fmtFn ||
    ((n) =>
      `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
  return `
    <div style="display:flex;justify-content:flex-end;margin-top:14px">
      <div style="min-width:260px">
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;color:#666;font-size:12px"><span>Subtotal</span><span>${f(subtotal)}</span></div>
        ${taxTotal > 0 ? `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;color:#666;font-size:12px"><span>${taxLabel}</span><span>${f(taxTotal)}</span></div>` : ""}
        ${discountAmt > 0 ? `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;color:#dc2626;font-size:12px"><span>Discount${discount.type === "percent" ? ` (${discount.value}%)` : " (Flat)"}</span><span>− ${f(discountAmt)}</span></div>` : ""}
        <div style="display:flex;justify-content:space-between;padding:10px 14px;background:${gradient};border-radius:7px;margin-top:6px;font-family:'Cormorant Garamond',serif;font-size:18px">
          <span style="color:${accentText}">${totalLabel}</span>
          <span style="color:#fff;font-weight:700">${f(total)}</span>
        </div>
      </div>
    </div>`;
};

/** Wrap everything into a full HTML document */
export const buildPdfDocument = (bodyContent) => `
<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
${FONTS}
${BASE_STYLE}
</head><body>
<div style="background:#fff;width:794px;overflow:hidden">
  ${bodyContent}
</div>
</body></html>`;
