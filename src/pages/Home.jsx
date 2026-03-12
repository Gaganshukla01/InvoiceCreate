// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mainLogo from "../assets/images/mainLogo.jpeg";

const TOOLS = [
  {
    id: "invoice",
    path: "/invoice",
    icon: "📄",
    label: "Invoice Generator",
    desc: "Create professional GST invoices with UPI QR, bank details and instant PDF download.",
    tag: "Most Used",
    tagStyle: {
      color: "#a78bfa",
      backgroundColor: "rgba(124,111,255,0.1)",
      borderColor: "rgba(124,111,255,0.3)",
    },
    iconStyle: {
      backgroundColor: "rgba(124,111,255,0.1)",
      borderColor: "rgba(124,111,255,0.3)",
    },
    hoverBorder: "rgba(124,111,255,0.5)",
    hoverShadow: "0 20px 60px rgba(124,111,255,0.2)",
    barStyle: { background: "linear-gradient(to right, #7c6fff, #60a5fa)" },
    arrowStyle: {
      background: "linear-gradient(135deg, #7c6fff, #60a5fa)",
      boxShadow: "0 4px 12px rgba(124,111,255,0.4)",
    },
    stats: "PDF · QR Pay · WhatsApp",
    disabled: false,
  },
  {
    id: "estimate",
    path: "/estimate",
    icon: "📊",
    label: "Estimate Generator",
    desc: "Send quick project estimates to clients before finalising the invoice.",
    tag: "Active",
    tagStyle: {
      color: "#fbbf24",
      backgroundColor: "rgba(245,158,11,0.1)",
      borderColor: "rgba(245,158,11,0.3)",
    },
    iconStyle: {
      backgroundColor: "rgba(245,158,11,0.1)",
      borderColor: "rgba(245,158,11,0.3)",
    },
    hoverBorder: "rgba(245,158,11,0.5)",
    hoverShadow: "0 20px 60px rgba(245,158,11,0.15)",
    barStyle: { background: "linear-gradient(to right, #f59e0b, #f97316)" },
    arrowStyle: {
      background: "linear-gradient(135deg, #f59e0b, #f97316)",
      boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
    },
    stats: "Quotes · Revisions · Approval",
    disabled: false,
  },
  {
    id: "receipt",
    path: "/receipt",
    icon: "🧾",
    label: "Receipt Generator",
    desc: "Issue payment receipts instantly once a client has settled their invoice.",
    tag: "Active",
    tagStyle: {
      color: "#34d399",
      backgroundColor: "rgba(16,185,129,0.1)",
      borderColor: "rgba(16,185,129,0.3)",
    },
    iconStyle: {
      backgroundColor: "rgba(16,185,129,0.1)",
      borderColor: "rgba(16,185,129,0.3)",
    },
    hoverBorder: "rgba(16,185,129,0.2)",
    hoverShadow: "none",
    barStyle: { background: "linear-gradient(to right, #10b981, #06b6d4)" },
    arrowStyle: {},
    stats: "Instant · Branded · PDF",
    disabled:false,
  },
  {
    id: "clients",
    path: "/clients",
    icon: "👥",
    label: "Client Manager",
    desc: "Store client details, track history and auto-fill forms across all tools.",
    tag: "Coming Soon",
    tagStyle: {
      color: "#c084fc",
      backgroundColor: "rgba(168,85,247,0.1)",
      borderColor: "rgba(168,85,247,0.3)",
    },
    iconStyle: {
      backgroundColor: "rgba(168,85,247,0.1)",
      borderColor: "rgba(168,85,247,0.3)",
    },
    hoverBorder: "rgba(168,85,247,0.2)",
    hoverShadow: "none",
    barStyle: { background: "linear-gradient(to right, #a855f7, #ec4899)" },
    arrowStyle: {},
    stats: "CRM · History · Notes",
    disabled: true,
  },
  {
    id: "expenses",
    path: "/expenses",
    icon: "💸",
    label: "Expense Tracker",
    desc: "Log business expenses and generate monthly reports for accounting.",
    tag: "Coming Soon",
    tagStyle: {
      color: "#fb7185",
      backgroundColor: "rgba(244,63,94,0.1)",
      borderColor: "rgba(244,63,94,0.3)",
    },
    iconStyle: {
      backgroundColor: "rgba(244,63,94,0.1)",
      borderColor: "rgba(244,63,94,0.3)",
    },
    hoverBorder: "rgba(244,63,94,0.2)",
    hoverShadow: "none",
    barStyle: { background: "linear-gradient(to right, #fb7185, #ef4444)" },
    arrowStyle: {},
    stats: "Reports · GST · Export",
    disabled: true,
  },
  {
    id: "reports",
    path: "/reports",
    icon: "📈",
    label: "Business Reports",
    desc: "Monthly revenue, outstanding dues and GST summary at a glance.",
    tag: "Coming Soon",
    tagStyle: {
      color: "#38bdf8",
      backgroundColor: "rgba(14,165,233,0.1)",
      borderColor: "rgba(14,165,233,0.3)",
    },
    iconStyle: {
      backgroundColor: "rgba(14,165,233,0.1)",
      borderColor: "rgba(14,165,233,0.3)",
    },
    hoverBorder: "rgba(14,165,233,0.2)",
    hoverShadow: "none",
    barStyle: { background: "linear-gradient(to right, #38bdf8, #818cf8)" },
    arrowStyle: {},
    stats: "Revenue · GST · Insights",
    disabled: true,
  },
];

const STATS = [
  { value: "∞", label: "Invoices" },
  { value: "0%", label: "Commission" },
  { value: "100%", label: "Yours" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#07071f",
        color: "#f0f0ff",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .anim { opacity: 0; animation: fadeUp 0.55s ease forwards; }
        .pulse-dot { animation: pulseRing 1.4s ease infinite; }

        .page-wrap {
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .tool-card {
          position: relative;
          border-radius: 20px;
          padding: 24px;
          overflow: hidden;
          background-color: #0d0d2e;
          border: 1px solid rgba(124,111,255,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .tool-card.active { cursor: pointer; }
        .tool-card.active:hover { transform: translateY(-6px) scale(1.01); }
        .tool-card.disabled { opacity: 0.6; cursor: default; }

        .card-shine {
          position: absolute; inset: 0; border-radius: 20px; pointer-events: none;
          background: radial-gradient(circle at 30% 20%, rgba(124,111,255,0.08) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .tool-card.active:hover .card-shine { opacity: 1; }

        .accent-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px; border-radius: 0 0 20px 20px;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .tool-card.active:hover .accent-bar { opacity: 1; }

        .arrow-btn { transition: transform 0.2s ease; }
        .tool-card.active:hover .arrow-btn { transform: scale(1.1); }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 700px) {
          .cards-grid { grid-template-columns: repeat(2, 1fr); }
          .page-wrap { padding: 0 16px; }
          .hero-title { font-size: 34px !important; }
        }
        @media (max-width: 460px) {
          .cards-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* BG grid */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(124,111,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,111,255,0.04) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          filter: "blur(80px)",
          backgroundColor: "#7c6fff",
          opacity: 0.07,
          top: -112,
          left: -144,
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 400,
          height: 400,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          filter: "blur(80px)",
          backgroundColor: "#60a5fa",
          opacity: 0.06,
          bottom: 64,
          right: -96,
        }}
      />

      {/* NAVBAR */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          borderBottom: "1px solid #1a1a4a",
          backgroundColor: "rgba(7,7,31,0.85)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={mainLogo}
            alt="Logo"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #7c6fff",
              boxShadow: "0 0 0 3px rgba(124,111,255,0.13)",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 17,
                fontWeight: 700,
                lineHeight: 1.2,
                background: "linear-gradient(to right, #c4b5fd, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GA Tech Solutions
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#5050a0",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Business Suite
            </div>
          </div>
        </div>
        {/* <div
          style={{
            fontSize: 12,
            color: "#4040a0",
            backgroundColor: "#12123a",
            border: "1px solid #2a2a5a",
            borderRadius: 999,
            padding: "4px 14px",
          }}
        >
          v1.0
        </div> */}
      </nav>

      {/* HERO */}
      <div
        className="page-wrap"
        style={{ position: "relative", zIndex: 10, paddingTop: 64 }}
      >
        <div
          className="anim"
          style={{ marginBottom: 20, animationDelay: "0.05s" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#12123a",
              border: "1px solid #2a2a5a",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 11,
              color: "#a78bfa",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            <span
              className="pulse-dot"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#7c6fff",
                boxShadow: "0 0 0 3px rgba(124,111,255,0.2)",
                display: "inline-block",
              }}
            />
            GA Tech Business Tools
          </div>
        </div>

        <h1
          className="anim hero-title"
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.08,
            fontSize: 52,
            marginBottom: 20,
            animationDelay: "0.12s",
          }}
        >
          Your Complete
          <span
            style={{
              display: "block",
              background:
                "linear-gradient(to right, #c4b5fd, #60a5fa, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Business Dashboard
          </span>
        </h1>

        <p
          className="anim"
          style={{
            color: "#6060a0",
            fontSize: 16,
            lineHeight: 1.7,
            maxWidth: 520,
            marginBottom: 40,
            animationDelay: "0.2s",
          }}
        >
          Generate invoices, estimates, receipts and manage clients — all in one
          place, built for GA Tech Solutions.
        </p>

        <div
          className="anim"
          style={{
            display: "flex",
            gap: 40,
            marginBottom: 64,
            animationDelay: "0.28s",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 32,
                  fontWeight: 700,
                  background: "linear-gradient(to right, #c4b5fd, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#4040a0",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CARDS */}
      <div
        className="page-wrap"
        style={{ position: "relative", zIndex: 10, paddingBottom: 80 }}
      >
        <div
          className="anim"
          style={{ marginBottom: 20, animationDelay: "0.32s" }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#3a3a6a",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: 4,
            }}
          >
            Available Tools
          </div>
          <div
            style={{
              width: 32,
              height: 2,
              background: "linear-gradient(to right, #7c6fff, #60a5fa)",
              borderRadius: 2,
            }}
          />
        </div>

        <div className="cards-grid">
          {TOOLS.map((tool, i) => (
            <div
              key={tool.id}
              className={`tool-card anim ${tool.disabled ? "disabled" : "active"}`}
              style={{
                animationDelay: `${0.36 + i * 0.07}s`,
                borderColor:
                  hovered === tool.id
                    ? tool.hoverBorder
                    : "rgba(124,111,255,0.15)",
                boxShadow: hovered === tool.id ? tool.hoverShadow : "none",
              }}
              onClick={() => !tool.disabled && navigate(tool.path)}
              onMouseEnter={() => !tool.disabled && setHovered(tool.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="card-shine" />

              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    border: `1px solid ${tool.iconStyle.borderColor}`,
                    backgroundColor: tool.iconStyle.backgroundColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {tool.icon}
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    padding: "3px 10px",
                    borderRadius: 999,
                    border: "1px solid",
                    ...tool.tagStyle,
                  }}
                >
                  {tool.tag}
                </span>
              </div>

              {/* Title */}
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#f0f0ff",
                  lineHeight: 1.3,
                  marginBottom: 8,
                }}
              >
                {tool.label}
              </div>

              {/* Desc */}
              <p
                style={{
                  fontSize: 12.5,
                  color: "#5a5a8a",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}
              >
                {tool.desc}
              </p>

              {/* Bottom */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "#3a3a6a",
                    letterSpacing: "0.5px",
                  }}
                >
                  {tool.stats}
                </span>
                {!tool.disabled && (
                  <div
                    className="arrow-btn"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 14,
                      ...tool.arrowStyle,
                    }}
                  >
                    →
                  </div>
                )}
              </div>

              {/* Accent bar */}
              {!tool.disabled && (
                <div className="accent-bar" style={tool.barStyle} />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="anim"
          style={{
            marginTop: 48,
            textAlign: "center",
            fontSize: 12,
            color: "#2a2a5a",
            lineHeight: 1.7,
            animationDelay: "0.9s",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              color: "#3a3a6a",
            }}
          >
            Built exclusively for GA Tech Solutions
          </span>
          <br />
          More tools coming soon · All data stays on your device
        </div>
      </div>
    </div>
  );
}
