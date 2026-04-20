"use client";

import { useEffect, useRef } from "react";

interface Leaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  hue: number;       // 120–160 green range
  phase: number;     // for sinusoidal sway
}

function createLeaf(canvasW: number, canvasH: number): Leaf {
  return {
    x: Math.random() * canvasW,
    y: canvasH + Math.random() * 60,
    vx: 0,
    vy: -(0.3 + Math.random() * 0.5),
    size: 6 + Math.random() * 12,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.015,
    opacity: 0,
    hue: 120 + Math.random() * 40,
    phase: Math.random() * Math.PI * 2,
  };
}

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf) {
  ctx.save();
  ctx.translate(leaf.x, leaf.y);
  ctx.rotate(leaf.rotation);
  ctx.globalAlpha = leaf.opacity;

  ctx.beginPath();
  ctx.moveTo(0, -leaf.size);
  ctx.bezierCurveTo(
    leaf.size * 0.65, -leaf.size * 0.35,
    leaf.size * 0.65,  leaf.size * 0.35,
    0,                 leaf.size
  );
  ctx.bezierCurveTo(
    -leaf.size * 0.65,  leaf.size * 0.35,
    -leaf.size * 0.65, -leaf.size * 0.35,
    0, -leaf.size
  );
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, leaf.size);
  grad.addColorStop(0, `hsla(${leaf.hue}, 65%, 62%, 1)`);
  grad.addColorStop(1, `hsla(${leaf.hue}, 55%, 45%, 1)`);
  ctx.fillStyle = grad;
  ctx.fill();

  // midrib
  ctx.beginPath();
  ctx.moveTo(0, -leaf.size * 0.85);
  ctx.lineTo(0,  leaf.size * 0.85);
  ctx.strokeStyle = `hsla(${leaf.hue}, 55%, 38%, 0.5)`;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
}

export default function NatureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const LEAF_COUNT = 18;
    const leaves: Leaf[] = [];
    let rafId: number;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Stagger initial leaf spawn
    for (let i = 0; i < LEAF_COUNT; i++) {
      const leaf = createLeaf(canvas.width, canvas.height);
      leaf.y = Math.random() * canvas.height; // distribute vertically at start
      leaf.opacity = Math.random() * 0.18;
      leaves.push(leaf);
    }

    function tick() {
      t += 0.012;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const leaf of leaves) {
        // Sinusoidal horizontal drift
        leaf.x += leaf.vx + Math.sin(t + leaf.phase) * 0.4;
        leaf.y += leaf.vy;
        leaf.rotation += leaf.rotSpeed;

        // Fade in near bottom, fade out near top
        const progress = 1 - leaf.y / canvas!.height;
        if (progress < 0.15) {
          leaf.opacity = Math.min(leaf.opacity + 0.004, progress / 0.15 * 0.18);
        } else if (progress > 0.85) {
          leaf.opacity = Math.max(0, leaf.opacity - 0.006);
        } else {
          leaf.opacity = Math.min(leaf.opacity + 0.003, 0.18);
        }

        // Recycle when off-screen top
        if (leaf.y < -leaf.size * 2 || leaf.opacity <= 0) {
          const fresh = createLeaf(canvas!.width, canvas!.height);
          Object.assign(leaf, fresh);
        }

        drawLeaf(ctx!, leaf);
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 1 }}
      aria-hidden="true"
    />
  );
}
