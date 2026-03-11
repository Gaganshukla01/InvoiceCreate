import { useState, useRef, useEffect } from "react";
import { PRESET_CLIENTS, SERVICES, GST_RATES } from "../constants/data";

export function Label({ children, className = "" }) {
  return (
    <label
      className={`block text-[#9090c0] text-[11px] font-semibold tracking-widest uppercase ${className}`}
      style={{ marginBottom: 7 }}
    >
      {children}
    </label>
  );
}

/** Section heading with numbered badge */
export function SectionTitle({ num, title, accent = "violet" }) {
  const badge =
    accent === "amber"
      ? "bg-gradient-to-br from-amber-500 to-orange-500"
      : "bg-gradient-to-br from-violet-500 to-blue-400";
  return (
    <h2 className="flex items-center gap-3 font-serif text-xl text-[#f0f0ff] mb-5 font-semibold">
      <span
        className={`${badge} text-white text-[10px] font-bold font-sans px-2 py-0.5 rounded tracking-widest`}
      >
        {num}
      </span>
      {title}
    </h2>
  );
}

const baseInput = `
  w-full bg-[#12123a] border border-[#3a3a6a] rounded-lg
  text-sm text-[#f0f0ff] font-sans outline-none transition-all duration-150
  placeholder:text-[#5050a0]
  [&::-webkit-calendar-picker-indicator]:opacity-50
`;

const inputPad = { padding: "11px 14px", lineHeight: "1.5" };

export function Input({ className = "", style = {}, ...props }) {
  return (
    <input
      className={`${baseInput} focus:border-violet-500 focus:bg-[#16164a] focus:shadow-[0_0_0_3px_#7c6fff22] ${className}`}
      style={{ ...inputPad, ...style }}
      {...props}
    />
  );
}

export function AmberInput({ className = "", style = {}, ...props }) {
  return (
    <input
      className={`${baseInput} focus:border-amber-500 focus:bg-[#1a1200] focus:shadow-[0_0_0_3px_#f59e0b22] ${className}`}
      style={{ ...inputPad, ...style }}
      {...props}
    />
  );
}

export function Textarea({ className = "", style = {}, ...props }) {
  return (
    <textarea
      className={`${baseInput} resize-y focus:border-violet-500 focus:bg-[#16164a] focus:shadow-[0_0_0_3px_#7c6fff22] ${className}`}
      style={{ ...inputPad, ...style }}
      {...props}
    />
  );
}

export function Select({ className = "", style = {}, children, ...props }) {
  return (
    <select
      className={`${baseInput} focus:border-violet-500 focus:bg-[#16164a] focus:shadow-[0_0_0_3px_#7c6fff22] ${className}`}
      style={{ ...inputPad, ...style }}
      {...props}
    >
      {children}
    </select>
  );
}

export function AmberSelect({
  className = "",
  style = {},
  children,
  ...props
}) {
  return (
    <select
      className={`${baseInput} focus:border-amber-500 focus:bg-[#1a1200] focus:shadow-[0_0_0_3px_#f59e0b22] ${className}`}
      style={{ ...inputPad, ...style }}
      {...props}
    >
      {children}
    </select>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUTTONS
// ─────────────────────────────────────────────────────────────────────────────

export function PrimaryBtn({
  children,
  className = "",
  style = {},
  disabled,
  onClick,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-bold font-sans rounded-lg border-none cursor-pointer flex items-center gap-1.5 transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        background: "linear-gradient(135deg, #7c6fff, #60a5fa)",
        color: "#fff",
        padding: "12px 32px",
        fontSize: 15,
        borderRadius: 10,
        transform: "translateY(0)",
        boxShadow: "0 4px 20px rgba(124,111,255,0.35)",
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function AmberBtn({
  children,
  className = "",
  style = {},
  disabled,
  onClick,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-bold font-sans rounded-lg border-none cursor-pointer flex items-center gap-1.5 transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        background: "linear-gradient(135deg, #f59e0b, #f97316)",
        color: "#fff",
        padding: "12px 32px",
        fontSize: 15,
        borderRadius: 10,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ children, className = "", style = {}, ...props }) {
  return (
    <button
      className={`bg-transparent rounded-lg font-sans cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${className}`}
      style={{
        border: "1px solid #2a2a5a",
        color: "#7070b0",
        padding: "10px 16px",
        fontSize: 14,
        borderRadius: 10,
        whiteSpace: "nowrap",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(124,111,255,0.1)";
        e.currentTarget.style.color = "#c0c0ff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "#7070b0";
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function WhatsAppBtn({
  children,
  className = "",
  style = {},
  disabled,
  onClick,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-bold font-sans rounded-lg border-none cursor-pointer flex items-center gap-1.5 transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        background: "linear-gradient(135deg, #25d366, #128c7e)",
        color: "#fff",
        padding: "10px 20px",
        fontSize: 14,
        borderRadius: 10,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

/** Dark card wrapper used for each form section */
export function FormCard({ children, className = "" }) {
  return (
    <div
      className={`bg-[#0f0f35] border border-[#2a2a5a] rounded-2xl p-5 mb-3.5 ${className}`}
      style={{ width: "100%" }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────

export function ClientDropdown({ value, onChange, onSelect }) {
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
    <div ref={wrapRef} className="relative col-span-2">
      <Label>Client / Company Name *</Label>
      <div className="relative">
        <Input
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6060a0] cursor-pointer text-[10px] select-none"
        >
          {open ? "▲" : "▼"}
        </span>
      </div>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-[#0e0e30] border border-[#3a3a6a] rounded-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.7)] max-h-60 overflow-y-auto">
          {isCustom && (
            <div
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
              className="px-3.5 py-2.5 cursor-pointer border-b border-[#1e1e4a] flex items-center gap-2 hover:bg-[#16164a] transition-colors"
            >
              <span className="text-violet-400">✎</span>
              <span className="text-[#c0c0e0] text-sm">
                Use "<strong className="text-white">{query}</strong>" as new
                client
              </span>
            </div>
          )}
          {filtered.length === 0 && !isCustom && (
            <div className="px-3.5 py-4 text-[#5050a0] text-sm text-center">
              No clients found
            </div>
          )}
          {filtered.map((c) => (
            <div
              key={c.name}
              onClick={() => {
                onSelect(c);
                setQuery(c.name);
                setOpen(false);
              }}
              className="px-3.5 py-2.5 cursor-pointer border-b border-[#14143a] hover:bg-[#16164a] transition-colors"
            >
              <div className="text-[#f0f0ff] font-semibold text-sm">
                {c.name}
              </div>
              <div className="text-[#6060a0] text-xs mt-0.5">
                {[c.phone, c.email].filter(Boolean).join(" · ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LINE ITEMS TABLE
// ─────────────────────────────────────────────────────────────────────────────

/** Invoice line items — includes GST column */
export function InvoiceLineItems({ items, onUpdate, onAdd, onRemove }) {
  return (
    <div>
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_60px_110px_70px_32px] gap-2 mb-2 px-1">
        {["Description", "Qty", "Rate (₹)", "GST %", ""].map((h, i) => (
          <span
            key={i}
            className="text-[#7070b0] text-[11px] font-semibold uppercase tracking-wider"
          >
            {h}
          </span>
        ))}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[1fr_60px_110px_70px_32px] gap-2 mb-2 p-1 rounded-lg hover:bg-violet-500/5 transition-colors"
        >
          <Select
            value={item.desc}
            onChange={(e) => onUpdate(item.id, "desc", e.target.value)}
          >
            <option value="">Select service…</option>
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Input
            type="number"
            min="1"
            value={item.qty}
            className="text-center px-2"
            onChange={(e) => onUpdate(item.id, "qty", e.target.value)}
          />
          <Input
            type="number"
            placeholder="0.00"
            value={item.rate}
            onChange={(e) => onUpdate(item.id, "rate", e.target.value)}
          />
          <Select
            value={item.tax}
            onChange={(e) => onUpdate(item.id, "tax", e.target.value)}
          >
            {GST_RATES.map((t) => (
              <option key={t} value={t}>
                {t}%
              </option>
            ))}
          </Select>
          <button
            onClick={() => onRemove(item.id)}
            className="text-[#3a3a6a] hover:text-red-400 transition-colors text-2xl leading-none bg-transparent border-none cursor-pointer p-0"
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={onAdd}
        className="mt-2 flex items-center gap-2 bg-transparent border border-dashed border-[#2a2a5a] text-[#6060a0] px-4 py-2 rounded-lg cursor-pointer text-sm transition-all hover:border-violet-500 hover:text-violet-400"
      >
        + Add Line Item
      </button>
    </div>
  );
}

/** Estimate line items — includes per-item note, no GST column */
export function EstimateLineItems({ items, onUpdate, onAdd, onRemove }) {
  return (
    <div>
      <div className="grid grid-cols-[1fr_60px_110px_32px] gap-2 mb-2 px-1">
        {["Description", "Qty", "Rate (₹)", ""].map((h, i) => (
          <span
            key={i}
            className="text-[#7070b0] text-[11px] font-semibold uppercase tracking-wider"
          >
            {h}
          </span>
        ))}
      </div>

      {items.map((item) => (
        <div key={item.id} className="mb-3">
          <div className="grid grid-cols-[1fr_60px_110px_32px] gap-2 mb-1.5 p-1 rounded-lg hover:bg-amber-500/5 transition-colors">
            <Select
              value={item.desc}
              onChange={(e) => onUpdate(item.id, "desc", e.target.value)}
            >
              <option value="">Select service…</option>
              {SERVICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <Input
              type="number"
              min="1"
              value={item.qty}
              className="text-center px-2"
              onChange={(e) => onUpdate(item.id, "qty", e.target.value)}
            />
            <Input
              type="number"
              placeholder="0.00"
              value={item.rate}
              onChange={(e) => onUpdate(item.id, "rate", e.target.value)}
            />
            <button
              onClick={() => onRemove(item.id)}
              className="text-[#3a3a6a] hover:text-red-400 transition-colors text-2xl leading-none bg-transparent border-none cursor-pointer p-0"
            >
              ×
            </button>
          </div>
          <Input
            placeholder="Add note for this item (optional)…"
            value={item.note || ""}
            onChange={(e) => onUpdate(item.id, "note", e.target.value)}
            className="text-xs py-1.5 text-[#9090c0] bg-[#0a0a28]"
          />
        </div>
      ))}

      <button
        onClick={onAdd}
        className="mt-1 flex items-center gap-2 bg-transparent border border-dashed border-[#2a2a5a] text-[#6060a0] px-4 py-2 rounded-lg cursor-pointer text-sm transition-all hover:border-amber-500 hover:text-amber-400"
      >
        + Add Line Item
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCOUNT ROW
// ─────────────────────────────────────────────────────────────────────────────

export function DiscountRow({
  discount,
  setDiscount,
  discountAmt,
  fmt,
  accent = "violet",
}) {
  const activeGrad =
    accent === "amber"
      ? "linear-gradient(135deg,#f59e0b,#f97316)"
      : "linear-gradient(135deg,#7c6fff,#60a5fa)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        background: "#0a0a28",
        border: "1px solid #2a2a5a",
        borderRadius: 12,
        padding: "14px 18px",
      }}
    >
      {/* Label */}
      <span
        style={{
          color: "#7070b0",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        Discount
      </span>

      {/* % / ₹ toggle */}
      <div
        style={{
          display: "flex",
          background: "#0d0d30",
          border: "1px solid #2a2a5a",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {["percent", "flat"].map((t) => (
          <button
            key={t}
            onClick={() => setDiscount({ type: t, value: "" })}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              background: discount.type === t ? activeGrad : "transparent",
              color: discount.type === t ? "#fff" : "#5050a0",
            }}
          >
            {t === "percent" ? "%" : "₹"}
          </button>
        ))}
      </div>

      {/* Value input */}
      <input
        type="number"
        min="0"
        placeholder={discount.type === "percent" ? "e.g. 10" : "e.g. 500"}
        value={discount.value}
        onChange={(e) => setDiscount((d) => ({ ...d, value: e.target.value }))}
        style={{
          width: 130,
          padding: "9px 14px",
          fontSize: 14,
          background: "#12123a",
          border: "1px solid #3a3a6a",
          borderRadius: 8,
          color: "#f0f0ff",
          outline: "none",
          fontFamily: "sans-serif",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#7c6fff";
          e.target.style.boxShadow = "0 0 0 3px rgba(124,111,255,0.15)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#3a3a6a";
          e.target.style.boxShadow = "none";
        }}
      />

      {/* Discount amount badge */}
      {discountAmt > 0 && (
        <span
          style={{
            color: "#f87171",
            fontSize: 13,
            fontWeight: 600,
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.25)",
            borderRadius: 6,
            padding: "4px 10px",
            whiteSpace: "nowrap",
          }}
        >
          − {fmt(discountAmt)} off
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOTALS SUMMARY CARD
// ─────────────────────────────────────────────────────────────────────────────

export function TotalsSummary({
  rows,
  total,
  label = "Total",
  gradientClass = "from-violet-400 to-blue-400",
}) {
  // Derive gradient from gradientClass prop
  const isAmber =
    gradientClass.includes("amber") || gradientClass.includes("orange");
  const grad = isAmber
    ? "linear-gradient(to right, #fbbf24, #f97316)"
    : "linear-gradient(to right, #c4b5fd, #60a5fa)";

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
      <div
        style={{
          background: "#0a0a28",
          border: "1px solid #2a2a5a",
          borderRadius: 14,
          padding: "16px 20px",
          minWidth: 280,
        }}
      >
        {rows.map(([l, v, isRed]) => (
          <div
            key={l}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
              fontSize: 14,
              color: isRed ? "#f87171" : "#7070b0",
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
            marginTop: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              background: grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              background: grad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW MODAL
// ─────────────────────────────────────────────────────────────────────────────

export function PreviewModal({
  onClose,
  title,
  subtitle,
  buttons,
  children,
  glowColor = "rgba(124,111,255,0.15)",
}) {
  // Lock background scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        padding: "24px 20px 40px",
        animation: "modalBg 0.25s ease both",
      }}
    >
      <style>{`
        @keyframes modalBg  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalBox { from { opacity: 0; transform: scale(0.97) translateY(10px) } to { opacity: 1; transform: none } }
        .modal-animate { animation: modalBox 0.3s ease both; }
        @media(max-width:600px) {
          .preview-scaler { transform: scale(0.52); transform-origin: top left; width: 192% !important; }
          .preview-wrapper { overflow: hidden; width: 100%; }
          .modal-btns-row { flex-direction: column !important; }
        }
        @media(min-width:601px) and (max-width:860px) {
          .preview-scaler { transform: scale(0.75); transform-origin: top left; width: 133% !important; }
          .preview-wrapper { overflow: hidden; width: 100%; }
        }
      `}</style>

      {/* Header bar */}
      <div
        className="modal-animate modal-btns-row"
        style={{
          width: "100%",
          maxWidth: 860,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
          background: "#0d0d2e",
          border: "1px solid #2a2a5a",
          borderRadius: 14,
          padding: "16px 24px",
          flexShrink: 0,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 20,
              color: "#f0f0ff",
              fontWeight: 700,
              margin: 0,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                color: "#4040a0",
                fontSize: 11,
                marginTop: 4,
                margin: "4px 0 0 0",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {buttons}
        </div>
      </div>

      {/* Document pane */}
      <div
        className="modal-animate preview-wrapper"
        style={{
          width: "100%",
          maxWidth: 860,
          borderRadius: 14,
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: `0 40px 100px ${glowColor}`,
          padding: "0 2px",
          background: "#fff",
        }}
      >
        <div
          className="preview-scaler"
          style={{ borderRadius: 14, overflow: "hidden" }}
        >
          {children}
        </div>
      </div>

      <div style={{ height: 32, flexShrink: 0 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UPI QR CODE
// ─────────────────────────────────────────────────────────────────────────────

export function UpiQRCode({ upiString, size = 96 }) {
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
      style={{ width: size, height: size }}
      className="bg-white rounded-md overflow-hidden"
    />
  );
}
