import { useState, useEffect, useRef, useCallback } from "react";
import mainLogo from "../assets/images/mainLogo.jpeg";

// ─── COMPANY CONFIG ───────────────────────────────────────────────────────────
const COMPANY = {
  name: "GA TECH SOLUTIONS",
  tagline: "Web Development & Digital Solutions",
  email: "gaganshuk@gmail.com",
  phone: "+91-8349061831",
  address: "Jabalpur, Madhya Pradesh, India - 482001",
  gstin: "XXXXXXXXXXXXXXXXXX",
  bank: {
    name: "Gagan Prasad Shukla",
    account: "39652226144",
    ifsc: "SBIN0001260",
    branch: "Satna City Branch",
  },
  upi: "8349061831@upi",
};

const PRESET_CLIENTS = [
  {
    name: "Funingo Adventure Arena",
    email: "funingopark12@gmail.com",
    phone: "+91-9202340761",
    address: "Jabalpur Madhya Pradesh",
    gstin: "23AAJFF2527Q1Z5",
  },
];

const SERVICES = [
  "Website Design",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "UI/UX Design",
  "SEO Optimization",
  "Website Maintenance",
  "E-Commerce Development",
  "Custom Web App",
  "API Integration",
  "Hosting & Deployment",
  "Domain Services",
];

function generateInvoiceNo() {
  const d = new Date();
  return `GTS-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`;
}

const emptyItem = () => ({
  id: Date.now() + Math.random(),
  desc: "",
  qty: 1,
  rate: "",
  tax: 0,
});
const fmt = (n) =>
  `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

function buildUpiString({ upi, payeeName, amount, note }) {
  const p = new URLSearchParams();
  p.set("pa", upi);
  p.set("pn", payeeName);
  if (amount > 0) p.set("am", amount.toFixed(2));
  if (note) p.set("tn", note.slice(0, 100));
  p.set("cu", "INR");
  return `upi://pay?${p.toString()}`;
}

// Convert image src to base64 data URL
function imgToBase64(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 100;
        canvas.height = img.naturalHeight || 100;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const inputSt = {
  width: "100%",
  background: "#12123a",
  border: "1px solid #3a3a6a",
  borderRadius: 8,
  padding: "11px 14px",
  color: "#f0f0ff",
  fontSize: 14,
  fontFamily: "'DM Sans',sans-serif",
};
const labelSt = {
  display: "block",
  color: "#9090c0",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: "uppercase",
  marginBottom: 6,
};

// ─── UPI QR CODE ──────────────────────────────────────────────────────────────
function UpiQRCode({ upiString, size = 96 }) {
  const ref = useRef();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.QRCode) {
      setReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = () => setReady(true);
    document.head.appendChild(s);
  }, []);
  useEffect(() => {
    if (!ready || !ref.current || !upiString) return;
    ref.current.innerHTML = "";
    try {
      new window.QRCode(ref.current, {
        text: upiString,
        width: size,
        height: size,
        colorDark: "#1a1a1a",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.M,
      });
    } catch (e) {
      console.error(e);
    }
  }, [ready, upiString, size]);
  return (
    <div
      ref={ref}
      style={{
        width: size,
        height: size,
        background: "#fff",
        borderRadius: 6,
        overflow: "hidden",
      }}
    />
  );
}

// ─── CLIENT DROPDOWN ─────────────────────────────────────────────────────────
function ClientDropdown({ value, onChange, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const wrapRef = useRef();
  const filtered = query.trim()
    ? PRESET_CLIENTS.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      )
    : PRESET_CLIENTS;
  useEffect(() => {
    const h = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => {
    setQuery(value);
  }, [value]);
  const isCustom =
    query.trim() &&
    !PRESET_CLIENTS.find((c) => c.name.toLowerCase() === query.toLowerCase());
  return (
    <div ref={wrapRef} style={{ position: "relative", gridColumn: "1/-1" }}>
      <label style={labelSt}>Client / Company Name *</label>
      <div style={{ position: "relative" }}>
        <input
          className="inp"
          style={inputSt}
          autoComplete="off"
          placeholder="Search preset clients or type a new name…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        <span
          onClick={() => setOpen((o) => !o)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6060a0",
            cursor: "pointer",
            fontSize: 10,
            userSelect: "none",
          }}
        >
          {open ? "▲" : "▼"}
        </span>
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 500,
            background: "#0e0e30",
            border: "1px solid #3a3a6a",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          {isCustom && (
            <div
              className="dd-item"
              onClick={() => {
                onSelect({
                  name: query,
                  email: "",
                  phone: "",
                  address: "",
                  gstin: "",
                });
                setOpen(false);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: "1px solid #1e1e4a",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#7c6fff", fontSize: 13 }}>✎</span>
              <span style={{ color: "#c0c0e0", fontSize: 13 }}>
                Use "<strong style={{ color: "#fff" }}>{query}</strong>" as new
                client
              </span>
            </div>
          )}
          {filtered.length === 0 && !isCustom && (
            <div
              style={{
                padding: 14,
                color: "#5050a0",
                fontSize: 13,
                textAlign: "center",
              }}
            >
              No preset clients found
            </div>
          )}
          {filtered.map((c) => (
            <div
              key={c.name}
              className="dd-item"
              onClick={() => {
                onSelect(c);
                setQuery(c.name);
                setOpen(false);
              }}
              style={{
                padding: "11px 14px",
                cursor: "pointer",
                borderBottom: "1px solid #14143a",
              }}
            >
              <div style={{ color: "#f0f0ff", fontWeight: 600, fontSize: 13 }}>
                {c.name}
              </div>
              <div style={{ color: "#6060a0", fontSize: 11, marginTop: 2 }}>
                {[c.phone, c.email].filter(Boolean).join(" · ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ num, title }) {
  return (
    <h2
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: 20,
        color: "#f0f0ff",
        marginBottom: 20,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          background: "linear-gradient(135deg,#7c6fff,#60a5fa)",
          color: "#fff",
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 10,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 4,
          letterSpacing: 1,
        }}
      >
        {num}
      </span>
      {title}
    </h2>
  );
}

const initClient = () => ({
  name: "",
  email: "",
  phone: "",
  address: "",
  gstin: "",
});
const initDiscount = () => ({ type: "percent", value: "" });
const initNotes = () =>
  "Thank you for choosing GA Tech Solutions. Payment due within 15 days.";

// ─── INVOICE HTML BUILDER (pure string, no React) ────────────────────────────
// This builds a self-contained HTML string for the PDF — no missing assets,
// no scaling, no React rendering issues.
function buildInvoiceHTML({
  logoB64,
  client,
  items,
  discount,
  discountAmt,
  subtotal,
  taxTotal,
  total,
  invoiceNo,
  date,
  dueDate,
  paid,
  notes,
  serviceList,
  upiString,
  upiNote,
}) {
  const fmtLocal = (n) =>
    `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  const rows = items
    .map((item, idx) => {
      const base = (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0);
      const tax = base * ((parseFloat(item.tax) || 0) / 100);
      return `
      <tr style="border-bottom:1px solid #eee;background:${idx % 2 === 0 ? "#fff" : "#f8f8ff"}">
        <td style="padding:10px 11px;color:#bbb;font-size:11px">${idx + 1}</td>
        <td style="padding:10px 11px;font-weight:500;color:#1a1a1a">${item.desc}</td>
        <td style="padding:10px 11px;text-align:right;color:#555">${item.qty}</td>
        <td style="padding:10px 11px;text-align:right;color:#555">${fmtLocal(item.rate || 0)}</td>
        <td style="padding:10px 11px;text-align:right;color:#555">${item.tax}%<br/><span style="font-size:10px;color:#aaa">${fmtLocal(tax)}</span></td>
        <td style="padding:10px 11px;text-align:right;font-weight:700;color:#1a1a1a">${fmtLocal(base + tax)}</td>
      </tr>`;
    })
    .join("");

  const discountRow =
    discountAmt > 0
      ? `
    <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;color:#dc2626;font-size:12px">
      <span>Discount${discount.type === "percent" ? ` (${discount.value}%)` : " (Flat)"}</span>
      <span>− ${fmtLocal(discountAmt)}</span>
    </div>`
      : "";

  const serviceItems = serviceList
    ? serviceList
        .split(", ")
        .map((s) => `<div style="color:#555;font-size:8px">· ${s}</div>`)
        .join("")
    : "";

  const notesHTML = notes
    ? `
    <div style="padding:11px 36px;border-top:1px solid #eee">
      <span style="font-size:9px;color:#7c6fff;font-weight:700;text-transform:uppercase;letter-spacing:1px">Notes: </span>
      <span style="font-size:11.5px;color:#555">${notes}</span>
    </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'DM Sans',sans-serif;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
</style>
</head>
<body>
<div style="background:#fff;width:794px;overflow:hidden">
  <div style="height:6px;background:linear-gradient(90deg,#7c6fff,#60a5fa,#7c6fff)"></div>

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:28px 36px 22px;border-bottom:1px solid #eee">
    <div>
      ${logoB64 ? `<img src="${logoB64}" style="width:54px;height:54px;border-radius:50%;object-fit:cover;margin-bottom:10px;border:2px solid #7c6fff;display:block"/>` : `<div style="width:54px;height:54px;border-radius:50%;background:#7c6fff;margin-bottom:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px">G</div>`}
      <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700">${COMPANY.name}</div>
      <div style="color:#7c6fff;font-size:9px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;margin-top:2px">${COMPANY.tagline}</div>
      <div style="margin-top:8px;color:#555;font-size:11px;line-height:1.8">
        <div>${COMPANY.address}</div>
        <div>${COMPANY.email} · ${COMPANY.phone}</div>
        <div>GSTIN: ${COMPANY.gstin}</div>
      </div>
    </div>
    <div style="text-align:right">
      <div style="font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;color:#e0e0e0;letter-spacing:4px;line-height:1">INVOICE</div>
      <table style="margin-top:14px;margin-left:auto;border-collapse:collapse">
        <tr><td style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:2px 14px 2px 0">Invoice No</td><td style="font-size:11px;font-weight:700;color:#1a1a1a">${invoiceNo}</td></tr>
        <tr><td style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:2px 14px 2px 0">Date</td><td style="font-size:11px;font-weight:700;color:#1a1a1a">${date}</td></tr>
        <tr><td style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:2px 14px 2px 0">Due Date</td><td style="font-size:11px;font-weight:700;color:#1a1a1a">${dueDate}</td></tr>
        <tr><td style="color:#999;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:2px 14px 2px 0">Status</td><td style="font-size:11px;font-weight:700;color:${paid ? "#16a34a" : "#dc2626"}">${paid ? "PAID" : "UNPAID"}</td></tr>
      </table>
    </div>
  </div>

  <!-- Bill To -->
  <div style="padding:16px 36px;border-bottom:1px solid #eee;background:#f8f8ff">
    <div style="font-size:9px;font-weight:700;color:#7c6fff;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:6px">Bill To</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600">${client.name}</div>
    ${client.email ? `<div style="color:#555;font-size:11.5px;margin-top:2px">${client.email}</div>` : ""}
    ${client.phone ? `<div style="color:#555;font-size:11.5px">${client.phone}</div>` : ""}
    ${client.address ? `<div style="color:#555;font-size:11.5px;margin-top:2px;line-height:1.5">${client.address}</div>` : ""}
    ${client.gstin ? `<div style="color:#888;font-size:11px;margin-top:2px">GSTIN: ${client.gstin}</div>` : ""}
  </div>

  <!-- Table -->
  <div style="padding:20px 36px 8px">
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead>
        <tr style="background:linear-gradient(90deg,#1e1b4b,#1e3a5f)">
          <th style="padding:9px 11px;color:#a5b4fc;font-weight:600;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;text-align:left">#</th>
          <th style="padding:9px 11px;color:#a5b4fc;font-weight:600;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;text-align:left">Service / Description</th>
          <th style="padding:9px 11px;color:#a5b4fc;font-weight:600;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;text-align:right">Qty</th>
          <th style="padding:9px 11px;color:#a5b4fc;font-weight:600;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;text-align:right">Rate</th>
          <th style="padding:9px 11px;color:#a5b4fc;font-weight:600;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;text-align:right">GST</th>
          <th style="padding:9px 11px;color:#a5b4fc;font-weight:600;font-size:9px;letter-spacing:1.2px;text-transform:uppercase;text-align:right">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <!-- Totals -->
    <div style="display:flex;justify-content:flex-end;margin-top:14px">
      <div style="min-width:260px">
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;color:#666;font-size:12px"><span>Subtotal</span><span>${fmtLocal(subtotal)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #eee;color:#666;font-size:12px"><span>Total GST</span><span>${fmtLocal(taxTotal)}</span></div>
        ${discountRow}
        <div style="display:flex;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#1e1b4b,#1e3a5f);border-radius:7px;margin-top:6px;font-family:'Cormorant Garamond',serif;font-size:18px">
          <span style="color:#a5b4fc">Total Due</span>
          <span style="color:#fff;font-weight:700">${fmtLocal(total)}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Bank + QR -->
  <div style="display:flex;border-top:1px solid #eee;background:#f8f8ff">
    <div style="flex:1;padding:16px 36px;border-right:1px solid #eee">
      <div style="font-size:9px;font-weight:700;color:#7c6fff;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:10px">Bank Transfer</div>
      <table style="border-collapse:collapse;font-size:11.5px">
        <tr><td style="color:#888;width:95px;padding-bottom:4px">Account Name</td><td style="font-weight:600;color:#1a1a1a;padding-bottom:4px">${COMPANY.bank.name}</td></tr>
        <tr><td style="color:#888;padding-bottom:4px">Account No</td><td style="font-weight:600;color:#1a1a1a;padding-bottom:4px">${COMPANY.bank.account}</td></tr>
        <tr><td style="color:#888;padding-bottom:4px">IFSC Code</td><td style="font-weight:600;color:#1a1a1a;padding-bottom:4px">${COMPANY.bank.ifsc}</td></tr>
        <tr><td style="color:#888;padding-bottom:4px">Branch</td><td style="font-weight:600;color:#1a1a1a;padding-bottom:4px">${COMPANY.bank.branch}</td></tr>
      </table>
    </div>
    <div style="padding:16px 24px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-width:160px">
      <div style="font-size:9px;font-weight:700;color:#7c6fff;letter-spacing:2.5px;text-transform:uppercase">Scan to Pay</div>
      <div id="pdf-qr" style="width:90px;height:90px;background:#fff;border:2px solid #7c6fff;border-radius:7px;overflow:hidden"></div>
      <div style="font-size:10px;color:#555;font-weight:600">${COMPANY.upi}</div>
      <div style="font-size:11px;color:#7c6fff;font-weight:700">${fmtLocal(total)}</div>
      ${serviceItems ? `<div style="font-size:8px;color:#7c6fff;font-weight:700;margin-top:3px;text-align:center;letter-spacing:0.3px">PAYMENT FOR</div>${serviceItems}` : ""}
    </div>
  </div>

  ${notesHTML}

  <!-- Footer -->
  <div style="background:linear-gradient(90deg,#1e1b4b,#1e3a5f);padding:10px 36px;display:flex;justify-content:space-between;align-items:center">
    <span style="color:#6060aa;font-size:10px">GA Tech Solutions · InvoiceCraft</span>
    <span style="color:#a5b4fc;font-size:10px;font-family:'Cormorant Garamond',serif;font-style:italic">Thank you for your business</span>
  </div>
  <div style="height:4px;background:linear-gradient(90deg,#7c6fff,#60a5fa,#7c6fff)"></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>
  window.onload = function() {
    var el = document.getElementById('pdf-qr');
    if (el && window.QRCode) {
      new QRCode(el, {text: decodeURIComponent('${encodeURIComponent(upiString)}'), width:86, height:86, colorDark:'#1a1a1a', colorLight:'#ffffff', correctLevel: QRCode.CorrectLevel.M});
    }
  };
</script>
</body>
</html>`;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function InvoiceGenerator() {
  const [invoiceNo, setInvoiceNo] = useState(generateInvoiceNo);
  const [date] = useState(() => new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split("T")[0];
  });
  const [client, setClient] = useState(initClient());
  const [items, setItems] = useState([emptyItem()]);
  const [discount, setDiscount] = useState(initDiscount());
  const [notes, setNotes] = useState(initNotes());
  const [paid, setPaid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPayLink, setShowPayLink] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const invoiceRef = useRef();

  const handleCloseModal = () => {
    setShowModal(false);
    setShowPayLink(false);
    setClient(initClient());
    setItems([emptyItem()]);
    setDiscount(initDiscount());
    setNotes(initNotes());
    setPaid(false);
    setInvoiceNo(generateInvoiceNo());
    const d = new Date();
    d.setDate(d.getDate() + 15);
    setDueDate(d.toISOString().split("T")[0]);
  };

  const updateItem = (id, f, v) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [f]: v } : i)));
  const addItem = () => setItems((p) => [...p, emptyItem()]);
  const removeItem = (id) =>
    setItems((p) => (p.length > 1 ? p.filter((i) => i.id !== id) : p));

  const subtotal = items.reduce(
    (s, i) => s + (parseFloat(i.rate) || 0) * (parseInt(i.qty) || 0),
    0,
  );
  const taxTotal = items.reduce(
    (s, i) =>
      s +
      (parseFloat(i.rate) || 0) *
        (parseInt(i.qty) || 0) *
        ((parseFloat(i.tax) || 0) / 100),
    0,
  );
  const discountAmt = discount.value
    ? discount.type === "percent"
      ? (subtotal * (parseFloat(discount.value) || 0)) / 100
      : parseFloat(discount.value) || 0
    : 0;
  const total = Math.max(0, subtotal + taxTotal - discountAmt);

  const serviceList = items
    .filter((i) => i.desc && i.rate)
    .map((i) => `${i.desc}${parseInt(i.qty) > 1 ? ` x${i.qty}` : ""}`)
    .join(", ");
  const upiNote = serviceList
    ? `${invoiceNo} | ${serviceList}`
    : `Payment for ${invoiceNo}`;
  const upiString = buildUpiString({
    upi: COMPANY.upi,
    payeeName: COMPANY.bank.name,
    amount: total,
    note: upiNote,
  });
  const canPreview = client.name.trim() && items.every((i) => i.desc && i.rate);

  // ── Download PDF: open a hidden iframe with full HTML, then trigger print-as-PDF ──
  const handleDownloadPdf = useCallback(async () => {
    setPdfLoading(true);
    try {
      // Convert logo to base64 first
      const logoB64 = await imgToBase64(mainLogo);

      const html = buildInvoiceHTML({
        logoB64,
        client,
        items,
        discount,
        discountAmt,
        subtotal,
        taxTotal,
        total,
        invoiceNo,
        date,
        dueDate,
        paid,
        notes,
        serviceList,
        upiString,
        upiNote,
      });

      // Write into hidden iframe and trigger browser Save-As-PDF
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:none;visibility:hidden;";
      document.body.appendChild(iframe);
      iframe.contentDocument.open();
      iframe.contentDocument.write(html);
      iframe.contentDocument.close();

      // Wait for fonts + QR code to render
      await new Promise((r) => setTimeout(r, 1200));

      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      // Cleanup after a delay
      setTimeout(() => document.body.removeChild(iframe), 3000);
    } catch (err) {
      console.error("PDF error:", err);
      alert("PDF generation failed. Please try again.");
    }
    setPdfLoading(false);
  }, [
    client,
    items,
    discount,
    discountAmt,
    subtotal,
    taxTotal,
    total,
    invoiceNo,
    date,
    dueDate,
    paid,
    notes,
    serviceList,
    upiString,
    upiNote,
  ]);

  // ── WhatsApp share ────────────────────────────────────────────────────────
  const handleWhatsApp = useCallback(async () => {
    setPdfLoading(true);
    try {
      const msg = encodeURIComponent(
        `Hello! 👋\n\nPlease find your invoice details:\n\n📄 *Invoice No:* ${invoiceNo}\n👤 *Client:* ${client.name}\n💰 *Amount Due:* ${fmt(total)}\n📅 *Due Date:* ${dueDate}\n🛠️ *Services:* ${serviceList || "As discussed"}\n\n📱 Pay via UPI: ${COMPANY.upi}\n\nThank you for choosing GA Tech Solutions!\n📞 ${COMPANY.phone}`,
      );
      window.open(`https://wa.me/?text=${msg}`, "_blank");
    } catch (err) {
      console.error(err);
    }
    setPdfLoading(false);
  }, [invoiceNo, client, total, dueDate, serviceList]);

  // ── INVOICE PREVIEW (React, for modal display only) ────────────────────────
  const InvoiceDoc = () => (
    <div
      ref={invoiceRef}
      style={{
        background: "#fff",
        color: "#1a1a1a",
        fontFamily: "'DM Sans',sans-serif",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          height: 6,
          background: "linear-gradient(90deg,#7c6fff,#60a5fa,#7c6fff)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "28px 32px 22px",
          borderBottom: "1px solid #eee",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <img
            src={mainLogo}
            alt="GA Tech Solutions"
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 10,
              border: "2px solid #7c6fff",
              boxShadow: "0 0 0 3px #ede9fe",
              display: "block",
            }}
          />
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {COMPANY.name}
          </div>
          <div
            style={{
              color: "#7c6fff",
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            {COMPANY.tagline}
          </div>
          <div
            style={{
              marginTop: 8,
              color: "#555",
              fontSize: 11,
              lineHeight: 1.8,
            }}
          >
            <div>{COMPANY.address}</div>
            <div>
              {COMPANY.email} · {COMPANY.phone}
            </div>
            <div>GSTIN: {COMPANY.gstin}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 36,
              fontWeight: 700,
              color: "#e0e0e0",
              letterSpacing: 3,
              lineHeight: 1,
            }}
          >
            INVOICE
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "auto auto",
              gap: "4px 14px",
            }}
          >
            {[
              ["Invoice No", invoiceNo],
              ["Date", date],
              ["Due Date", dueDate],
              ["Status", paid ? "PAID" : "UNPAID"],
            ].map(([l, v]) => [
              <span
                key={l + "l"}
                style={{
                  color: "#999",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  textAlign: "left",
                }}
              >
                {l}
              </span>,
              <span
                key={l + "v"}
                style={{
                  color:
                    l === "Status" ? (paid ? "#16a34a" : "#dc2626") : "#1a1a1a",
                  fontSize: 11,
                  fontWeight: 700,
                  textAlign: "left",
                }}
              >
                {v}
              </span>,
            ])}
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div
        style={{
          padding: "16px 32px",
          borderBottom: "1px solid #eee",
          background: "#f8f8ff",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#7c6fff",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Bill To
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {client.name}
        </div>
        {client.email && (
          <div style={{ color: "#555", fontSize: 11.5, marginTop: 2 }}>
            {client.email}
          </div>
        )}
        {client.phone && (
          <div style={{ color: "#555", fontSize: 11.5 }}>{client.phone}</div>
        )}
        {client.address && (
          <div
            style={{
              color: "#555",
              fontSize: 11.5,
              marginTop: 2,
              lineHeight: 1.5,
            }}
          >
            {client.address}
          </div>
        )}
        {client.gstin && (
          <div style={{ color: "#888", fontSize: 11, marginTop: 2 }}>
            GSTIN: {client.gstin}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ padding: "20px 32px 8px" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
        >
          <thead>
            <tr
              style={{ background: "linear-gradient(90deg,#1e1b4b,#1e3a5f)" }}
            >
              {[
                "#",
                "Service / Description",
                "Qty",
                "Rate",
                "GST",
                "Amount",
              ].map((h, i) => (
                <th
                  key={h}
                  style={{
                    padding: "9px 10px",
                    color: "#a5b4fc",
                    fontWeight: 600,
                    fontSize: 9,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    textAlign: i > 1 ? "right" : "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const base =
                (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0);
              const tax = base * ((parseFloat(item.tax) || 0) / 100);
              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #eee",
                    background: idx % 2 === 0 ? "#fff" : "#f8f8ff",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 10px",
                      color: "#bbb",
                      fontSize: 11,
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      fontWeight: 500,
                      color: "#1a1a1a",
                    }}
                  >
                    {item.desc}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      textAlign: "right",
                      color: "#555",
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      textAlign: "right",
                      color: "#555",
                    }}
                  >
                    {fmt(item.rate || 0)}
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      textAlign: "right",
                      color: "#555",
                    }}
                  >
                    {item.tax}%<br />
                    <span style={{ fontSize: 10, color: "#aaa" }}>
                      {fmt(tax)}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "10px 10px",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#1a1a1a",
                    }}
                  >
                    {fmt(base + tax)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}
        >
          <div style={{ minWidth: 255 }}>
            {[
              ["Subtotal", fmt(subtotal)],
              ["Total GST", fmt(taxTotal)],
              ...(discountAmt > 0
                ? [
                    [
                      `Discount${discount.type === "percent" ? ` (${discount.value}%)` : " (Flat)"}`,
                      `− ${fmt(discountAmt)}`,
                    ],
                  ]
                : []),
            ].map(([l, v]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                  borderBottom: "1px solid #eee",
                  color: l.startsWith("Discount") ? "#dc2626" : "#666",
                  fontSize: 12,
                }}
              >
                <span>{l}</span>
                <span>{v}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "linear-gradient(135deg,#1e1b4b,#1e3a5f)",
                borderRadius: 7,
                marginTop: 6,
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 18,
              }}
            >
              <span style={{ color: "#a5b4fc" }}>Total Due</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>
                {fmt(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank + QR */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #eee",
          background: "#f8f8ff",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "16px 32px",
            borderRight: "1px solid #eee",
            minWidth: 190,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#7c6fff",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Bank Transfer
          </div>
          {[
            ["Account Name", COMPANY.bank.name],
            ["Account No", COMPANY.bank.account],
            ["IFSC Code", COMPANY.bank.ifsc],
            ["Branch", COMPANY.bank.branch],
          ].map(([l, v]) => (
            <div
              key={l}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 4,
                fontSize: 11.5,
              }}
            >
              <span style={{ color: "#888", minWidth: 90 }}>{l}</span>
              <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: "16px 22px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            minWidth: 155,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#7c6fff",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Scan to Pay
          </div>
          <div
            onClick={() => setShowPayLink((p) => !p)}
            style={{ cursor: "pointer" }}
            title="Click for payment link"
          >
            <div
              style={{
                width: 88,
                height: 88,
                background: "#fff",
                border: `2px solid ${showPayLink ? "#7c6fff" : "#ccc"}`,
                borderRadius: 7,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.2s",
                boxShadow: showPayLink ? "0 0 0 3px #7c6fff33" : "none",
              }}
            >
              <UpiQRCode upiString={upiString} size={84} />
            </div>
            <div
              style={{
                fontSize: 8,
                color: "#7c6fff",
                textAlign: "center",
                marginTop: 2,
                fontWeight: 600,
              }}
            >
              👆 tap for link
            </div>
          </div>
          {showPayLink && (
            <div
              style={{
                background: "#ede9fe",
                borderRadius: 7,
                padding: "8px 10px",
                maxWidth: 150,
                textAlign: "center",
                border: "1px solid #7c6fff",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#5b21b6",
                  marginBottom: 4,
                }}
              >
                UPI Payment Link
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#4338ca",
                  fontWeight: 600,
                  wordBreak: "break-all",
                  marginBottom: 6,
                }}
              >
                {COMPANY.upi}
              </div>
              <a
                href={upiString}
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg,#7c6fff,#60a5fa)",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "6px 12px",
                  borderRadius: 5,
                  textDecoration: "none",
                }}
              >
                Pay {total > 0 ? fmt(total) : "Now"} →
              </a>
              <div style={{ fontSize: 8, color: "#7c7caa", marginTop: 4 }}>
                Opens UPI app directly
              </div>
            </div>
          )}
          <div style={{ fontSize: 10, color: "#555", fontWeight: 600 }}>
            {COMPANY.upi}
          </div>
          {total > 0 && (
            <div style={{ fontSize: 11, color: "#7c6fff", fontWeight: 700 }}>
              {fmt(total)}
            </div>
          )}
          {serviceList && (
            <div
              style={{
                fontSize: 8,
                maxWidth: 140,
                textAlign: "center",
                lineHeight: 1.5,
                marginTop: 2,
              }}
            >
              <div
                style={{ color: "#7c6fff", fontWeight: 700, marginBottom: 2 }}
              >
                PAYMENT FOR
              </div>
              {serviceList.split(", ").map((s, i) => (
                <div key={i} style={{ color: "#555" }}>
                  · {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {notes && (
        <div style={{ padding: "11px 32px", borderTop: "1px solid #eee" }}>
          <span
            style={{
              fontSize: 9,
              color: "#7c6fff",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Notes:{" "}
          </span>
          <span style={{ fontSize: 11.5, color: "#555" }}>{notes}</span>
        </div>
      )}

      <div
        style={{
          background: "linear-gradient(90deg,#1e1b4b,#1e3a5f)",
          padding: "10px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span style={{ color: "#6060aa", fontSize: 10 }}>
          GA Tech Solutions · InvoiceCraft
        </span>
        <span
          style={{
            color: "#a5b4fc",
            fontSize: 10,
            fontFamily: "'Cormorant Garamond',serif",
            fontStyle: "italic",
          }}
        >
          Thank you for your business
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: "linear-gradient(90deg,#7c6fff,#60a5fa,#7c6fff)",
        }}
      />
    </div>
  );

  // ── PAGE RENDER ─────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07071f",
        fontFamily: "'DM Sans',sans-serif",
        color: "#f0f0ff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;}
        input,textarea,select{outline:none;font-family:'DM Sans',sans-serif;}
        input::placeholder,textarea::placeholder{color:#5050a0;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:#7c6fff44;border-radius:4px;}
        .inp:focus{border-color:#7c6fff !important;background:#16164a !important;box-shadow:0 0 0 3px #7c6fff22;}
        .btn-blue:hover{filter:brightness(1.12);transform:translateY(-1px);}
        .btn-ghost:hover{background:rgba(124,111,255,0.1) !important;color:#c0c0ff !important;}
        .btn-wa:hover{filter:brightness(1.1);transform:translateY(-1px);}
        .rm-btn:hover{color:#ff7777 !important;}
        .add-btn:hover{border-color:#7c6fff !important;color:#a0a0ff !important;background:rgba(124,111,255,0.05) !important;}
        .row-hover:hover{background:rgba(124,111,255,0.04) !important;}
        .dd-item:hover{background:#16164a !important;}
        input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.6) sepia(1) hue-rotate(200deg);}
        option{background:#0e0e30;color:#f0f0ff;}
        select{color:#f0f0ff;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
        @keyframes modalBg{from{opacity:0;}to{opacity:1;}}
        @keyframes modalBox{from{opacity:0;transform:scale(0.97) translateY(10px);}to{opacity:1;transform:none;}}
        .fade-up{animation:fadeUp 0.4s ease both;}
        .modal-bg{animation:modalBg 0.25s ease both;}
        .modal-box{animation:modalBox 0.3s ease both;}
        @media(max-width:600px){
          .form-2col{grid-template-columns:1fr !important;}
          .item-cols{grid-template-columns:1fr 42px 76px 56px 24px !important;font-size:11px !important;gap:5px !important;}
          .modal-header{flex-direction:column !important;align-items:stretch !important;gap:10px !important;}
          .modal-btns{display:grid !important;grid-template-columns:1fr 1fr 1fr !important;gap:6px !important;}
          .modal-btns button{font-size:11px !important;padding:8px 4px !important;}
          .invoice-scaler{transform:scale(0.52);transform-origin:top left;width:192% !important;}
          .invoice-wrapper{overflow:hidden;width:100%;}
        }
        @media(min-width:601px) and (max-width:860px){
          .invoice-scaler{transform:scale(0.75);transform-origin:top left;width:133% !important;}
          .invoice-wrapper{overflow:hidden;width:100%;}
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        style={{
          borderBottom: "1px solid #18184a",
          padding: "0 16px",
          height: 58,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 300,
          background: "rgba(7,7,31,0.97)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={mainLogo}
            alt="Logo"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #7c6fff",
              boxShadow: "0 0 0 2px #7c6fff33",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 17,
              fontWeight: 700,
              background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GA Tech Solutions
          </span>
        </div>
        {canPreview && (
          <button
            className="btn-blue"
            onClick={() => setShowModal(true)}
            style={{
              background: "linear-gradient(135deg,#7c6fff,#60a5fa)",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "7px 14px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 14px rgba(124,111,255,0.35)",
              whiteSpace: "nowrap",
            }}
          >
            Preview →
          </button>
        )}
      </nav>

      {/* FORM */}
      <div
        style={{ maxWidth: 820, margin: "0 auto", padding: "32px 14px 80px" }}
      >
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 34,
              fontWeight: 700,
              lineHeight: 1.1,
              background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create Invoice
          </h1>
          <p style={{ color: "#7070b0", marginTop: 7, fontSize: 14 }}>
            Fill in the details to generate a professional invoice
          </p>
        </div>

        {/* 01 CLIENT */}
        <div
          className="fade-up"
          style={{
            background: "#0f0f35",
            border: "1px solid #2a2a5a",
            borderRadius: 14,
            padding: 22,
            marginBottom: 14,
          }}
        >
          <SectionTitle num="01" title="Client Details" />
          <div
            className="form-2col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <ClientDropdown
              value={client.name}
              onChange={(name) => setClient((c) => ({ ...c, name }))}
              onSelect={(preset) => setClient(preset)}
            />
            {[
              {
                label: "Email Address",
                field: "email",
                ph: "client@example.com",
              },
              { label: "Phone Number", field: "phone", ph: "+91-XXXXXXXXXX" },
              {
                label: "GSTIN (optional)",
                field: "gstin",
                ph: "22AAAAA0000A1Z5",
              },
            ].map((f) => (
              <div key={f.field}>
                <label style={labelSt}>{f.label}</label>
                <input
                  className="inp"
                  style={inputSt}
                  placeholder={f.ph}
                  value={client[f.field]}
                  onChange={(e) =>
                    setClient({ ...client, [f.field]: e.target.value })
                  }
                />
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <label style={labelSt}>Billing Address</label>
              <textarea
                className="inp"
                style={{ ...inputSt, height: 76, resize: "vertical" }}
                placeholder="Street, City, State, PIN"
                value={client.address}
                onChange={(e) =>
                  setClient({ ...client, address: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* 02 INVOICE META */}
        <div
          className="fade-up"
          style={{
            background: "#0f0f35",
            border: "1px solid #2a2a5a",
            borderRadius: 14,
            padding: 22,
            marginBottom: 14,
          }}
        >
          <SectionTitle num="02" title="Invoice Details" />
          <div
            className="form-2col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label style={labelSt}>Invoice Number</label>
              <input
                className="inp"
                style={{ ...inputSt, color: "#a78bfa", fontWeight: 600 }}
                value={invoiceNo}
                readOnly
              />
            </div>
            <div>
              <label style={labelSt}>Invoice Date</label>
              <input
                className="inp"
                style={inputSt}
                type="date"
                value={date}
                readOnly
              />
            </div>
            <div>
              <label style={labelSt}>Due Date</label>
              <input
                className="inp"
                style={inputSt}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <label style={labelSt}>Payment Status</label>
              <select
                className="inp"
                style={inputSt}
                value={paid}
                onChange={(e) => setPaid(e.target.value === "true")}
              >
                <option value="false">Unpaid</option>
                <option value="true">Paid</option>
              </select>
            </div>
          </div>
        </div>

        {/* 03 SERVICES */}
        <div
          className="fade-up"
          style={{
            background: "#0f0f35",
            border: "1px solid #2a2a5a",
            borderRadius: 14,
            padding: 22,
            marginBottom: 14,
          }}
        >
          <SectionTitle num="03" title="Services / Items" />
          <div
            className="item-cols"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 60px 110px 70px 32px",
              gap: 8,
              marginBottom: 8,
              padding: "0 4px",
            }}
          >
            {["Description", "Qty", "Rate (₹)", "GST%", ""].map((h, i) => (
              <span
                key={i}
                style={{
                  color: "#7070b0",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="row-hover item-cols"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 110px 70px 32px",
                gap: 8,
                marginBottom: 8,
                padding: "4px",
                borderRadius: 7,
                transition: "background 0.15s",
              }}
            >
              <select
                className="inp"
                style={{ ...inputSt, padding: "9px 8px", fontSize: 13 }}
                value={item.desc}
                onChange={(e) => updateItem(item.id, "desc", e.target.value)}
              >
                <option value="">Select service…</option>
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input
                className="inp"
                style={{
                  ...inputSt,
                  padding: "9px 6px",
                  textAlign: "center",
                  fontSize: 13,
                }}
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => updateItem(item.id, "qty", e.target.value)}
              />
              <input
                className="inp"
                style={{ ...inputSt, padding: "9px 8px", fontSize: 13 }}
                type="number"
                placeholder="0.00"
                value={item.rate}
                onChange={(e) => updateItem(item.id, "rate", e.target.value)}
              />
              <select
                className="inp"
                style={{ ...inputSt, padding: "9px 6px", fontSize: 13 }}
                value={item.tax}
                onChange={(e) => updateItem(item.id, "tax", e.target.value)}
              >
                {[0, 5, 12, 18, 28].map((t) => (
                  <option key={t} value={t}>
                    {t}%
                  </option>
                ))}
              </select>
              <button
                className="rm-btn"
                onClick={() => removeItem(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3a3a6a",
                  cursor: "pointer",
                  fontSize: 22,
                  transition: "color 0.15s",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="add-btn"
            onClick={addItem}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              border: "1px dashed #2a2a5a",
              color: "#6060a0",
              padding: "8px 16px",
              borderRadius: 7,
              cursor: "pointer",
              fontSize: 13,
              marginTop: 8,
              transition: "all 0.2s",
            }}
          >
            + Add Line Item
          </button>

          {/* DISCOUNT */}
          <div
            style={{
              marginTop: 20,
              padding: "14px 16px",
              background: "#0a0a28",
              border: "1px solid #2a2a5a",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                color: "#7070b0",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              Discount
            </span>
            <div
              style={{
                display: "flex",
                background: "#0d0d30",
                borderRadius: 7,
                overflow: "hidden",
                border: "1px solid #2a2a5a",
              }}
            >
              {["percent", "flat"].map((t) => (
                <button
                  key={t}
                  onClick={() => setDiscount({ type: t, value: "" })}
                  style={{
                    padding: "6px 14px",
                    background:
                      discount.type === t
                        ? "linear-gradient(135deg,#7c6fff,#60a5fa)"
                        : "transparent",
                    color: discount.type === t ? "#fff" : "#5050a0",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    transition: "all 0.2s",
                  }}
                >
                  {t === "percent" ? "%" : "₹"}
                </button>
              ))}
            </div>
            <input
              className="inp"
              type="number"
              min="0"
              placeholder={discount.type === "percent" ? "e.g. 10" : "e.g. 500"}
              value={discount.value}
              onChange={(e) =>
                setDiscount((d) => ({ ...d, value: e.target.value }))
              }
              style={{
                ...inputSt,
                width: 120,
                padding: "8px 10px",
                fontSize: 13,
              }}
            />
            {discountAmt > 0 && (
              <span style={{ color: "#f87171", fontSize: 13, fontWeight: 600 }}>
                − {fmt(discountAmt)} off
              </span>
            )}
          </div>

          {/* Summary */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 18,
            }}
          >
            <div
              style={{
                background: "#0a0a28",
                border: "1px solid #2a2a5a",
                borderRadius: 12,
                padding: 18,
                minWidth: 260,
              }}
            >
              {[
                ["Subtotal", fmt(subtotal)],
                ["GST / Tax", fmt(taxTotal)],
                ...(discountAmt > 0
                  ? [
                      [
                        `Discount${discount.type === "percent" ? ` (${discount.value}%)` : " (Flat)"}`,
                        `− ${fmt(discountAmt)}`,
                      ],
                    ]
                  : []),
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 9,
                    color: l.startsWith("Discount") ? "#f87171" : "#7070b0",
                    fontSize: 13,
                  }}
                >
                  <span>{l}</span>
                  <span>{v}</span>
                </div>
              ))}
              <div
                style={{
                  borderTop: "1px solid #1e1e4a",
                  paddingTop: 11,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 22,
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {fmt(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 04 NOTES */}
        <div
          className="fade-up"
          style={{
            background: "#0f0f35",
            border: "1px solid #2a2a5a",
            borderRadius: 14,
            padding: 22,
            marginBottom: 22,
          }}
        >
          <SectionTitle num="04" title="Notes" />
          <textarea
            className="inp"
            style={{ ...inputSt, height: 86, resize: "vertical" }}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <button
            className="btn-blue"
            onClick={() => canPreview && setShowModal(true)}
            disabled={!canPreview}
            style={{
              background: canPreview
                ? "linear-gradient(135deg,#7c6fff,#60a5fa)"
                : "#0f0f35",
              color: canPreview ? "#fff" : "#3a3a6a",
              border: canPreview ? "none" : "1px solid #2a2a5a",
              borderRadius: 9,
              padding: "13px 36px",
              fontWeight: 700,
              fontSize: 15,
              cursor: canPreview ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              opacity: canPreview ? 1 : 0.5,
              boxShadow: canPreview
                ? "0 4px 20px rgba(124,111,255,0.35)"
                : "none",
            }}
          >
            Preview Invoice →
          </button>
          {!canPreview && (
            <p style={{ color: "#3a3a6a", fontSize: 12, margin: 0 }}>
              Fill client name and all item details to continue
            </p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal-bg"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.93)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px",
            overflowY: "auto",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="modal-box modal-header"
            style={{
              width: "100%",
              maxWidth: 860,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              flexShrink: 0,
              gap: 10,
              padding: "0 4px",
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 22,
                  color: "#f0f0ff",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Invoice Preview
              </h2>
              <p style={{ color: "#4040a0", fontSize: 11, margin: "3px 0 0" }}>
                Tap outside to close · Tap QR = payment link
              </p>
            </div>
            <div
              className="modal-btns"
              style={{ display: "flex", gap: 8, flexShrink: 0 }}
            >
              <button
                className="btn-ghost"
                onClick={handleCloseModal}
                style={{
                  background: "transparent",
                  border: "1px solid #2a2a5a",
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: "#7070b0",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                ✕
              </button>
              <button
                className="btn-wa"
                onClick={handleWhatsApp}
                disabled={pdfLoading}
                style={{
                  background: "linear-gradient(135deg,#25d366,#128c7e)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 14px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: pdfLoading ? "wait" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(37,211,102,0.3)",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>📲</span>
                <span>{pdfLoading ? "…" : "WhatsApp"}</span>
              </button>
              <button
                className="btn-blue"
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                style={{
                  background: "linear-gradient(135deg,#7c6fff,#60a5fa)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 14px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: pdfLoading ? "wait" : "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(124,111,255,0.3)",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>⬇</span>
                <span>{pdfLoading ? "Opening…" : "Download PDF"}</span>
              </button>
            </div>
          </div>

          <div
            className="modal-box invoice-wrapper"
            style={{
              width: "100%",
              maxWidth: 860,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 40px 100px rgba(124,111,255,0.15)",
              flexShrink: 0,
            }}
          >
            <div className="invoice-scaler">
              <InvoiceDoc />
            </div>
          </div>
          <div style={{ height: 28, flexShrink: 0 }} />
        </div>
      )}
    </div>
  );
}
