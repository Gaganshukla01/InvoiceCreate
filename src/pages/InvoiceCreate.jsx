import { useState, useEffect, useRef } from "react";
import mainLogo from "../assets/images/mainLogo.jpeg";

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

  const handlePrint = () => {
    const content = document.getElementById("inv-print").innerHTML;
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head>
      <title>Invoice ${invoiceNo}</title>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'DM Sans',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;}@page{size:A4;margin:0;}</style>
    </head><body>${content}
    <script>
      setTimeout(function(){
        var el=document.getElementById('print-qr-target');
        if(el&&window.QRCode){el.innerHTML='';new QRCode(el,{text:decodeURIComponent('${encodeURIComponent(upiString)}'),width:96,height:96,colorDark:'#1a1a1a',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});}
        setTimeout(function(){window.print();window.close();},600);
      },400);
    <\/script></body></html>`);
    w.document.close();
  };

  const InvoiceDoc = () => (
    <div
      id="inv-print"
      style={{
        background: "#fff",
        color: "#1a1a1a",
        fontFamily: "'DM Sans',sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 6,
          background: "linear-gradient(90deg,#7c6fff,#60a5fa,#7c6fff)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "36px 44px 26px",
          borderBottom: "1px solid #eee",
        }}
      >
        <div>
          <img
            src={mainLogo}
            alt="GA Tech Solutions"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 10,
              border: "2px solid #7c6fff",
              boxShadow: "0 0 0 3px #ede9fe",
            }}
          />
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {COMPANY.name}
          </div>
          <div
            style={{
              color: "#7c6fff",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              marginTop: 3,
            }}
          >
            {COMPANY.tagline}
          </div>
          <div
            style={{
              marginTop: 10,
              color: "#555",
              fontSize: 12,
              lineHeight: 1.9,
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
              fontSize: 44,
              fontWeight: 700,
              color: "#dedede",
              letterSpacing: 4,
              lineHeight: 1,
            }}
          >
            INVOICE
          </div>
          <div
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "auto auto",
              gap: "5px 18px",
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
                  color: "#888",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
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
                  fontSize: 12,
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
          padding: "20px 44px",
          borderBottom: "1px solid #eee",
          background: "#f8f8ff",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#7c6fff",
            letterSpacing: 2.5,
            textTransform: "uppercase",
            marginBottom: 7,
          }}
        >
          Bill To
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {client.name}
        </div>
        {client.email && (
          <div style={{ color: "#555", fontSize: 12.5, marginTop: 2 }}>
            {client.email}
          </div>
        )}
        {client.phone && (
          <div style={{ color: "#555", fontSize: 12.5 }}>{client.phone}</div>
        )}
        {client.address && (
          <div
            style={{
              color: "#555",
              fontSize: 12.5,
              marginTop: 2,
              lineHeight: 1.6,
            }}
          >
            {client.address}
          </div>
        )}
        {client.gstin && (
          <div style={{ color: "#888", fontSize: 12, marginTop: 2 }}>
            GSTIN: {client.gstin}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ padding: "26px 44px 10px" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
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
                    padding: "10px 13px",
                    color: "#a5b4fc",
                    fontWeight: 600,
                    fontSize: 10,
                    letterSpacing: 1.5,
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
                      padding: "11px 13px",
                      color: "#aaa",
                      fontSize: 12,
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      padding: "11px 13px",
                      fontWeight: 500,
                      color: "#1a1a1a",
                    }}
                  >
                    {item.desc}
                  </td>
                  <td
                    style={{
                      padding: "11px 13px",
                      textAlign: "right",
                      color: "#555",
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      padding: "11px 13px",
                      textAlign: "right",
                      color: "#555",
                    }}
                  >
                    {fmt(item.rate || 0)}
                  </td>
                  <td
                    style={{
                      padding: "11px 13px",
                      textAlign: "right",
                      color: "#555",
                    }}
                  >
                    {item.tax}%<br />
                    <span style={{ fontSize: 11, color: "#aaa" }}>
                      {fmt(tax)}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "11px 13px",
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

        {/* Totals */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}
        >
          <div style={{ minWidth: 280 }}>
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
                  padding: "6px 0",
                  borderBottom: "1px solid #eee",
                  color: l.startsWith("Discount") ? "#dc2626" : "#666",
                  fontSize: 13,
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
                padding: "12px 16px",
                background: "linear-gradient(135deg,#1e1b4b,#1e3a5f)",
                borderRadius: 8,
                marginTop: 8,
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 20,
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
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "20px 44px",
            borderRight: "1px solid #eee",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#7c6fff",
              letterSpacing: 2.5,
              textTransform: "uppercase",
              marginBottom: 11,
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
                gap: 12,
                marginBottom: 5,
                fontSize: 12.5,
              }}
            >
              <span style={{ color: "#888", minWidth: 100 }}>{l}</span>
              <span style={{ color: "#1a1a1a", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* ── Scan to Pay ── */}
        <div
          style={{
            padding: "20px 28px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            minWidth: 175,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#7c6fff",
              letterSpacing: 2.5,
              textTransform: "uppercase",
            }}
          >
            Scan to Pay
          </div>

          {/* Clickable QR */}
          <div
            onClick={() => setShowPayLink((p) => !p)}
            style={{ cursor: "pointer" }}
            title="Click to get payment link"
          >
            <div
              id="print-qr-target"
              style={{
                width: 96,
                height: 96,
                background: "#fff",
                border: `2px solid ${showPayLink ? "#7c6fff" : "#ddd"}`,
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: showPayLink ? "0 0 0 3px #7c6fff44" : "none",
              }}
            >
              <UpiQRCode upiString={upiString} size={92} />
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#7c6fff",
                textAlign: "center",
                marginTop: 3,
                fontWeight: 600,
              }}
            >
              👆 tap for link
            </div>
          </div>

          {/* Payment link panel */}
          {showPayLink && (
            <div
              style={{
                background: "#ede9fe",
                borderRadius: 8,
                padding: "10px 12px",
                maxWidth: 160,
                textAlign: "center",
                border: "1px solid #7c6fff",
                marginTop: 2,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#5b21b6",
                  marginBottom: 5,
                  letterSpacing: 0.5,
                }}
              >
                UPI Payment Link
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#4338ca",
                  fontWeight: 600,
                  wordBreak: "break-all",
                  marginBottom: 7,
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
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "7px 14px",
                  borderRadius: 6,
                  textDecoration: "none",
                  letterSpacing: 0.3,
                }}
              >
                Pay {total > 0 ? fmt(total) : "Now"} →
              </a>
              <div
                style={{
                  fontSize: 9,
                  color: "#7c7caa",
                  marginTop: 5,
                  lineHeight: 1.4,
                }}
              >
                Opens your UPI app directly
              </div>
            </div>
          )}

          <div style={{ fontSize: 11, color: "#555", fontWeight: 600 }}>
            {COMPANY.upi}
          </div>
          {total > 0 && (
            <div style={{ fontSize: 12, color: "#7c6fff", fontWeight: 700 }}>
              {fmt(total)}
            </div>
          )}

          {/* Auto service list under QR */}
          {serviceList && (
            <div
              style={{
                fontSize: 9,
                maxWidth: 140,
                textAlign: "center",
                lineHeight: 1.6,
                marginTop: 2,
              }}
            >
              <div
                style={{
                  color: "#7c6fff",
                  fontWeight: 700,
                  fontSize: 9,
                  marginBottom: 3,
                  letterSpacing: 0.5,
                }}
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

      {/* Notes */}
      {notes && (
        <div style={{ padding: "13px 44px", borderTop: "1px solid #eee" }}>
          <span
            style={{
              fontSize: 10,
              color: "#7c6fff",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Notes:{" "}
          </span>
          <span style={{ fontSize: 12.5, color: "#555" }}>{notes}</span>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          background: "linear-gradient(90deg,#1e1b4b,#1e3a5f)",
          padding: "11px 44px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#6060aa", fontSize: 11 }}>
          GA Tech Solutions
        </span>
        <span
          style={{
            color: "#a5b4fc",
            fontSize: 11,
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
        * { box-sizing: border-box; }
        input, textarea, select { outline: none; font-family: 'DM Sans', sans-serif; }
        input::placeholder, textarea::placeholder { color: #5050a0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #7c6fff44; border-radius: 4px; }
        .inp:focus { border-color: #7c6fff !important; background: #16164a !important; box-shadow: 0 0 0 3px #7c6fff22; }
        .btn-blue:hover { filter: brightness(1.15); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(124,111,255,0.4) !important; }
        .btn-ghost:hover { background: rgba(124,111,255,0.1) !important; color: #c0c0ff !important; }
        .rm-btn:hover { color: #ff7777 !important; }
        .add-btn:hover { border-color: #7c6fff !important; color: #a0a0ff !important; background: rgba(124,111,255,0.05) !important; }
        .row-hover:hover { background: rgba(124,111,255,0.04) !important; }
        .dd-item:hover { background: #16164a !important; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.6) sepia(1) hue-rotate(200deg); }
        option { background: #0e0e30; color: #f0f0ff; }
        select { color: #f0f0ff; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform:none; } }
        @keyframes modalBg { from { opacity:0; } to { opacity:1; } }
        @keyframes modalBox { from { opacity:0; transform: scale(0.97) translateY(10px); } to { opacity:1; transform:none; } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .modal-bg { animation: modalBg 0.25s ease both; }
        .modal-box { animation: modalBox 0.3s ease both; }
        @media(max-width:640px) {
          .form-2col { grid-template-columns: 1fr !important; }
          .item-cols { grid-template-columns: 1fr 50px 90px 60px 28px !important; font-size: 12px !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          borderBottom: "1px solid #18184a",
          padding: "0 24px",
          height: 62,
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={mainLogo}
            alt="Logo"
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #7c6fff",
              boxShadow: "0 0 0 3px #7c6fff33",
            }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 0.5,
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
              padding: "8px 20px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 16px rgba(124,111,255,0.35)",
            }}
          >
            Preview Invoice →
          </button>
        )}
      </nav>

      {/* ── FORM ── */}
      <div
        style={{ maxWidth: 820, margin: "0 auto", padding: "44px 24px 80px" }}
      >
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 42,
              fontWeight: 700,
              lineHeight: 1.1,
              background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create Invoice
          </h1>
          <p style={{ color: "#7070b0", marginTop: 8, fontSize: 14 }}>
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
            padding: 28,
            marginBottom: 16,
          }}
        >
          <SectionTitle num="01" title="Client Details" />
          <div
            className="form-2col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
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
                style={{ ...inputSt, height: 80, resize: "vertical" }}
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
            padding: 28,
            marginBottom: 16,
          }}
        >
          <SectionTitle num="02" title="Invoice Details" />
          <div
            className="form-2col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
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
            padding: 28,
            marginBottom: 16,
          }}
        >
          <SectionTitle num="03" title="Services / Items" />
          {/* Column headers */}
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
                padding: "5px 4px",
                borderRadius: 7,
                transition: "background 0.15s",
              }}
            >
              <select
                className="inp"
                style={{ ...inputSt, padding: "9px 10px", fontSize: 13 }}
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
                  padding: "9px 8px",
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
                style={{ ...inputSt, padding: "9px 8px", fontSize: 13 }}
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
              marginTop: 22,
              padding: "16px 18px",
              background: "#0a0a28",
              border: "1px solid #2a2a5a",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              gap: 12,
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
                    padding: "6px 18px",
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
                width: 140,
                padding: "8px 12px",
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
              marginTop: 20,
            }}
          >
            <div
              style={{
                background: "#0a0a28",
                border: "1px solid #2a2a5a",
                borderRadius: 12,
                padding: 20,
                minWidth: 290,
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
                    marginBottom: 10,
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
                  paddingTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 24,
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
            padding: 28,
            marginBottom: 26,
          }}
        >
          <SectionTitle num="04" title="Notes" />
          <textarea
            className="inp"
            style={{ ...inputSt, height: 90, resize: "vertical" }}
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
              padding: "13px 40px",
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

      {/* ── MODAL ── */}
      {showModal && (
        <div
          className="modal-bg"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 16px",
            overflowY: "auto",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="modal-box"
            style={{
              width: "100%",
              maxWidth: 840,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
              flexShrink: 0,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 26,
                  color: "#f0f0ff",
                  fontWeight: 700,
                }}
              >
                Invoice Preview
              </h2>
              <p style={{ color: "#4040a0", fontSize: 12, marginTop: 3 }}>
                Click outside to close · QR is live & scannable · Click QR for
                payment link
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-ghost"
                onClick={handleCloseModal}
                style={{
                  background: "transparent",
                  border: "1px solid #2a2a5a",
                  borderRadius: 8,
                  padding: "9px 18px",
                  color: "#7070b0",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                ✕ Close
              </button>
              <button
                className="btn-blue"
                onClick={handlePrint}
                style={{
                  background: "linear-gradient(135deg,#7c6fff,#60a5fa)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 24px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 16px rgba(124,111,255,0.3)",
                }}
              >
                ⬇ Download PDF
              </button>
            </div>
          </div>
          <div
            className="modal-box"
            style={{
              width: "100%",
              maxWidth: 840,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(124,111,255,0.2)",
              flexShrink: 0,
            }}
          >
            <InvoiceDoc />
          </div>
          <div style={{ height: 40, flexShrink: 0 }} />
        </div>
      )}
    </div>
  );
}
