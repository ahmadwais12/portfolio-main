import { useEffect, useRef } from "react";

type HeroBackdropProps = {
  className?: string;
};

const COLOR = "56, 189, 248";
const GLYPHS = "{}[]()<>/=+*;:._$#01|&%".split("");
const WORDS = ["const", "let", "fn", "async", "await", "return", "=>", "</>", "npm", "git", "if", "for", "class", "div", "map", "null"];

type Column = {
  x: number;
  head: number;
  speed: number;
  trail: number;
  glyphs: string[];
};

const HeroBackdrop = ({ className = "" }: HeroBackdropProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fontSize = 14;
    const lineHeight = 20;

    let columns: Column[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;

    const randomGlyph = () => {
      if (Math.random() < 0.18) {
        return WORDS[Math.floor(Math.random() * WORDS.length)];
      }
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    };

    const seed = () => {
      const gap = 26;
      const count = Math.max(8, Math.ceil(width / gap));
      columns = Array.from({ length: count }, (_, index) => ({
        x: index * gap + gap / 2,
        head: Math.random() * height,
        speed: 0.7 + Math.random() * 1.9,
        trail: 10 + Math.floor(Math.random() * 14),
        glyphs: Array.from({ length: 40 }, randomGlyph),
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textAlign = "center";

      for (const column of columns) {
        for (let step = 0; step < column.trail; step++) {
          const y = column.head - step * lineHeight;
          if (y < -lineHeight || y > height + lineHeight) continue;

          const fade = 1 - step / column.trail;
          const alpha = 0.06 + fade * fade * 0.5;
          const glyph = column.glyphs[(step + Math.floor(column.head / lineHeight)) % column.glyphs.length];
          ctx.fillStyle = `rgba(${COLOR}, ${alpha})`;
          ctx.fillText(glyph, column.x, y);
        }

        if (!reducedMotion) {
          column.head += column.speed;
          if (column.head - column.trail * lineHeight > height) {
            column.head = -Math.random() * height * 0.5;
            column.speed = 0.7 + Math.random() * 1.9;
            column.trail = 10 + Math.floor(Math.random() * 14);
            column.glyphs = Array.from({ length: 40 }, randomGlyph);
          }
        }
      }

      if (!reducedMotion) raf = requestAnimationFrame(render);
    };

    resize();
    render();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none h-full w-full ${className}`}
    />
  );
};

export default HeroBackdrop;
