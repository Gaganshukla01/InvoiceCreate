import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import mainLogo from "./assets/images/mainLogo.jpeg";
import HomePage from "./pages/Home.jsx";
import InvoiceGenerator from "./pages/InvoiceGenerator.jsx";
import EstimateGenerator from "./pages/EstimateGenerator.jsx";
import ReceiptGenerator from "./pages/RecieptGenrator.jsx";

// ─── COMING SOON PLACEHOLDER ─────────────────────────────────────────────────
function ComingSoon({ title, icon }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: "calc(100vh - 58px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
      }}
    >
      <div style={{ fontSize: 64 }}>{icon}</div>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 36,
          fontWeight: 700,
          textAlign: "center",
          background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          color: "#4040a0",
          fontSize: 15,
          textAlign: "center",
          maxWidth: 340,
        }}
      >
        This tool is under development and will be available soon.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: 12,
          background: "linear-gradient(135deg,#7c6fff,#60a5fa)",
          color: "#fff",
          border: "none",
          borderRadius: 9,
          padding: "11px 28px",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: "0 4px 20px rgba(124,111,255,0.35)",
        }}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { path: "/", label: "Dashboard", icon: "⊞" },
  { path: "/invoice", label: "Invoice", icon: "📄" },
  { path: "/estimate", label: "Estimate", icon: "📊" },
  { path: "/receipt", label: "Receipt", icon: "🧾" },
  { path: "/clients", label: "Clients", icon: "👥" },
  { path: "/expenses", label: "Expenses", icon: "💸" },
  { path: "/reports", label: "Reports", icon: "📈" },
];


function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07071f",
        fontFamily: "'DM Sans', sans-serif",
        color: "#f0f0ff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #7c6fff44; border-radius: 4px; }
        .nav-pill { transition: all 0.18s ease; }
        .nav-pill:hover { background: rgba(124,111,255,0.12) !important; color: #c0c0ff !important; }
        .nav-pill.active { background: rgba(124,111,255,0.2) !important; color: #a78bfa !important; border-color: #7c6fff55 !important; }
        .back-btn:hover { background: rgba(124,111,255,0.1) !important; color: #a0a0ff !important; }
        @media(max-width:640px) {
          .nav-links-row { display: none !important; }
          .mobile-back { display: flex !important; }
        }
        @media(min-width:641px) {
          .mobile-back { display: none !important; }
        }
      `}</style>

      {/* ── Shared Navbar — hidden on HomePage (it has its own) ── */}
      {!isHome && (
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 300,
            background: "rgba(7,7,31,0.96)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid #1a1a4a",
            padding: "0 20px",
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* Brand — click to go home */}
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <img
              src={mainLogo}
              alt="Logo"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #7c6fff",
                boxShadow: "0 0 0 2px #7c6fff22",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 16,
                  fontWeight: 700,
                  background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.1,
                }}
              >
                GA Tech Solutions
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#3a3a6a",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Business Suite
              </div>
            </div>
          </div>

          {/* Nav pills — desktop only */}
          <div
            className="nav-links-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flex: 1,
              justifyContent: "center",
            }}
          >
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  className={`nav-pill${active ? " active" : ""}`}
                  onClick={() => navigate(link.path)}
                  style={{
                    background: active
                      ? "rgba(124,111,255,0.2)"
                      : "transparent",
                    border: `1px solid ${active ? "#7c6fff55" : "transparent"}`,
                    borderRadius: 8,
                    padding: "5px 11px",
                    color: active ? "#a78bfa" : "#4a4a7a",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{link.icon}</span>
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Back button */}
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "1px solid #2a2a5a",
              borderRadius: 8,
              padding: "6px 14px",
              color: "#4a4a7a",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 5,
              flexShrink: 0,
              transition: "all 0.18s ease",
            }}
          >
            ← Back
          </button>
        </nav>
      )}

      {/* ── Child route renders here ── */}
      <Outlet />
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*
          Layout is the parent wrapper.
          All child <Route> elements render inside <Outlet /> within Layout.
        */}
        <Route element={<Layout />}>
          {/* Dashboard */}
          <Route index element={<HomePage />} />

          {/* Tools */}
          <Route path="invoice" element={<InvoiceGenerator />} />
          <Route path="estimate" element={<EstimateGenerator />} />
          <Route
            path="receipt"
            element={<ReceiptGenerator />}
          />
          <Route
            path="clients"
            element={<ComingSoon title="Client Manager" icon="👥" />}
          />
          <Route
            path="expenses"
            element={<ComingSoon title="Expense Tracker" icon="💸" />}
          />
          <Route
            path="reports"
            element={<ComingSoon title="Business Reports" icon="📈" />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
