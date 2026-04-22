"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            style={{
              background: "linear-gradient(160deg, #f0fdf4 0%, #ecfdf5 100%)",
              border: "1.5px solid var(--border-strong)",
              borderRadius: 20,
              maxWidth: 560,
              width: "100%",
              maxHeight: "90dvh",
              overflowY: "auto",
              padding: "28px 28px 24px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Kapat"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1.5px solid var(--border)",
                background: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                lineHeight: 1,
                color: "var(--text-muted)",
                flexShrink: 0,
              }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(135deg,#16a34a,#0ea5e9)",
                  borderRadius: 12,
                  padding: "6px 14px",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 18 }}>🌱</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: "0.04em" }}>
                  YEYS
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(16px,4vw,20px)",
                  fontWeight: 800,
                  color: "var(--text-base)",
                  lineHeight: 1.3,
                  marginBottom: 4,
                  paddingRight: 36,
                }}
              >
                Yenilenebilir Enerji Yönetim Sistemi
              </h2>
            </div>

            {/* Body */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                fontSize: "clamp(13px,3vw,14.5px)",
                lineHeight: 1.7,
                color: "var(--text-muted)",
              }}
            >
              <p>
                YEYS, evine güneş paneli ve rüzgar türbini gibi yenilenebilir enerji sistemleri kurmayı
                düşünen kullanıcılar için geliştirilmiş bir{" "}
                <strong style={{ color: "var(--text-base)" }}>simülasyon ve karar destek sistemidir.</strong>{" "}
                Günlük elektrik tüketimini girerek en uygun enerji paketini görebilir; üretim miktarını,
                tasarruf tutarını ve yatırımın geri dönüş süresini öğrenebilirsin.
              </p>

              <div
                style={{
                  background: "rgba(255,255,255,0.65)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <Feature icon="☀️" text="Yüksek sıcaklıklarda panellerin geçici olarak üretime ara vermesi (Türkiye doğu bölgeleri)" />
                <Feature icon="⚡" text="Günlük 0–5 saat elektrik kesintisi senaryoları ve batarya yedekleme simülasyonu" />
                <Feature icon="📊" text="Paket karşılaştırma, amortisman analizi ve gerçek hayat performans tahminleri" />
              </div>

              <p style={{ fontSize: "clamp(12px,2.8vw,13.5px)" }}>
                YEYS'in amacı, <em>"Bu sistemi kurarsam bana ne kazandırır?"</em> sorusuna net ve anlaşılır
                bir yanıt vererek yatırım kararını kolaylaştırmaktır.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={onClose}
              style={{
                marginTop: 22,
                width: "100%",
                padding: "11px 0",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                letterSpacing: "0.02em",
                boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
              }}
            >
              Simülasyona Başla →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: "clamp(12px,2.8vw,13.5px)", lineHeight: 1.55 }}>{text}</span>
    </div>
  );
}
