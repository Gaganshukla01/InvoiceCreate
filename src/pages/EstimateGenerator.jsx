import { useState, useCallback, useEffect } from "react";
import mainLogo from "../assets/images/mainLogo.jpeg";

import { COMPANY } from "../constants/company";
import { VALIDITY_OPTIONS, ESTIMATE_STATUSES } from "../constants/data";
import {
  fmt,
  generateDocNo,
  today,
  addDays,
  emptyItem,
  calcDiscount,
} from "../utils/formatUtils";
import {
  downloadAsPdf,
  pdfBar,
  pdfCompanyBlock,
  pdfClientBlock,
  pdfMetaGrid,
  pdfTableHeader,
  pdfTotalsBlock,
  pdfFooter,
  buildPdfDocument,
} from "../utils/pdfUtils";
import {
  FormCard,
  SectionTitle,
  Label,
  AmberInput,
  AmberSelect,
  Textarea,
  ClientDropdown,
  EstimateLineItems,
  DiscountRow,
  TotalsSummary,
  AmberBtn,
  GhostBtn,
  WhatsAppBtn,
  PreviewModal,
} from "../components/index";

// ─── STATUS COLORS ────────────────────────────────────────────────────────────
const STATUS_COLOR = {
  Draft: "#6b7280",
  Sent: "#3b82f6",
  Approved: "#16a34a",
  Rejected: "#dc2626",
  Revised: "#f59e0b",
};

// ─── ESTIMATE PDF HTML BUILDER ────────────────────────────────────────────────
const buildEstimateHtml =
  ({
    client,
    items,
    subtotal,
    discountAmt,
    discount,
    total,
    estNo,
    date,
    validUntil,
    status,
    terms,
    projectTitle,
  }) =>
  (logoB64) => {
    const AMBER_GRAD = "linear-gradient(90deg,#f59e0b,#f97316,#f59e0b)";
    const BROWN_GRAD = "linear-gradient(90deg,#78350f,#92400e)";
    const statusColor = STATUS_COLOR[status] || "#6b7280";

    const rows = items
      .map((item, idx) => {
        const base = (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0);
        return `<tr style="border-bottom:1px solid #f0f0f0;background:${idx % 2 === 0 ? "#fff" : "#fafafa"}">
      <td style="padding:10px 12px;color:#bbb;font-size:11px">${idx + 1}</td>
      <td style="padding:10px 12px;font-weight:500;color:#1a1a1a">${item.desc}${item.note ? `<div style="font-size:10px;color:#888;margin-top:2px;font-style:italic">${item.note}</div>` : ""}</td>
      <td style="padding:10px 12px;text-align:right;color:#555">${item.qty}</td>
      <td style="padding:10px 12px;text-align:right;color:#555">₹${Number(item.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
      <td style="padding:10px 12px;text-align:right;font-weight:700;color:#1a1a1a">₹${Number(base).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
    </tr>`;
      })
      .join("");

    const termsHTML = terms
      ? terms
          .split("\n")
          .filter(Boolean)
          .map(
            (t) =>
              `<div style="font-size:11px;color:#555;margin-bottom:4px;padding-left:4px">${t}</div>`,
          )
          .join("")
      : "";

    const body = `
    ${status === "Draft" ? `<div style="position:fixed;top:40%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);font-size:96px;font-weight:900;color:rgba(0,0,0,0.04);font-family:'Cormorant Garamond',serif;letter-spacing:8px;pointer-events:none;white-space:nowrap;z-index:0">DRAFT</div>` : ""}
    ${pdfBar(AMBER_GRAD, 6)}
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:28px 36px 22px;border-bottom:1px solid #eee;flex-wrap:wrap;gap:14px">
      ${pdfCompanyBlock(logoB64, "#f59e0b")}
      <div style="text-align:right">
        <div style="font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:#e8e8e8;letter-spacing:3px;line-height:1">ESTIMATE</div>
        ${projectTitle ? `<div style="color:#f59e0b;font-size:11px;font-weight:600;margin-top:4px;font-style:italic">${projectTitle}</div>` : ""}
        ${pdfMetaGrid([
          ["Estimate No", estNo],
          ["Date", date],
          ["Valid Until", validUntil],
          [
            "Status",
            `<span style="font-size:10px;font-weight:700;color:${statusColor};background:${statusColor}18;border:1px solid ${statusColor}44;border-radius:10px;padding:2px 8px">${status}</span>`,
            "inherit",
          ],
        ])}
      </div>
    </div>
    ${pdfClientBlock(client, "Prepared For", "#f59e0b", "#fffbf0")}
    <div style="padding:20px 36px 8px">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>${pdfTableHeader(["#", "Service / Description", "Qty", "Rate", "Amount"], BROWN_GRAD, "#fcd34d")}</thead>
        <tbody>${rows}</tbody>
      </table>
      ${pdfTotalsBlock({ subtotal, discountAmt, discount, total, gradient: BROWN_GRAD, accentText: "#fcd34d", totalLabel: "Estimated Total", taxLabel: "" })}
      <div style="font-size:9px;color:#aaa;text-align:right;margin-top:4px">* GST / taxes not included in this estimate</div>
    </div>
    ${terms ? `<div style="padding:16px 36px;border-top:1px solid #eee;background:#fffbf0"><div style="font-size:9px;font-weight:700;color:#f59e0b;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:10px">Terms & Conditions</div>${termsHTML}</div>` : ""}
    <div style="display:flex;border-top:1px solid #eee;padding:16px 36px;gap:20px">
      <div style="flex:1"><div style="font-size:9px;color:#f59e0b;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:22px">Client Approval</div><div style="border-bottom:1px solid #ccc;width:180px;margin-bottom:4px"></div><div style="font-size:10px;color:#999">Signature &amp; Date</div></div>
      <div style="flex:1;text-align:right"><div style="font-size:9px;color:#f59e0b;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:22px">Authorised By</div><div style="border-bottom:1px solid #ccc;width:180px;margin-bottom:4px;margin-left:auto"></div><div style="font-size:10px;color:#999">GA Tech Solutions</div></div>
    </div>
    ${pdfFooter(BROWN_GRAD, "Thank you for considering us")}
    ${pdfBar(AMBER_GRAD, 4)}`;

    return buildPdfDocument(body);
  };

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function EstimateGenerator() {
  const [estNo, setEstNo] = useState(() => generateDocNo("EST"));
  const [date] = useState(today);
  const [validity, setValidity] = useState("15 days");
  const validUntil = addDays(parseInt(validity));
  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [projectTitle, setProjectTitle] = useState("");
  const [items, setItems] = useState([emptyItem()]);
  const [discount, setDiscount] = useState({ type: "percent", value: "" });
  const [terms, setTerms] = useState(
    "• This estimate is valid for the specified period only.\n• 50% advance payment required to start the project.\n• Final delivery within agreed timeline after full payment.\n• Prices may vary if project scope changes.\n• GST extra as applicable.",
  );
  const [status, setStatus] = useState("Draft");
  const [showModal, setShowModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const subtotal = items.reduce(
    (s, i) => s + (parseFloat(i.rate) || 0) * (parseInt(i.qty) || 0),
    0,
  );
  const discountAmt = calcDiscount(subtotal, discount);
  const total = Math.max(0, subtotal - discountAmt);
  const canPreview = client.name.trim() && items.every((i) => i.desc && i.rate);

  const updateItem = (id, f, v) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [f]: v } : i)));
  const addItem = () => setItems((p) => [...p, emptyItem()]);
  const removeItem = (id) =>
    setItems((p) => (p.length > 1 ? p.filter((i) => i.id !== id) : p));

  const handleClose = () => {
    setShowModal(false);
    setClient({ name: "", email: "", phone: "", address: "" });
    setItems([emptyItem()]);
    setDiscount({ type: "percent", value: "" });
    setStatus("Draft");
    setProjectTitle("");
    setEstNo(generateDocNo("EST"));
    setTerms(
      "• This estimate is valid for the specified period only.\n• 50% advance payment required to start the project.\n• Final delivery within agreed timeline after full payment.\n• Prices may vary if project scope changes.\n• GST extra as applicable.",
    );
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadPdf = useCallback(() => {
    downloadAsPdf(
      buildEstimateHtml({
        client,
        items,
        subtotal,
        discountAmt,
        discount,
        total,
        estNo,
        date,
        validUntil,
        status,
        terms,
        projectTitle,
      }),
      mainLogo,
      setPdfLoading,
    );
  }, [
    client,
    items,
    subtotal,
    discountAmt,
    discount,
    total,
    estNo,
    date,
    validUntil,
    status,
    terms,
    projectTitle,
  ]);

  const handleWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(
      `Hello! 👋\n\n📋 *Estimate No:* ${estNo}\n👤 *Client:* ${client.name}${projectTitle ? `\n🏗️ *Project:* ${projectTitle}` : ""}\n💰 *Total:* ${fmt(total)}\n📅 *Valid Until:* ${validUntil}\n\nServices:\n${items
        .filter((i) => i.desc)
        .map((i) => `• ${i.desc}`)
        .join("\n")}\n\nThank you!\nGA Tech Solutions\n📞 ${COMPANY.phone}`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }, [estNo, client, projectTitle, total, validUntil, items]);

  const statusColor = STATUS_COLOR[status] || "#6b7280";

  const EstimateDoc = () => (
    <div className="bg-white text-[#1a1a1a] font-sans overflow-hidden w-full relative">
      {status === "Draft" && (
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-35deg font-serif text-[88px] font-black text-black/4 tracking-[8px] pointer-events-none whitespace-nowrap z-0 select-none">
          DRAFT
        </div>
      )}
      <div className="h-1.5 bg-linear-to-r from-amber-400 via-orange-400 to-amber-400" />

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
          position: "relative",
          zIndex: 10,
        }}
      >
        <div>
          <img
            src={mainLogo}
            alt="logo"
            className="w-14 h-14 rounded-full object-cover mb-2.5 border-2 border-amber-400 shadow-[0_0_0_3px_#fef3c7]"
          />
          <div className="font-serif text-[22px] font-bold">{COMPANY.name}</div>
          <div className="text-amber-500 text-[9px] font-semibold tracking-[2px] uppercase mt-0.5">
            {COMPANY.tagline}
          </div>
          <div className="mt-2 text-[#555] text-[11px] leading-7">
            <div>{COMPANY.address}</div>
            <div>
              {COMPANY.email} · {COMPANY.phone}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-[36px] font-bold text-gray-200 tracking-[3px] leading-none">
            ESTIMATE
          </div>
          {projectTitle && (
            <div className="text-amber-500 text-[11px] font-semibold mt-1 italic">
              {projectTitle}
            </div>
          )}
          <div className="mt-3 grid grid-cols-2 gap-x-3.5 gap-y-1 text-left">
            {[
              ["Estimate No", estNo],
              ["Date", date],
              ["Valid Until", validUntil],
            ].map(([l, v]) => (
              <>
                <span
                  key={l}
                  className="text-gray-400 text-[9px] uppercase tracking-wide"
                >
                  {l}
                </span>
                <span key={v} className="text-[11px] font-bold text-[#1a1a1a]">
                  {v}
                </span>
              </>
            ))}
            <span className="text-gray-400 text-[9px] uppercase tracking-wide">
              Status
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border text-center"
              style={{
                color: statusColor,
                background: `${statusColor}18`,
                borderColor: `${statusColor}44`,
              }}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Prepared For */}
      <div
        style={{
          padding: "16px 36px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fffbf0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="text-[9px] font-bold text-amber-500 tracking-[2.5px] uppercase mb-1.5">
          Prepared For
        </div>
        <div className="font-serif text-lg font-semibold">{client.name}</div>
        {client.email && (
          <div className="text-[#555] text-[11.5px] mt-0.5">{client.email}</div>
        )}
        {client.phone && (
          <div className="text-[#555] text-[11.5px]">{client.phone}</div>
        )}
        {client.address && (
          <div className="text-[#555] text-[11.5px] mt-0.5 leading-relaxed">
            {client.address}
          </div>
        )}
      </div>

      {/* Table */}
      <div
        style={{ padding: "20px 36px 8px", position: "relative", zIndex: 10 }}
      >
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-linear-to-r from-[#78350f] to-[#92400e]">
              {["#", "Service / Description", "Qty", "Rate", "Amount"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`py-2.5 px-3 text-[#fcd34d] font-semibold text-[9px] tracking-[1.2px] uppercase ${i > 1 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const base =
                (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0);
              return (
                <tr
                  key={item.id}
                  className={`border-b border-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="py-2.5 px-3 text-gray-300 text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#1a1a1a]">
                    {item.desc}
                    {item.note && (
                      <div className="text-[10px] text-gray-400 mt-0.5 italic">
                        {item.note}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#555]">
                    {item.qty}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#555]">
                    {fmt(item.rate || 0)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-[#1a1a1a]">
                    {fmt(base)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end mt-3.5">
          <div style={{ minWidth: 255 }}>
            <div className="flex justify-between py-1.5 border-b border-gray-100 text-xs text-[#666]">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex justify-between py-1.5 border-b border-gray-100 text-xs text-red-600">
                <span>
                  Discount
                  {discount.type === "percent"
                    ? ` (${discount.value}%)`
                    : " (Flat)"}
                </span>
                <span>− {fmt(discountAmt)}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-gray-100 text-xs text-gray-400 italic">
              <span>GST / Tax</span>
              <span>As applicable</span>
            </div>
            <div className="flex justify-between px-3.5 py-2.5 bg-linear-to-r from-[#78350f] to-[#92400e] rounded-lg mt-1.5 font-serif text-lg">
              <span className="text-[#fcd34d]">Estimated Total</span>
              <span className="text-white font-bold">{fmt(total)}</span>
            </div>
            <div className="text-[9px] text-gray-300 text-right mt-1">
              * GST / taxes not included
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      {terms && (
        <div
          style={{
            padding: "16px 36px",
            borderTop: "1px solid #f0f0f0",
            background: "#fffbf0",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div className="text-[9px] font-bold text-amber-500 tracking-[2px] uppercase mb-2">
            Terms &amp; Conditions
          </div>
          {terms
            .split("\n")
            .filter(Boolean)
            .map((t, i) => (
              <div key={i} className="text-[11px] text-[#555] mb-0.5 pl-1">
                {t}
              </div>
            ))}
        </div>
      )}

      {/* Signature row */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #f0f0f0",
          padding: "16px 36px",
          gap: 20,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="flex-1">
          <div className="text-[9px] text-amber-500 font-bold tracking-[2px] uppercase mb-5">
            Client Approval
          </div>
          <div className="border-b border-gray-300 w-44 mb-1" />
          <div className="text-[10px] text-gray-400">Signature &amp; Date</div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[9px] text-amber-500 font-bold tracking-[2px] uppercase mb-5">
            Authorised By
          </div>
          <div className="border-b border-gray-300 w-44 mb-1 ml-auto" />
          <div className="text-[10px] text-gray-400">GA Tech Solutions</div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: "linear-gradient(to right,#78350f,#92400e)",
          padding: "10px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="text-[#92400e] text-[10px]">
          GA Tech Solutions · EstimateCraft
        </span>
        <span className="text-[#fcd34d] text-[10px] font-serif italic">
          Thank you for considering us
        </span>
      </div>
      <div className="h-1 bg-linear-to-r from-amber-400 via-orange-400 to-amber-400" />
    </div>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#07071f",
        fontFamily: "sans-serif",
        color: "#f0f0ff",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        body { overflow-x: hidden; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:none } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        select option { background: #0e0e30; color: #f0f0ff; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.6) sepia(1) hue-rotate(10deg); }

        .est-card {
          background: #0f0f35;
          border: 1px solid #2a2a5a;
          border-radius: 18px;
          padding: 28px 32px;
          margin-bottom: 20px;
          width: 100%;
        }
        .est-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 20px;
        }
        .est-span-2 { grid-column: 1 / -1; }
        @media (max-width: 560px) {
          .est-grid-2 { grid-template-columns: 1fr; }
          .est-span-2 { grid-column: 1; }
        }
      `}</style>

      {/* ── Centred column ── */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "48px 40px 80px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 800 }}>
          {/* ── Heading ── */}
          <div className="fade-up" style={{ marginBottom: 36 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#1a1200",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 999,
                padding: "4px 14px",
                marginBottom: 14,
                fontSize: 11,
                color: "#f59e0b",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              📊 Estimate Generator
            </div>
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.15,
                background: "linear-gradient(to right, #fcd34d, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}
            >
              Create Estimate
            </h1>
            <p
              style={{
                color: "#7070b0",
                marginTop: 8,
                fontSize: 14,
                margin: "8px 0 0 0",
              }}
            >
              Send a professional project estimate before invoicing
            </p>
          </div>

          {/* ── 01 CLIENT ── */}
          <div className="est-card fade-up">
            <SectionTitle num="01" title="Client Details" accent="amber" />
            <div className="est-grid-2">
              <div className="est-span-2">
                <ClientDropdown
                  value={client.name}
                  onChange={(name) => setClient((c) => ({ ...c, name }))}
                  onSelect={(preset) => setClient({ ...preset, gstin: "" })}
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <AmberInput
                  placeholder="client@example.com"
                  value={client.email}
                  onChange={(e) =>
                    setClient({ ...client, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <AmberInput
                  placeholder="+91-XXXXXXXXXX"
                  value={client.phone}
                  onChange={(e) =>
                    setClient({ ...client, phone: e.target.value })
                  }
                />
              </div>
              <div className="est-span-2">
                <Label>Client Address</Label>
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

          {/* ── 02 ESTIMATE DETAILS ── */}
          <div className="est-card fade-up">
            <SectionTitle num="02" title="Estimate Details" accent="amber" />
            <div className="est-grid-2">
              <div>
                <Label>Estimate Number</Label>
                <AmberInput
                  value={estNo}
                  readOnly
                  className="text-amber-300 font-semibold"
                />
              </div>
              <div>
                <Label>Date</Label>
                <AmberInput type="date" value={date} readOnly />
              </div>
              <div>
                <Label>Valid For</Label>
                <AmberSelect
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                >
                  {VALIDITY_OPTIONS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </AmberSelect>
              </div>
              <div>
                <Label>Status</Label>
                <AmberSelect
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {ESTIMATE_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </AmberSelect>
              </div>
              <div className="est-span-2">
                <Label>Project Title (optional)</Label>
                <AmberInput
                  placeholder="e.g. Company Website Redesign"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── 03 SERVICES ── */}
          <div className="est-card fade-up">
            <SectionTitle num="03" title="Services / Scope" accent="amber" />
            <EstimateLineItems
              items={items}
              onUpdate={updateItem}
              onAdd={addItem}
              onRemove={removeItem}
            />
            <div style={{ marginTop: 20 }}>
              <DiscountRow
                discount={discount}
                setDiscount={setDiscount}
                discountAmt={discountAmt}
                fmt={fmt}
                accent="amber"
              />
            </div>
            <TotalsSummary
              rows={[
                ["Subtotal", fmt(subtotal)],
                ...(discountAmt > 0
                  ? [
                      [
                        `Discount${discount.type === "percent" ? ` (${discount.value}%)` : " (Flat)"}`,
                        `− ${fmt(discountAmt)}`,
                        true,
                      ],
                    ]
                  : []),
                ["GST / Tax", "As applicable"],
              ]}
              total={fmt(total)}
              label="Total"
              gradientClass="from-amber-300 to-orange-400"
            />
          </div>

          {/* ── 04 TERMS ── */}
          <div className="est-card fade-up">
            <SectionTitle num="04" title="Terms & Conditions" accent="amber" />
            <Textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="h-32 text-[13px] leading-7"
            />
            <p
              style={{
                color: "#3a3a6a",
                fontSize: 11,
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              Each line will appear as a separate term on the estimate.
            </p>
          </div>

          {/* ── Submit ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
              marginTop: 8,
            }}
          >
            <AmberBtn
              onClick={() => canPreview && setShowModal(true)}
              disabled={!canPreview}
            >
              Preview Estimate →
            </AmberBtn>
            {!canPreview && (
              <p style={{ color: "#3a3a6a", fontSize: 12, margin: 0 }}>
                Fill client name and all item details to continue
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showModal && (
        <PreviewModal
          title="Estimate Preview"
          subtitle="Tap outside to close · Download to share with client"
          onClose={handleClose}
          glowColor="rgba(245,158,11,0.12)"
          buttons={
            <>
              <GhostBtn onClick={handleClose}>✕</GhostBtn>
              <WhatsAppBtn onClick={handleWhatsApp}>
                <span>📲</span>
                <span>WhatsApp</span>
              </WhatsAppBtn>
              <AmberBtn onClick={handleDownloadPdf} disabled={pdfLoading}>
                <span>⬇</span>
                <span>{pdfLoading ? "Opening…" : "Download PDF"}</span>
              </AmberBtn>
            </>
          }
        >
          <EstimateDoc />
        </PreviewModal>
      )}
    </div>
  );
}
