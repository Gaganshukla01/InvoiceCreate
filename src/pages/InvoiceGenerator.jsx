import { useState, useRef, useCallback, useEffect } from "react";
import mainLogo from "../assets/images/mainLogo.jpeg";

import { COMPANY } from "../constants/company";
import { GST_RATES } from "../constants/data";
import {
  fmt,
  generateDocNo,
  today,
  addDays,
  emptyItem,
  buildUpiString,
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
  Input,
  Select,
  Textarea,
  ClientDropdown,
  InvoiceLineItems,
  DiscountRow,
  TotalsSummary,
  PrimaryBtn,
  GhostBtn,
  WhatsAppBtn,
  PreviewModal,
  UpiQRCode,
} from "../components/index";

// ─── INVOICE PDF HTML BUILDER ─────────────────────────────────────────────────
const buildInvoiceHtml =
  ({
    client,
    items,
    subtotal,
    taxTotal,
    discountAmt,
    discount,
    total,
    invoiceNo,
    date,
    dueDate,
    paid,
    notes,
    serviceList,
    upiString,
  }) =>
  (logoB64) => {
    const VIOLET_GRAD = "linear-gradient(90deg,#7c6fff,#60a5fa,#7c6fff)";
    const NAVY_GRAD = "linear-gradient(90deg,#1e1b4b,#1e3a5f)";
    const rows = items
      .map((item, idx) => {
        const base = (parseFloat(item.rate) || 0) * (parseInt(item.qty) || 0);
        const tax = base * ((parseFloat(item.tax) || 0) / 100);
        return `<tr style="border-bottom:1px solid #eee;background:${idx % 2 === 0 ? "#fff" : "#f8f8ff"}">
      <td style="padding:10px 11px;color:#bbb;font-size:11px">${idx + 1}</td>
      <td style="padding:10px 11px;font-weight:500;color:#1a1a1a">${item.desc}</td>
      <td style="padding:10px 11px;text-align:right;color:#555">${item.qty}</td>
      <td style="padding:10px 11px;text-align:right;color:#555">₹${Number(item.rate || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
      <td style="padding:10px 11px;text-align:right;color:#555">${item.tax}%<br/><span style="font-size:10px;color:#aaa">₹${Number(tax).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></td>
      <td style="padding:10px 11px;text-align:right;font-weight:700;color:#1a1a1a">₹${Number(base + tax).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
    </tr>`;
      })
      .join("");
    const serviceItems = serviceList
      ? serviceList
          .split(", ")
          .map((s) => `<div style="color:#555;font-size:8px">· ${s}</div>`)
          .join("")
      : "";
    const body = `
    ${pdfBar(VIOLET_GRAD, 6)}
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:28px 36px 22px;border-bottom:1px solid #eee;flex-wrap:wrap;gap:14px">
      ${pdfCompanyBlock(logoB64, "#7c6fff")}
      <div style="text-align:right">
        <div style="font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:#e0e0e0;letter-spacing:3px;line-height:1">INVOICE</div>
        ${pdfMetaGrid([
          ["Invoice No", invoiceNo],
          ["Date", date],
          ["Due Date", dueDate],
          ["Status", paid ? "PAID" : "UNPAID", paid ? "#16a34a" : "#dc2626"],
        ])}
      </div>
    </div>
    ${pdfClientBlock(client, "Bill To", "#7c6fff", "#f8f8ff")}
    <div style="padding:20px 36px 8px">
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>${pdfTableHeader(["#", "Service / Description", "Qty", "Rate", "GST", "Amount"], NAVY_GRAD, "#a5b4fc")}</thead>
        <tbody>${rows}</tbody>
      </table>
      ${pdfTotalsBlock({ subtotal, taxTotal, discountAmt, discount, total, gradient: NAVY_GRAD, accentText: "#a5b4fc", totalLabel: "Total Due" })}
    </div>
    <div style="display:flex;border-top:1px solid #eee;background:#f8f8ff;flex-wrap:wrap">
      <div style="flex:1;padding:16px 36px;border-right:1px solid #eee;min-width:190px">
        <div style="font-size:9px;font-weight:700;color:#7c6fff;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:10px">Bank Transfer</div>
        ${[
          ["Account Name", COMPANY.bank.name],
          ["Account No", COMPANY.bank.account],
          ["IFSC Code", COMPANY.bank.ifsc],
          ["Branch", COMPANY.bank.branch],
        ]
          .map(
            ([l, v]) =>
              `<div style="display:flex;gap:10px;margin-bottom:4px;font-size:11.5px"><span style="color:#888;min-width:90px">${l}</span><span style="color:#1a1a1a;font-weight:600">${v}</span></div>`,
          )
          .join("")}
      </div>
      <div style="padding:16px 22px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-width:155px">
        <div style="font-size:9px;font-weight:700;color:#7c6fff;letter-spacing:2px;text-transform:uppercase">Scan to Pay</div>
        <div id="pdf-qr" style="width:90px;height:90px;background:#fff;border:2px solid #7c6fff;border-radius:7px;overflow:hidden"></div>
        <div style="font-size:10px;color:#555;font-weight:600">${COMPANY.upi}</div>
        <div style="font-size:11px;color:#7c6fff;font-weight:700">${fmt(total)}</div>
        ${serviceItems ? `<div style="font-size:8px;color:#7c6fff;font-weight:700;text-align:center">PAYMENT FOR</div>${serviceItems}` : ""}
      </div>
    </div>
    ${notes ? `<div style="padding:11px 36px;border-top:1px solid #eee"><span style="font-size:9px;color:#7c6fff;font-weight:700;text-transform:uppercase;letter-spacing:1px">Notes: </span><span style="font-size:11.5px;color:#555">${notes}</span></div>` : ""}
    ${pdfFooter(NAVY_GRAD, "Thank you for your business")}
    ${pdfBar(VIOLET_GRAD, 4)}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script>
      window.onload = function() {
        var el = document.getElementById('pdf-qr');
        if (el && window.QRCode) new QRCode(el, { text: decodeURIComponent('${encodeURIComponent(upiString)}'), width:86, height:86, colorDark:'#1a1a1a', colorLight:'#ffffff', correctLevel: QRCode.CorrectLevel.M });
      };
    </script>`;
    return buildPdfDocument(body);
  };

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function InvoiceGenerator() {
  const [invoiceNo, setInvoiceNo] = useState(() => generateDocNo("GTS"));
  const [date] = useState(today);
  const [dueDate, setDueDate] = useState(() => addDays(15));
  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstin: "",
  });
  const [items, setItems] = useState([emptyItem()]);
  const [discount, setDiscount] = useState({ type: "percent", value: "" });
  const [notes, setNotes] = useState(
    "Thank you for choosing GA Tech Solutions. Payment due within 15 days.",
  );
  const [paid, setPaid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPayLink, setShowPayLink] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const invoiceRef = useRef();

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
  const discountAmt = calcDiscount(subtotal, discount);
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

  const updateItem = (id, f, v) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, [f]: v } : i)));
  const addItem = () => setItems((p) => [...p, emptyItem()]);
  const removeItem = (id) =>
    setItems((p) => (p.length > 1 ? p.filter((i) => i.id !== id) : p));

  const handleClose = () => {
    setShowModal(false);
    setShowPayLink(false);
    setClient({ name: "", email: "", phone: "", address: "", gstin: "" });
    setItems([emptyItem()]);
    setDiscount({ type: "percent", value: "" });
    setNotes(
      "Thank you for choosing GA Tech Solutions. Payment due within 15 days.",
    );
    setPaid(false);
    setInvoiceNo(generateDocNo("GTS"));
    setDueDate(addDays(15));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownloadPdf = useCallback(() => {
    downloadAsPdf(
      buildInvoiceHtml({
        client,
        items,
        subtotal,
        taxTotal,
        discountAmt,
        discount,
        total,
        invoiceNo,
        date,
        dueDate,
        paid,
        notes,
        serviceList,
        upiString,
      }),
      mainLogo,
      setPdfLoading,
    );
  }, [
    client,
    items,
    subtotal,
    taxTotal,
    discountAmt,
    discount,
    total,
    invoiceNo,
    date,
    dueDate,
    paid,
    notes,
    serviceList,
    upiString,
  ]);

  const handleWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(
      `Hello! 👋\n\n📄 *Invoice No:* ${invoiceNo}\n👤 *Client:* ${client.name}\n💰 *Amount Due:* ${fmt(total)}\n📅 *Due Date:* ${dueDate}\n🛠️ *Services:* ${serviceList || "As discussed"}\n\n📱 Pay via UPI: ${COMPANY.upi}\n\nThank you!\n📞 ${COMPANY.phone}`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }, [invoiceNo, client, total, dueDate, serviceList]);

  const InvoiceDoc = () => (
    <div
      ref={invoiceRef}
      className="bg-white text-[#1a1a1a] font-sans overflow-hidden w-full relative"
    >
      <div className="h-1.5 bg-linear-to-r from-violet-500 via-blue-400 to-violet-500" />
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
            className="w-14 h-14 rounded-full object-cover mb-2.5 border-2 border-violet-400 shadow-[0_0_0_3px_#ede9fe]"
          />
          <div className="font-serif text-[22px] font-bold">{COMPANY.name}</div>
          <div className="text-violet-500 text-[9px] font-semibold tracking-[2px] uppercase mt-0.5">
            {COMPANY.tagline}
          </div>
          <div className="mt-2 text-[#555] text-[11px] leading-7">
            <div>{COMPANY.address}</div>
            <div>
              {COMPANY.email} · {COMPANY.phone}
            </div>
            <div>GSTIN: {COMPANY.gstin}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-[36px] font-bold text-gray-200 tracking-[3px] leading-none">
            INVOICE
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-3.5 gap-y-1 text-left">
            {[
              ["Invoice No", invoiceNo],
              ["Date", date],
              ["Due Date", dueDate],
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
              className={`text-[11px] font-bold ${paid ? "text-green-600" : "text-red-600"}`}
            >
              {paid ? "PAID" : "UNPAID"}
            </span>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "16px 36px",
          borderBottom: "1px solid #f0f0f0",
          background: "#f8f8ff",
        }}
      >
        <div className="text-[9px] font-bold text-violet-500 tracking-[2.5px] uppercase mb-1.5">
          Bill To
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
        {client.gstin && (
          <div className="text-[#888] text-[11px] mt-0.5">
            GSTIN: {client.gstin}
          </div>
        )}
      </div>
      <div style={{ padding: "20px 36px 8px" }}>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-linear-to-r from-[#1e1b4b] to-[#1e3a5f]">
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
                  className={`py-2.5 px-2.5 text-[#a5b4fc] font-semibold text-[9px] tracking-[1.2px] uppercase ${i > 1 ? "text-right" : "text-left"}`}
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
                  className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-[#f8f8ff]"}`}
                >
                  <td className="py-2.5 px-2.5 text-gray-300 text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-2.5 font-medium text-[#1a1a1a]">
                    {item.desc}
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-[#555]">
                    {item.qty}
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-[#555]">
                    {fmt(item.rate || 0)}
                  </td>
                  <td className="py-2.5 px-2.5 text-right text-[#555]">
                    {item.tax}%<br />
                    <span className="text-[10px] text-gray-300">
                      {fmt(tax)}
                    </span>
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-bold text-[#1a1a1a]">
                    {fmt(base + tax)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end mt-3.5">
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
                className={`flex justify-between py-1.5 border-b border-gray-100 text-xs ${l.startsWith("Discount") ? "text-red-600" : "text-[#666]"}`}
              >
                <span>{l}</span>
                <span>{v}</span>
              </div>
            ))}
            <div className="flex justify-between px-3.5 py-2.5 bg-linear-to-r from-[#1e1b4b] to-[#1e3a5f] rounded-lg mt-1.5 font-serif text-lg">
              <span className="text-[#a5b4fc]">Total Due</span>
              <span className="text-white font-bold">{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-t border-gray-100 bg-[#f8f8ff] flex-wrap">
        <div
          className="flex-1 py-4 border-r border-gray-100"
          style={{ minWidth: 190, padding: "16px 36px" }}
        >
          <div className="text-[9px] font-bold text-violet-500 tracking-[2px] uppercase mb-2.5">
            Bank Transfer
          </div>
          {[
            ["Account Name", COMPANY.bank.name],
            ["Account No", COMPANY.bank.account],
            ["IFSC Code", COMPANY.bank.ifsc],
            ["Branch", COMPANY.bank.branch],
          ].map(([l, v]) => (
            <div key={l} className="flex gap-2.5 mb-1 text-[11.5px]">
              <span className="text-[#888]" style={{ minWidth: 90 }}>
                {l}
              </span>
              <span className="text-[#1a1a1a] font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div
          className="flex flex-col items-center justify-center gap-1.5"
          style={{ minWidth: 155, padding: "16px 20px" }}
        >
          <div className="text-[9px] font-bold text-violet-500 tracking-[2px] uppercase">
            Scan to Pay
          </div>
          <div
            onClick={() => setShowPayLink((p) => !p)}
            className="cursor-pointer"
          >
            <div
              className={`bg-white rounded-lg overflow-hidden border-2 transition-all ${showPayLink ? "border-violet-500 shadow-[0_0_0_3px_#7c6fff33]" : "border-gray-200"}`}
              style={{ width: 88, height: 88 }}
            >
              <UpiQRCode upiString={upiString} size={84} />
            </div>
            <div className="text-[8px] text-violet-400 text-center mt-0.5 font-semibold">
              👆 tap for link
            </div>
          </div>
          {showPayLink && (
            <div
              className="bg-violet-50 border border-violet-300 rounded-lg p-2 text-center"
              style={{ maxWidth: 150 }}
            >
              <div className="text-[9px] font-bold text-violet-700 mb-1">
                UPI Payment Link
              </div>
              <div className="text-[10px] text-violet-600 font-semibold break-all mb-1.5">
                {COMPANY.upi}
              </div>
              <a
                href={upiString}
                className="inline-block bg-linear-to-r from-violet-500 to-blue-400 text-white text-[11px] font-bold px-3 py-1.5 rounded no-underline"
              >
                Pay {total > 0 ? fmt(total) : "Now"} →
              </a>
            </div>
          )}
          <div className="text-[10px] text-[#555] font-semibold">
            {COMPANY.upi}
          </div>
          {total > 0 && (
            <div className="text-[11px] text-violet-500 font-bold">
              {fmt(total)}
            </div>
          )}
          {serviceList && (
            <div
              className="text-[8px] text-center leading-relaxed mt-1"
              style={{ maxWidth: 140 }}
            >
              <div className="text-violet-500 font-bold mb-0.5">
                PAYMENT FOR
              </div>
              {serviceList.split(", ").map((s, i) => (
                <div key={i} className="text-[#555]">
                  · {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {notes && (
        <div style={{ padding: "12px 36px", borderTop: "1px solid #f0f0f0" }}>
          <span className="text-[9px] text-violet-500 font-bold uppercase tracking-wide">
            Notes:{" "}
          </span>
          <span className="text-[11.5px] text-[#555]">{notes}</span>
        </div>
      )}
      <div
        style={{
          background: "linear-gradient(to right, #1e1b4b, #1e3a5f)",
          padding: "10px 36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span className="text-[#6060aa] text-[10px]">
          GA Tech Solutions · InvoiceCraft
        </span>
        <span className="text-[#a5b4fc] text-[10px] font-serif italic">
          Thank you for your business
        </span>
      </div>
      <div className="h-1 bg-linear-to-r from-violet-500 via-blue-400 to-violet-500" />
    </div>
  );

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
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.6) sepia(1) hue-rotate(200deg); }

        /* ── Card spacing fix ── */
        .inv-card {
          background: #0f0f35;
          border: 1px solid #2a2a5a;
          border-radius: 18px;
          padding: 28px 32px;      /* generous inner padding */
          margin-bottom: 20px;     /* clear gap between cards */
          width: 100%;
        }
        .inv-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 20px;          /* row-gap col-gap */
        }
        @media (max-width: 560px) {
          .inv-grid-2 { grid-template-columns: 1fr; }
          .span-2 { grid-column: 1 !important; }
        }
        .span-2 { grid-column: 1 / -1; }
      `}</style>

      {/* Page shell — centred column with side breathing room */}
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
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 36,
                fontWeight: 700,
                lineHeight: 1.15,
                background: "linear-gradient(to right, #c4b5fd, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}
            >
              Create Invoice
            </h1>
            <p
              style={{
                color: "#7070b0",
                marginTop: 8,
                fontSize: 14,
                margin: "8px 0 0 0",
              }}
            >
              Fill in the details to generate a professional invoice
            </p>
          </div>

          {/* ── 01 CLIENT ── */}
          <div className="inv-card fade-up">
            <SectionTitle num="01" title="Client Details" />
            <div className="inv-grid-2">
              {/* Client name spans full width */}
              <div className="span-2">
                <ClientDropdown
                  value={client.name}
                  onChange={(name) => setClient((c) => ({ ...c, name }))}
                  onSelect={(preset) => setClient(preset)}
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
              <div>
                <Label>GSTIN (optional)</Label>
                <Input
                  placeholder="22AAAAA0000A1Z5"
                  value={client.gstin}
                  onChange={(e) =>
                    setClient({ ...client, gstin: e.target.value })
                  }
                />
              </div>
              {/* Billing address spans full width */}
              <div className="span-2">
                <Label>Billing Address</Label>
                <Textarea
                  placeholder="Street, City, State, PIN"
                  value={client.address}
                  onChange={(e) =>
                    setClient({ ...client, address: e.target.value })
                  }
                  className="h-20"
                />
              </div>
            </div>
          </div>

          {/* ── 02 INVOICE META ── */}
          <div className="inv-card fade-up">
            <SectionTitle num="02" title="Invoice Details" />
            <div className="inv-grid-2">
              <div>
                <Label>Invoice Number</Label>
                <Input
                  value={invoiceNo}
                  readOnly
                  className="text-violet-300 font-semibold"
                />
              </div>
              <div>
                <Label>Invoice Date</Label>
                <Input type="date" value={date} readOnly />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Payment Status</Label>
                <Select
                  value={paid}
                  onChange={(e) => setPaid(e.target.value === "true")}
                >
                  <option value="false">Unpaid</option>
                  <option value="true">Paid</option>
                </Select>
              </div>
            </div>
          </div>

          {/* ── 03 SERVICES ── */}
          <div className="inv-card fade-up">
            <SectionTitle num="03" title="Services / Items" />
            <InvoiceLineItems
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
                accent="violet"
              />
            </div>
            <TotalsSummary
              rows={[
                ["Subtotal", fmt(subtotal)],
                ["GST / Tax", fmt(taxTotal)],
                ...(discountAmt > 0
                  ? [
                      [
                        `Discount${discount.type === "percent" ? ` (${discount.value}%)` : " (Flat)"}`,
                        `− ${fmt(discountAmt)}`,
                        true,
                      ],
                    ]
                  : []),
              ]}
              total={fmt(total)}
              label="Total"
              gradientClass="from-violet-300 to-blue-400"
            />
          </div>

          {/* ── 04 NOTES ── */}
          <div className="inv-card fade-up">
            <SectionTitle num="04" title="Notes" />
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20"
            />
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
            <PrimaryBtn
              onClick={() => canPreview && setShowModal(true)}
              disabled={!canPreview}
              className="px-9 py-3.5 text-[15px] shadow-[0_4px_20px_rgba(124,111,255,0.35)]"
            >
              Preview Invoice →
            </PrimaryBtn>
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
          title="Invoice Preview"
          subtitle="Tap outside to close · Tap QR = payment link"
          onClose={handleClose}
          glowColor="rgba(124,111,255,0.15)"
          buttons={
            <>
              <GhostBtn
                onClick={handleClose}
                className="px-3 py-2.5 text-sm whitespace-nowrap"
              >
                ✕
              </GhostBtn>
              <WhatsAppBtn
                onClick={handleWhatsApp}
                disabled={pdfLoading}
                className="px-3.5 py-2.5 text-sm whitespace-nowrap"
              >
                <span>📲</span>
                <span>{pdfLoading ? "…" : "WhatsApp"}</span>
              </WhatsAppBtn>
              <PrimaryBtn
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="px-3.5 py-2.5 text-sm whitespace-nowrap shadow-[0_4px_12px_rgba(124,111,255,0.3)]"
              >
                <span>⬇</span>
                <span>{pdfLoading ? "Opening…" : "Download PDF"}</span>
              </PrimaryBtn>
            </>
          }
        >
          <InvoiceDoc />
        </PreviewModal>
      )}
    </div>
  );
}
