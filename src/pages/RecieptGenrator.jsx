import { useState, useCallback, useEffect } from "react";
import mainLogo from "../assets/images/mainLogo.jpeg";

import { COMPANY } from "../constants/company";
import { fmt, generateDocNo, today } from "../utils/formatUtils";
import {
  downloadAsPdf,
  pdfBar,
  pdfCompanyBlock,
  pdfClientBlock,
  pdfMetaGrid,
  pdfFooter,
  buildPdfDocument,
} from "../utils/pdfUtils";
import {
  SectionTitle,
  Label,
  Input,
  Textarea,
  ClientDropdown,
  GhostBtn,
  WhatsAppBtn,
  PreviewModal,
} from "../components/index";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const RECEIPT_TYPES = ["Payment Receipt", "Service Receipt"];
const PAYMENT_MODES = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Card",
  "Other",
];

// ─── PDF BUILDER ──────────────────────────────────────────────────────────────
const buildReceiptHtml =
  ({
    client,
    receiptNo,
    date,
    receiptType,
    paymentMode,
    amount,
    referenceNo,
    notes,
    items,
  }) =>
  (logoB64) => {
    const G1 = "linear-gradient(90deg,#16a34a,#059669,#16a34a)";
    const G2 = "linear-gradient(90deg,#14532d,#065f46)";
    const isService = receiptType === "Service Receipt";

    const itemsHTML =
      isService && items.length
        ? `
    <div style="padding:20px 36px 8px">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr style="background:${G2}">
          ${["#", "Description", "Qty", "Rate", "Amount"]
            .map(
              (h, i) =>
                `<th style="padding:10px 12px;color:#86efac;font-size:9px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;text-align:${i > 1 ? "right" : "left"}">${h}</th>`,
            )
            .join("")}
        </tr></thead>
        <tbody>${items
          .filter((i) => i.desc)
          .map((item, idx) => {
            const base =
              (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0);
            return `<tr style="border-bottom:1px solid #f0f0f0;background:${idx % 2 === 0 ? "#fff" : "#f0fdf4"}">
            <td style="padding:10px 12px;color:#bbb;font-size:11px">${idx + 1}</td>
            <td style="padding:10px 12px;font-weight:500;color:#1a1a1a">${item.desc}</td>
            <td style="padding:10px 12px;text-align:right;color:#555">${item.qty}</td>
            <td style="padding:10px 12px;text-align:right;color:#555">₹${Number(item.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            <td style="padding:10px 12px;text-align:right;font-weight:700;color:#1a1a1a">₹${Number(base).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
          </tr>`;
          })
          .join("")}</tbody>
      </table>
    </div>`
        : "";

    const body = `
    ${pdfBar(G1, 6)}
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:28px 36px 22px;border-bottom:1px solid #eee;flex-wrap:wrap;gap:14px">
      ${pdfCompanyBlock(logoB64, "#16a34a")}
      <div style="text-align:right">
        <div style="font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:#e8e8e8;letter-spacing:3px;line-height:1">RECEIPT</div>
        <div style="color:#16a34a;font-size:10px;font-weight:700;letter-spacing:2px;margin-top:4px;text-transform:uppercase">${receiptType}</div>
        ${pdfMetaGrid([["Receipt No", receiptNo], ["Date", date], ["Payment Mode", paymentMode], ...(referenceNo ? [["Reference No", referenceNo]] : [])])}
      </div>
    </div>
    ${pdfClientBlock(client, "Received From", "#16a34a", "#f0fdf4")}
    ${itemsHTML}
    <div style="padding:20px 36px">
      <div style="display:flex;justify-content:flex-end">
        <div style="min-width:280px">
          <div style="display:flex;justify-content:space-between;padding:14px 20px;background:${G2};border-radius:10px">
            <span style="font-family:'Cormorant Garamond',serif;font-size:22px;color:#86efac">Amount Received</span>
            <span style="font-family:'Cormorant Garamond',serif;font-size:22px;color:#fff;font-weight:700">${fmt(parseFloat(amount) || 0)}</span>
          </div>
          <div style="margin-top:6px;text-align:right;font-size:10px;color:#888;font-style:italic">Paid via ${paymentMode}${referenceNo ? ` · Ref: ${referenceNo}` : ""}</div>
        </div>
      </div>
    </div>
    ${notes ? `<div style="padding:12px 36px;border-top:1px solid #eee;background:#f0fdf4"><span style="font-size:9px;color:#16a34a;font-weight:700;letter-spacing:2px;text-transform:uppercase">Notes: </span><span style="font-size:11px;color:#555">${notes}</span></div>` : ""}
    <div style="display:flex;border-top:1px solid #eee;padding:16px 36px;gap:20px">
      <div style="flex:1"><div style="font-size:9px;color:#16a34a;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:22px">Client Signature</div><div style="border-bottom:1px solid #ccc;width:180px;margin-bottom:4px"></div><div style="font-size:10px;color:#999">Signature &amp; Date</div></div>
      <div style="flex:1;text-align:right"><div style="font-size:9px;color:#16a34a;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:22px">Authorised By</div><div style="border-bottom:1px solid #ccc;width:180px;margin-bottom:4px;margin-left:auto"></div><div style="font-size:10px;color:#999">GA Tech Solutions</div></div>
    </div>
    ${pdfFooter(G2, "Thank you for your payment")}
    ${pdfBar(G1, 4)}`;

    return buildPdfDocument(body);
  };

const emptyServiceItem = () => ({
  id: Date.now() + Math.random(),
  desc: "",
  qty: 1,
  rate: "",
});


export default function ReceiptGenerator() {
  const [receiptNo, setReceiptNo] = useState(() => generateDocNo("RCP"));
  const [date] = useState(today);
  const [receiptType, setReceiptType] = useState("Payment Receipt");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [amount, setAmount] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");
  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [items, setItems] = useState([emptyServiceItem()]);
  const [showModal, setShowModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const isService = receiptType === "Service Receipt";
  const itemsTotal = items.reduce(
    (s, i) => s + (parseFloat(i.rate) || 0) * (parseInt(i.qty) || 0),
    0,
  );
  const displayAmount = isService ? itemsTotal : parseFloat(amount) || 0;
  const canPreview =
    client.name.trim() &&
    (isService ? items.every((i) => i.desc && i.rate) : amount);

  const updateItem = (id, f, v) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [f]: v } : i)));
  const addItem = () => setItems((p) => [...p, emptyServiceItem()]);
  const removeItem = (id) =>
    setItems((p) => (p.length > 1 ? p.filter((i) => i.id !== id) : p));

  const handleClose = () => {
    setShowModal(false);
    setClient({ name: "", email: "", phone: "", address: "" });
    setAmount("");
    setReferenceNo("");
    setNotes("");
    setItems([emptyServiceItem()]);
    setReceiptNo(generateDocNo("RCP"));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadPdf = useCallback(() => {
    downloadAsPdf(
      buildReceiptHtml({
        client,
        receiptNo,
        date,
        receiptType,
        paymentMode,
        amount: displayAmount,
        referenceNo,
        notes,
        items,
      }),
      mainLogo,
      setPdfLoading,
    );
  }, [
    client,
    receiptNo,
    date,
    receiptType,
    paymentMode,
    displayAmount,
    referenceNo,
    notes,
    items,
  ]);

  const handleWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(
      `Hello! 👋\n\n🧾 *Receipt No:* ${receiptNo}\n👤 *Client:* ${client.name}\n💰 *Amount:* ${fmt(displayAmount)}\n💳 *Payment Mode:* ${paymentMode}${referenceNo ? `\n🔖 *Ref:* ${referenceNo}` : ""}\n📅 *Date:* ${date}\n\nThank you!\nGA Tech Solutions\n📞 ${COMPANY.phone}`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }, [receiptNo, client, displayAmount, paymentMode, referenceNo, date]);

  // ── Receipt preview doc ────────────────────────────────────────────────────
  const ReceiptDoc = () => (
    <div className="bg-white text-[#1a1a1a] font-sans overflow-hidden w-full relative">
      <div
        style={{
          height: 6,
          background: "linear-gradient(to right,#16a34a,#059669,#16a34a)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "28px 36px 22px",
          borderBottom: "1px solid #f0f0f0",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <img
            src={mainLogo}
            alt="logo"
            className="w-14 h-14 rounded-full object-cover mb-2.5 border-2"
            style={{ borderColor: "#16a34a", boxShadow: "0 0 0 3px #dcfce7" }}
          />
          <div className="font-serif text-[22px] font-bold">{COMPANY.name}</div>
          <div
            style={{
              color: "#16a34a",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "2px",
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
              lineHeight: "1.8",
            }}
          >
            <div>{COMPANY.address}</div>
            <div>
              {COMPANY.email} · {COMPANY.phone}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div
            className="font-serif font-bold leading-none"
            style={{ fontSize: 36, color: "#e0e0e0", letterSpacing: "3px" }}
          >
            RECEIPT
          </div>
          <div
            style={{
              color: "#16a34a",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            {receiptType}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "auto auto",
              gap: "4px 14px",
              textAlign: "left",
            }}
          >
            {[
              ["Receipt No", receiptNo],
              ["Date", date],
              ["Payment Mode", paymentMode],
              ...(referenceNo ? [["Reference No", referenceNo]] : []),
            ].map(([l, v]) => (
              <>
                {/* eslint-disable-next-line react/jsx-key */}
                <span
                  style={{
                    color: "#aaa",
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {l}
                </span>
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a" }}
                >
                  {v}
                </span>
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Received From */}
      <div
        style={{
          padding: "16px 36px",
          borderBottom: "1px solid #f0f0f0",
          background: "#f0fdf4",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#16a34a",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Received From
        </div>
        <div className="font-serif text-lg font-semibold">{client.name}</div>
        {client.email && (
          <div style={{ color: "#555", fontSize: 11.5, marginTop: 2 }}>
            {client.email}
          </div>
        )}
        {client.phone && (
          <div style={{ color: "#555", fontSize: 11.5 }}>{client.phone}</div>
        )}
        {client.address && (
          <div style={{ color: "#555", fontSize: 11.5, marginTop: 2 }}>
            {client.address}
          </div>
        )}
      </div>

      {/* Service items */}
      {isService && (
        <div style={{ padding: "20px 36px 8px" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(to right,#14532d,#065f46)",
                }}
              >
                {["#", "Description", "Qty", "Rate", "Amount"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 12px",
                      color: "#86efac",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "1.2px",
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
              {items
                .filter((i) => i.desc)
                .map((item, idx) => {
                  const base =
                    (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0);
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        background: idx % 2 === 0 ? "#fff" : "#f0fdf4",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#bbb",
                          fontSize: 11,
                        }}
                      >
                        {idx + 1}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontWeight: 500,
                          color: "#1a1a1a",
                        }}
                      >
                        {item.desc}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: "#555",
                        }}
                      >
                        {item.qty}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: "#555",
                        }}
                      >
                        {fmt(item.rate || 0)}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontWeight: 700,
                          color: "#1a1a1a",
                        }}
                      >
                        {fmt(base)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Amount */}
      <div style={{ padding: "20px 36px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ minWidth: 300 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px",
                background: "linear-gradient(135deg,#14532d,#065f46)",
                borderRadius: 10,
              }}
            >
              <span
                className="font-serif"
                style={{ fontSize: 22, color: "#86efac" }}
              >
                Amount Received
              </span>
              <span
                className="font-serif font-bold"
                style={{ fontSize: 22, color: "#fff" }}
              >
                {fmt(displayAmount)}
              </span>
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: 10,
                color: "#888",
                fontStyle: "italic",
                marginTop: 5,
              }}
            >
              Paid via {paymentMode}
              {referenceNo ? ` · Ref: ${referenceNo}` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div
          style={{
            padding: "12px 36px",
            borderTop: "1px solid #f0f0f0",
            background: "#f0fdf4",
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: "#16a34a",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Notes:{" "}
          </span>
          <span style={{ fontSize: 11, color: "#555" }}>{notes}</span>
        </div>
      )}

      {/* Signatures */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #f0f0f0",
          padding: "16px 36px",
          gap: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 9,
              color: "#16a34a",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Client Signature
          </div>
          <div
            style={{
              borderBottom: "1px solid #ccc",
              width: 176,
              marginBottom: 4,
            }}
          />
          <div style={{ fontSize: 10, color: "#999" }}>
            Signature &amp; Date
          </div>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div
            style={{
              fontSize: 9,
              color: "#16a34a",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Authorised By
          </div>
          <div
            style={{
              borderBottom: "1px solid #ccc",
              width: 176,
              marginBottom: 4,
              marginLeft: "auto",
            }}
          />
          <div style={{ fontSize: 10, color: "#999" }}>GA Tech Solutions</div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "linear-gradient(to right,#14532d,#065f46)",
          padding: "10px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#166534", fontSize: 10 }}>
          GA Tech Solutions · ReceiptCraft
        </span>
        <span
          className="font-serif"
          style={{ color: "#86efac", fontSize: 10, fontStyle: "italic" }}
        >
          Thank you for your payment
        </span>
      </div>
      <div
        style={{
          height: 4,
          background: "linear-gradient(to right,#16a34a,#059669,#16a34a)",
        }}
      />
    </div>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07071f] font-sans text-[#f0f0ff]">
      <style>{`
        * { box-sizing: border-box; }
        body { overflow-x: hidden; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        select option { background: #0e0e30; color: #f0f0ff; }

        .rcp-card {
          background: #0f0f35;
          border: 1px solid #2a2a5a;
          border-radius: 18px;
          padding: 28px 32px;
          margin-bottom: 20px;
          width: 100%;
        }
        .rcp-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 20px;
        }
        .rcp-span-2 { grid-column: 1 / -1; }
        .rcp-select {
          width: 100%; padding: 11px 14px;
          background: #12123a; border: 1px solid #3a3a6a;
          border-radius: 8px; color: #f0f0ff;
          font-size: 14px; outline: none;
          transition: border-color 0.15s;
        }
        .rcp-select:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.15); }
        @media (max-width: 560px) {
          .rcp-grid-2 { grid-template-columns: 1fr; }
          .rcp-span-2 { grid-column: 1; }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "48px 40px 80px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 800 }}>
          {/* Heading */}
          <div className="fade-up" style={{ marginBottom: 36 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#001a0a",
                border: "1px solid rgba(22,163,74,0.35)",
                borderRadius: 999,
                padding: "4px 14px",
                marginBottom: 14,
                fontSize: 11,
                color: "#16a34a",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              🧾 Receipt Generator
            </div>
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.15,
                background: "linear-gradient(to right,#4ade80,#059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}
            >
              Create Receipt
            </h1>
            <p className="text-[#7070b0] text-sm" style={{ marginTop: 8 }}>
              Generate a professional payment or service receipt instantly
            </p>
          </div>

          {/* 01 — RECEIPT INFO */}
          <div className="rcp-card fade-up">
            <SectionTitle num="01" title="Receipt Info" accent="green" />
            <div className="rcp-grid-2">
              <div>
                <Label>Receipt Type</Label>
                <select
                  className="rcp-select"
                  value={receiptType}
                  onChange={(e) => setReceiptType(e.target.value)}
                >
                  {RECEIPT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Receipt Number</Label>
                <Input
                  value={receiptNo}
                  readOnly
                  style={{ color: "#4ade80", fontWeight: 600 }}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input value={date} readOnly />
              </div>
              <div>
                <Label>Payment Mode</Label>
                <select
                  className="rcp-select"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  {PAYMENT_MODES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="rcp-span-2">
                <Label>Reference / Transaction No (optional)</Label>
                <Input
                  placeholder="e.g. UPI Ref: 4261XXXXXX"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 02 — CLIENT */}
          <div className="rcp-card fade-up">
            <SectionTitle num="02" title="Client Details" accent="green" />
            <div className="rcp-grid-2">
              <div className="rcp-span-2">
                <ClientDropdown
                  value={client.name}
                  onChange={(name) => setClient((c) => ({ ...c, name }))}
                  onSelect={(preset) => setClient({ ...preset, gstin: "" })}
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input
                  placeholder="client@example.com"
                  value={client.email}
                  onChange={(e) =>
                    setClient({ ...client, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  placeholder="+91-XXXXXXXXXX"
                  value={client.phone}
                  onChange={(e) =>
                    setClient({ ...client, phone: e.target.value })
                  }
                />
              </div>
              <div className="rcp-span-2">
                <Label>Address (optional)</Label>
                <Textarea
                  placeholder="Street, City, State"
                  value={client.address}
                  onChange={(e) =>
                    setClient({ ...client, address: e.target.value })
                  }
                  className="h-16"
                />
              </div>
            </div>
          </div>

          {/* 03 — AMOUNT / SERVICES */}
          <div className="rcp-card fade-up">
            {isService ? (
              <>
                <SectionTitle
                  num="03"
                  title="Services Rendered"
                  accent="green"
                />
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 60px 120px 32px",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <Label>Description</Label>
                      <Input
                        placeholder="Service name"
                        value={item.desc}
                        onChange={(e) =>
                          updateItem(item.id, "desc", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Qty</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(item.id, "qty", e.target.value)
                        }
                        style={{ textAlign: "center" }}
                      />
                    </div>
                    <div>
                      <Label>Rate (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(item.id, "rate", e.target.value)
                        }
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        paddingBottom: 2,
                      }}
                    >
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#5050a0] border border-[#3a3a6a] rounded-lg bg-transparent cursor-pointer transition-all hover:border-red-400 hover:text-red-400"
                        style={{
                          width: 32,
                          height: 38,
                          fontSize: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addItem}
                  className="mt-1 flex items-center gap-2 bg-transparent border border-dashed border-[#2a2a5a] text-[#6060a0] px-4 py-2 rounded-lg cursor-pointer text-sm transition-all hover:border-green-500 hover:text-green-400"
                >
                  + Add Line Item
                </button>
                {/* Total */}
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
                      borderRadius: 14,
                      padding: "16px 20px",
                      minWidth: 280,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Georgia,serif",
                          fontSize: 20,
                          background:
                            "linear-gradient(to right,#4ade80,#059669)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Total Amount
                      </span>
                      <span
                        style={{
                          fontFamily: "Georgia,serif",
                          fontSize: 20,
                          fontWeight: 700,
                          background:
                            "linear-gradient(to right,#4ade80,#059669)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {fmt(itemsTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <SectionTitle num="03" title="Payment Details" accent="green" />
                <div className="rcp-grid-2">
                  <div className="rcp-span-2">
                    <Label>Amount Received (₹)</Label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 5000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        background: "#12123a",
                        border: "1px solid #3a3a6a",
                        borderRadius: 8,
                        color: "#4ade80",
                        fontSize: 28,
                        fontWeight: 700,
                        outline: "none",
                        fontFamily: "sans-serif",
                        lineHeight: 1.5,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#16a34a";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(22,163,74,0.15)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#3a3a6a";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 04 — NOTES */}
          <div className="rcp-card fade-up">
            <SectionTitle num="04" title="Notes (optional)" accent="green" />
            <Textarea
              placeholder="e.g. Payment received for Invoice #GTS-2026... Thank you!"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-24"
            />
          </div>

          {/* Submit */}
          <div
            className="flex flex-col items-end gap-2"
            style={{ marginTop: 8 }}
          >
            <button
              onClick={() => canPreview && setShowModal(true)}
              disabled={!canPreview}
              style={{
                background: canPreview
                  ? "linear-gradient(135deg,#16a34a,#059669)"
                  : "#1a2a1a",
                color: canPreview ? "#fff" : "#3a5a3a",
                padding: "12px 32px",
                fontSize: 15,
                fontWeight: 700,
                border: "none",
                borderRadius: 10,
                cursor: canPreview ? "pointer" : "not-allowed",
                boxShadow: canPreview
                  ? "0 4px 20px rgba(22,163,74,0.35)"
                  : "none",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (canPreview)
                  e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Preview Receipt →
            </button>
            {!canPreview && (
              <p className="text-[#3a3a6a] text-xs m-0">
                Fill client name and {isService ? "all item details" : "amount"}{" "}
                to continue
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showModal && (
        <PreviewModal
          title="Receipt Preview"
          subtitle="Tap outside to close · Download to share with client"
          onClose={handleClose}
          glowColor="rgba(22,163,74,0.15)"
          buttons={
            <>
              <GhostBtn onClick={handleClose}>✕</GhostBtn>
              <WhatsAppBtn onClick={handleWhatsApp}>
                <span>📲</span>
                <span>WhatsApp</span>
              </WhatsAppBtn>
              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                style={{
                  background: "linear-gradient(135deg,#16a34a,#059669)",
                  color: "#fff",
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                  opacity: pdfLoading ? 0.6 : 1,
                }}
              >
                <span>⬇</span>
                <span>{pdfLoading ? "Opening…" : "Download PDF"}</span>
              </button>
            </>
          }
        >
          <ReceiptDoc />
        </PreviewModal>
      )}
    </div>
  );
}
