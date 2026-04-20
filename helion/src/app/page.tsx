import SimulationForm from "@/components/SimulationForm";
import NatureCanvas   from "@/components/NatureCanvas";

export default function Home() {
  return (
    <div className="relative min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Floating leaf background */}
      <NatureCanvas />

      {/* Everything above the canvas */}
      <div className="relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <header
          className="sticky top-0"
          style={{
            background: "rgba(240,253,244,0.85)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1.5px solid var(--border)",
            zIndex: 50,
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            {/* Logo mark */}
            <div
              className="flex items-center justify-center w-11 h-11 rounded-2xl text-white font-bold text-lg select-none"
              style={{
                background: "linear-gradient(135deg, #4ade80, var(--primary), var(--accent))",
                boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
              }}
            >
              Y
            </div>

            <div className="flex-1">
              <h1 className="text-base font-bold leading-none" style={{ color: "var(--text-base)" }}>
                YEYS
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Yenilenebilir Enerji Yönetim Sistemi
              </p>
            </div>

            {/* Eco badge */}
            <span
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "var(--bg-muted)",
                border: "1.5px solid var(--border-strong)",
                color: "var(--primary)",
              }}
            >
              🌱 Doğa Dostu
            </span>
          </div>
        </header>

        {/* Hero strip */}
        <div
          className="w-full py-10 px-4 text-center"
          style={{
            background: "linear-gradient(180deg, rgba(220,252,231,0.6) 0%, transparent 100%)",
          }}
        >
          <p
            className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--text-base)" }}
          >
            Enerji Simülasyonu
          </p>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
            Güneş &amp; rüzgar üretiminizi simüle edin, tasarrufunuzu keşfedin.
          </p>
        </div>

        {/* Form */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <SimulationForm />
        </main>

        {/* Footer */}
        <footer
          className="text-center py-6 text-xs"
          style={{ color: "#86efac", borderTop: "1px solid var(--border)" }}
        >
          YEYS — Yenilenebilir Enerji Yönetim Sistemi · Mayıs Simülasyonu
        </footer>
      </div>
    </div>
  );
}
