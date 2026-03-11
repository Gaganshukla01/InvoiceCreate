/** Format a number as Indian Rupee → ₹1,23,456.00 */
export const fmt = (n) =>
  `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

/** Returns today as YYYY-MM-DD */
export const today = () => new Date().toISOString().split("T")[0];

/** Returns today + N days as YYYY-MM-DD */
export const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

/**
 * Generate a document number
 * @param {"GTS"|"EST"|"RCP"} prefix
 * @returns e.g. "GTS-20260311-264"
 */
export const generateDocNo = (prefix = "GTS") => {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${ymd}-${rand}`;
};

/** Build UPI deep-link string */
export const buildUpiString = ({ upi, payeeName, amount, note }) => {
  const p = new URLSearchParams();
  p.set("pa", upi);
  p.set("pn", payeeName);
  if (amount > 0) p.set("am", amount.toFixed(2));
  if (note) p.set("tn", note.slice(0, 100));
  p.set("cu", "INR");
  return `upi://pay?${p.toString()}`;
};

/** Calculate discount amount from subtotal */
export const calcDiscount = (subtotal, discount) => {
  if (!discount.value) return 0;
  return discount.type === "percent"
    ? (subtotal * (parseFloat(discount.value) || 0)) / 100
    : parseFloat(discount.value) || 0;
};

/** Empty line item factory */
export const emptyItem = () => ({
  id: Date.now() + Math.random(),
  desc: "",
  qty: 1,
  rate: "",
  tax: 0,
  note: "",
});
