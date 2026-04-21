"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SimulationResult } from "@/libs/types";
import SimulationResultPanel from "./SimulationResult";

// ── Positions ─────────────────────────────────────────────────────
const PANEL_POS = [
  {l:5, b:6},{l:13,b:6},{l:21,b:6},{l:29,b:6},{l:37,b:6},
  {l:5, b:11},{l:13,b:11},{l:21,b:11},{l:29,b:11},{l:37,b:11},
  {l:5, b:16},{l:13,b:16},{l:21,b:16},{l:29,b:16},{l:37,b:16},
  {l:5, b:21},{l:13,b:21},{l:21,b:21},{l:29,b:21},{l:37,b:21},
];
const TURBINE_POS  = [{l:9,b:27},{l:23,b:30},{l:42,b:26},{l:58,b:29},{l:74,b:27},{l:88,b:30}];
const TURBINE_H    = [148, 128, 162, 138, 152, 132];
const TURBINE_SPD  = [3.2, 2.8, 3.6, 3.0, 2.6, 3.4];

// ── Solar Panel SVG ────────────────────────────────────────────────
function SolarPanelSVG({ idx }: { idx: number }) {
  return (
    <svg viewBox="0 0 70 60" width={48} height={41}
         style={{ display:"block", filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}>
      <defs>
        <linearGradient id={`pb${idx}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a5f"/>
          <stop offset="100%" stopColor="#0d1b3e"/>
        </linearGradient>
      </defs>
      <rect x="3" y="4" width="64" height="44" rx="3" fill={`url(#pb${idx})`}/>
      {[0,1,2].flatMap(r => [0,1,2,3].map(c => (
        <rect key={`${r}${c}`} x={5+c*16} y={6+r*13} width="14" height="11" rx="1.5"
          fill="#1d4ed8" stroke="#3b82f6" strokeWidth="0.5" opacity="0.9"/>
      )))}
      <rect x="3" y="4" width="64" height="44" rx="3" fill="none" stroke="#93c5fd" strokeWidth="1.5"/>
      <line x1="17" y1="48" x2="12" y2="58" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
      <line x1="53" y1="48" x2="58" y2="58" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// ── Wind Turbine SVG ───────────────────────────────────────────────
function WindTurbineSVG({ h, spd }: { h: number; spd: number }) {
  const w = Math.round(h * 0.4);
  return (
    <svg viewBox="0 0 60 150" width={w} height={h}
         style={{ display:"block", filter:"drop-shadow(2px 6px 10px rgba(0,0,0,0.4))", willChange:"transform" }}>
      {/* Tower */}
      <polygon points="27.5,143 32.5,143 31,49 29,49" fill="#cbd5e1"/>
      <polygon points="27.5,143 30,143 29,49 29,49" fill="rgba(255,255,255,0.18)"/>
      {/* Nacelle */}
      <ellipse cx="30" cy="46" rx="7" ry="3.5" fill="#94a3b8"/>
      {/* Rotating blades */}
      <g style={{ willChange:"transform" }}>
        <animateTransform attributeName="transform" type="rotate"
          from="0 30 46" to="360 30 46" dur={`${spd}s`} repeatCount="indefinite"/>
        <path d="M29,46 C27.5,36 28,16 30,10 C32,16 32.5,36 31,46 Z" fill="#f1f5f9"/>
        <path d="M29,46 C27.5,36 28,16 30,10 C32,16 32.5,36 31,46 Z" fill="#e2e8f0" transform="rotate(120 30 46)"/>
        <path d="M29,46 C27.5,36 28,16 30,10 C32,16 32.5,36 31,46 Z" fill="#f1f5f9" transform="rotate(240 30 46)"/>
      </g>
      {/* Hub */}
      <circle cx="30" cy="46" r="5"   fill="#475569"/>
      <circle cx="30" cy="46" r="2.5" fill="#64748b"/>
      {/* Base */}
      <rect x="21" y="143" width="18" height="6" rx="3" fill="#94a3b8"/>
    </svg>
  );
}

// ── Sun ────────────────────────────────────────────────────────────
function Sun() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
      style={{ position:"absolute", top:60, right:80, zIndex:5 }}
    >
      {/* Bob wrapper */}
      <div style={{ animation:"sun-bob 6s ease-in-out infinite" }}>
        {/* Rays */}
        <div style={{
          position:"absolute", inset:-28, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)",
          animation:"sun-spin 30s linear infinite"
        }}>
          {Array(12).fill(null).map((_,i)=>(
            <div key={i} style={{
              position:"absolute", top:"50%", left:"50%",
              width:3, height:32,
              background:"rgba(255,200,0,0.5)",
              borderRadius:2,
              transform:`rotate(${i*30}deg) translateY(-50px)`,
              transformOrigin:"0 0",
            }}/>
          ))}
        </div>
        {/* Core */}
        <div style={{
          width:90, height:90, borderRadius:"50%",
          background:"radial-gradient(circle at 35% 35%, #fff7a0, #fbbf24, #f59e0b)",
          position:"relative", zIndex:1,
          willChange:"transform",
        }}/>
      </div>
    </motion.div>
  );
}

// ── Cloud ──────────────────────────────────────────────────────────
function Cloud({ top, dur, delay, scale = 1, driftName = "cloud-drift-1" }: {
  top:number; dur:number; delay:number; scale?:number; driftName?:string
}) {
  return (
    <div style={{
      position:"absolute", top, zIndex:4, pointerEvents:"none",
      transform:`scale(${scale}) translateZ(0)`,
      transformOrigin:"left center",
      willChange:"transform",
      animation:`${driftName} ${dur}s ${delay}s linear infinite`
    }}>
      <div style={{ position:"relative", width:140, height:50 }}>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:36,
          background:"rgba(255,255,255,0.82)", borderRadius:50 }}/>
        <div style={{ position:"absolute", bottom:18, left:18, width:70, height:55,
          background:"rgba(255,255,255,0.82)", borderRadius:"50%"}}/>
        <div style={{ position:"absolute", bottom:18, left:52, width:52, height:44,
          background:"rgba(255,255,255,0.82)", borderRadius:"50%"}}/>
        <div style={{ position:"absolute", bottom:18, left:85, width:38, height:36,
          background:"rgba(255,255,255,0.75)", borderRadius:"50%"}}/>
      </div>
    </div>
  );
}

// ── Hills SVG ─────────────────────────────────────────────────────
function Hills() {
  return (
    <motion.div
      initial={{ opacity:0, y:40 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:0.2, duration:0.8 }}
      style={{ position:"absolute", bottom:0, left:0, right:0, height:"46vh", zIndex:6, pointerEvents:"none" }}
    >
      <svg viewBox="0 0 1440 400" preserveAspectRatio="none"
           style={{ width:"100%", height:"100%", display:"block" }}>
        {/* Back hill */}
        <path d="M0,170 C180,90 360,140 540,110 C720,80 900,120 1080,95 C1200,78 1350,105 1440,92 L1440,400 L0,400 Z"
              fill="#4ade80" opacity="0.35"/>
        {/* Mid hill */}
        <path d="M0,220 C200,155 420,195 640,172 C840,150 1060,185 1260,162 C1350,150 1410,170 1440,160 L1440,400 L0,400 Z"
              fill="#22c55e" opacity="0.7"/>
        {/* Front hill */}
        <path d="M0,275 C220,230 440,262 680,248 C880,235 1080,258 1280,242 C1370,234 1420,248 1440,243 L1440,400 L0,400 Z"
              fill="#16a34a"/>
        {/* Ground fill */}
        <rect x="0" y="380" width="1440" height="20" fill="#15803d"/>
      </svg>
    </motion.div>
  );
}

// ── Energy particles ───────────────────────────────────────────────
function EnergyParticles({ n }: { n: number }) {
  const pts = Array(Math.min(Math.max(n, 3), 6)).fill(null).map((_,i) => ({
    id: i,
    left: 6 + (i * 37 % 38),
    bottom: 8 + (i * 13 % 18),
    delay: i * 0.5,
    dur: 1.8 + (i % 3) * 0.6,
  }));
  return (
    <>
      {pts.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.left}%`, bottom:`${p.bottom}%`,
          fontSize:13, fontWeight:700, color:"#fbbf24",
          animation:`float-energy ${p.dur}s ${p.delay}s ease-out infinite`,
          textShadow:"0 0 8px rgba(251,191,36,0.9)",
          pointerEvents:"none", zIndex:15, userSelect:"none",
        }}>⚡</div>
      ))}
    </>
  );
}

// ── Animated count-up ──────────────────────────────────────────────
function useCountUp(target: number, dur = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((target * e).toFixed(2)));
      if (p < 1) requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [target, dur]);
  return val;
}

// ── Score HUD ──────────────────────────────────────────────────────
function ScoreHUD({ result }: { result: SimulationResult }) {
  const uretim  = useCountUp(result.toplamUretim, 1400);
  const kazanc  = useCountUp(result.gunlukKazanc, 1600);
  return (
    <motion.div
      initial={{ opacity:0, y:-30 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:0.4, duration:0.5, type:"spring" }}
      style={{
        position:"absolute", top:20, left:"50%", transform:"translateX(-50%)",
        zIndex:20, display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center",
      }}
    >
      {[
        { emoji:"☀️", label:"Üretim",  val:`${uretim.toFixed(1)} kWh` },
        { emoji:"💰", label:"Kazanç", val:`${kazanc >= 0 ? "+" : ""}${kazanc.toFixed(2)} TL/gün` },
      ].map(s => (
        <div key={s.label} style={{
          background:"rgba(0,0,0,0.55)", backdropFilter:"blur(12px)",
          WebkitBackdropFilter:"blur(12px)",
          border:"1.5px solid rgba(255,255,255,0.15)",
          borderRadius:16, padding:"8px 18px",
          display:"flex", alignItems:"center", gap:10,
          animation:"score-pop 0.5s both",
          boxShadow:"0 4px 20px rgba(0,0,0,0.3)"
        }}>
          <span style={{ fontSize:22 }}>{s.emoji}</span>
          <div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em" }}>{s.label}</div>
            <div style={{ fontSize:18, fontWeight:800, color:"#ffffff", fontVariantNumeric:"tabular-nums" }}>{s.val}</div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ── Summary bottom sheet ───────────────────────────────────────────
function SummarySheet({
  result, onBack
}: { result: SimulationResult; onBack: () => void }) {
  const [expanded,  setExpanded]  = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      initial={{ y:"100%" }}
      animate={{ y:0 }}
      transition={{ type:"spring", stiffness:260, damping:28, delay:0.6 }}
      style={{
        position:"absolute", bottom:0, left:0, right:0, zIndex:25,
        background:"rgba(3,7,12,0.93)",
        backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)",
        borderRadius:"28px 28px 0 0",
        border:"1.5px solid rgba(255,255,255,0.12)",
        borderBottom:"none",
        maxHeight:"88vh", overflowY: collapsed ? "hidden" : "auto",
      }}
    >
      {/* Handle — tıklanınca collapse / expand */}
      <div
        onClick={() => setCollapsed(v => !v)}
        style={{
          display:"flex", flexDirection:"column", alignItems:"center",
          padding:"12px 0 8px", cursor:"pointer", userSelect:"none",
          gap:6,
        }}
      >
        <div style={{ width:44, height:5, borderRadius:3, background:"rgba(255,255,255,0.25)" }}/>
        <span style={{
          fontSize:10, fontWeight:700, letterSpacing:"0.1em",
          color:"rgba(255,255,255,0.35)", textTransform:"uppercase",
        }}>
          {collapsed ? "▲ Göster" : "▼ Gizle"}
        </span>
      </div>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
      {!collapsed && (
      <motion.div
        key="sheet-content"
        initial={{ opacity:0, height:0 }}
        animate={{ opacity:1, height:"auto" }}
        exit={{ opacity:0, height:0 }}
        transition={{ type:"spring", stiffness:320, damping:32 }}
        style={{ overflow:"hidden" }}
      >
      <div style={{ padding:"0 20px 20px" }}>
        {/* Title row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div>
            <p style={{ fontSize:11, color:"rgba(74,222,128,0.8)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", margin:0 }}>
              Simülasyon Sonucu
            </p>
            <h3 style={{ fontSize:20, fontWeight:800, color:"#ffffff", margin:"2px 0 0" }}>
              {result.sehir} — {result.gun} Mayıs
            </h3>
          </div>
          <button
            onClick={onBack}
            style={{
              background:"rgba(255,255,255,0.1)", border:"1.5px solid rgba(255,255,255,0.15)",
              borderRadius:12, padding:"8px 16px", color:"rgba(255,255,255,0.8)",
              fontSize:13, fontWeight:600, cursor:"pointer",
            }}
          >
            ← Geri
          </button>
        </div>

        {/* Key metrics grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:18 }}>
          {[
            { label:"Toplam Üretim",  val:`${result.toplamUretim.toFixed(1)} kWh`,      color:"#4ade80" },
            { label:"Günlük Kazanç",  val:`${result.gunlukKazanc >= 0 ? "+" : ""}${result.gunlukKazanc.toFixed(2)} TL`, color: result.gunlukKazanc >= 0 ? "#4ade80" : "#f87171" },
            { label:"Aylık Kazanç",   val:`${result.aylikKazanc >= 0 ? "+" : ""}${result.aylikKazanc.toFixed(0)} TL`,   color: result.aylikKazanc >= 0 ? "#4ade80" : "#f87171" },
            { label:"Geri Ödeme",     val: result.amortismanYil ? `${result.amortismanYil.toFixed(1)} yıl` : "—",        color:"#fbbf24" },
          ].map((m,i) => (
            <motion.div key={m.label}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.85 + i * 0.08 }}
              style={{
                background:"rgba(255,255,255,0.07)",
                border:"1.5px solid rgba(255,255,255,0.1)",
                borderRadius:16, padding:"14px 16px",
              }}
            >
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", fontWeight:600,
                textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>
                {m.label}
              </div>
              <div style={{ fontSize:20, fontWeight:800, color: m.color, fontVariantNumeric:"tabular-nums" }}>
                {m.val}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            width:"100%", padding:"14px",
            background: expanded ? "rgba(22,163,74,0.2)" : "rgba(22,163,74,0.12)",
            border:"1.5px solid rgba(22,163,74,0.4)",
            borderRadius:16, color:"#4ade80",
            fontSize:14, fontWeight:700, cursor:"pointer",
            transition:"all 0.2s",
            marginBottom: expanded ? 18 : 0,
          }}
        >
          {expanded ? "▲ Özeti Daralt" : "▼ Tam Analizi Gör"}
        </button>

        {/* Full report */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:"auto" }}
              exit={{ opacity:0, height:0 }}
              style={{ overflow:"hidden" }}
            >
              {/* Dark mode wrapper for result panel */}
              <div style={{ "--bg":"rgba(255,255,255,0.03)", "--bg-card":"rgba(255,255,255,0.05)",
                "--bg-muted":"rgba(255,255,255,0.08)", "--border":"rgba(255,255,255,0.1)",
                "--border-strong":"rgba(255,255,255,0.2)", "--text-base":"#f1f5f9",
                "--text-muted":"rgba(255,255,255,0.7)", "--primary":"#4ade80",
                "--primary-light":"#86efac", "--accent":"#34d399",
                "--danger":"#f87171", "--warning":"#fbbf24",
              } as React.CSSProperties}>
                <SimulationResultPanel result={result}/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main EnergyScene ───────────────────────────────────────────────
export default function EnergyScene({
  result,
  panelSayisi,
  turbineSayisi,
  onBack,
}: {
  result: SimulationResult;
  panelSayisi: number;
  turbineSayisi: number;
  onBack: () => void;
}) {
  const visiblePanels   = Math.min(panelSayisi,   PANEL_POS.length);
  const visibleTurbines = Math.min(turbineSayisi, TURBINE_POS.length);
  const extraPanels     = Math.max(0, panelSayisi   - PANEL_POS.length);
  const extraTurbines   = Math.max(0, turbineSayisi - TURBINE_POS.length);

  return (
    <div style={{
      position:"relative", width:"100%", height:"100%", overflow:"hidden",
      background:"linear-gradient(180deg, #1565c0 0%, #1976d2 12%, #42a5f5 28%, #90caf9 42%, #b2ebf2 56%, #a5f3b0 68%, #4ade80 82%, #16a34a 100%)"
    }}>
      {/* ── Game world: zemin + panel + türbin alanı ── */}
      <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0 }}>

      {/* Sky extras */}
      <Sun/>
      <Cloud top={55} dur={38} delay={-10} scale={1.1} driftName="cloud-drift-1"/>
      <Cloud top={100} dur={52} delay={-25} scale={0.75} driftName="cloud-drift-2"/>
      <Cloud top={80}  dur={44} delay={-18} scale={0.9} driftName="cloud-drift-1"/>

      {/* Birds — V formation */}
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:1.5 }}
        style={{
          position:"absolute", top:125, left:"-140px", zIndex:5,
          pointerEvents:"none",
          animation:"bird-fly 26s 2s linear infinite",
        }}
      >
        {/* V formation: leader at tip, 4 birds spread behind */}
        {[
          {x:70, y:0},   // leader (front/center)
          {x:44, y:18},  {x:96, y:18},   // row 2
          {x:18, y:36},  {x:122, y:36},  // row 3
        ].map((b, i) => (
          <div key={i} style={{
            position:"absolute", left:b.x, top:b.y,
            width:16, height:7,
            borderTop:"2px solid rgba(25,25,55,0.65)",
            borderLeft:"2.5px solid transparent",
            borderRight:"2.5px solid transparent",
            borderRadius:"50% 50% 0 0",
          }}/>
        ))}
      </motion.div>

      {/* Hills background */}
      <Hills/>

      {/* Wind turbines */}
      {Array(visibleTurbines).fill(null).map((_, i) => (
        <motion.div key={i}
          initial={{ scale:0, y:30 }}
          animate={{ scale:1, y:0 }}
          transition={{ delay: 0.4 + i * 0.18, type:"spring", stiffness:280, damping:20 }}
          style={{
            position:"absolute",
            left:`${TURBINE_POS[i].l}%`,
            bottom:`${TURBINE_POS[i].b}%`,
            zIndex:8,
            transformOrigin:"bottom center",
          }}
        >
          <WindTurbineSVG h={TURBINE_H[i]} spd={TURBINE_SPD[i]}/>
        </motion.div>
      ))}

      {/* Solar panels */}
      {Array(visiblePanels).fill(null).map((_, i) => (
        <motion.div key={i}
          initial={{ scale:0, y:20 }}
          animate={{ scale:1, y:0 }}
          transition={{ delay: 0.6 + i * 0.08, type:"spring", stiffness:350, damping:22 }}
          style={{
            position:"absolute",
            left:`${PANEL_POS[i].l}%`,
            bottom:`${PANEL_POS[i].b}%`,
            zIndex:9,
            transformOrigin:"bottom center",
          }}
        >
          <SolarPanelSVG idx={i}/>
        </motion.div>
      ))}

      {/* Extra count badges */}
      {extraPanels > 0 && (
        <motion.div
          initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:2.2 }}
          style={{
            position:"absolute", left:"46%", bottom:"10%", zIndex:12,
            background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)",
            border:"1.5px solid rgba(147,197,253,0.4)",
            borderRadius:12, padding:"6px 12px",
            color:"#93c5fd", fontSize:12, fontWeight:700,
          }}
        >
          +{extraPanels} panel daha
        </motion.div>
      )}
      {extraTurbines > 0 && (
        <motion.div
          initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:2.4 }}
          style={{
            position:"absolute", left:"46%", bottom:"28%", zIndex:12,
            background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)",
            border:"1.5px solid rgba(255,255,255,0.3)",
            borderRadius:12, padding:"6px 12px",
            color:"#e2e8f0", fontSize:12, fontWeight:700,
          }}
        >
          +{extraTurbines} türbin daha
        </motion.div>
      )}

      {/* Floating energy particles (from panel area) */}
      <EnergyParticles n={panelSayisi + turbineSayisi}/>

      {/* Score HUD */}
      <ScoreHUD result={result}/>

      </div>{/* ── /game world ── */}

      {/* Summary sheet — dışarıda, game world'ün altından çıkar */}
      <SummarySheet result={result} onBack={onBack}/>
    </div>
  );
}
