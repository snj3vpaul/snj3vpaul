import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Tracingbeam.css";

type TracingBeamProps = {
  children: React.ReactNode;
  /** Distance from left edge of container */
  left?: number; // px
  /** Beam thickness */
  width?: number; // px
  /** Vertical padding inside container (so beam doesn't start at absolute top) */
  paddingY?: number; // px
  /** How much of the container height should be "active" (1 = full height) */
  intensity?: number; // 0..1
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function TracingBeam({
  children,
  left = 14,
  width = 2,
  paddingY = 18,
  intensity = 1,
  className = "",
}: TracingBeamProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [active, setActive] = useState(false);

  // Respect reduced motion
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;

    // Activate only when in/near viewport (perf)
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setActive(e.isIntersecting);
      },
      { root: null, threshold: 0.02 }
    );

    io.observe(el);

    const onScroll = () => {
      if (!wrapRef.current) return;

      const rect = wrapRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      // Compute progress through container:
      // start when top enters viewport, end when bottom leaves viewport.
      const start = vh * 0.15; // start a bit after entering
      const end = vh * 0.85; // end a bit before leaving
      const total = rect.height + (end - start);

      // When rect.top is at "start" => progress 0
      // When rect.bottom is at "end" => progress 1
      const travelled = start - rect.top;
      const p = clamp(travelled / total, 0, 1);

      setProgress(p);
    };

    const tick = () => {
      // Use rAF to avoid spamming setState during scroll
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    };

    // Initial
    onScroll();

    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, []);

  // If not active (not in viewport), keep beam subtle / avoid head jitter
  const effectiveProgress = active ? progress : 0;

  return (
    <div ref={wrapRef} className={`tb ${className}`}>
      {/* Beam UI */}
      <div
        className="tbRail"
        aria-hidden="true"
        style={{
          left,
          width,
          top: paddingY,
          bottom: paddingY,
          opacity: reduceMotion ? 0.55 : active ? 1 : 0.35,
        }}
      >
        {/* The "glow" gradient line */}
        <div className="tbLine" />

        {/* The active fill (grows with progress) */}
        <div
          className="tbFill"
          style={{
            transform: `scaleY(${clamp(effectiveProgress * intensity, 0, 1)})`,
          }}
        />

        {/* The head that follows scroll */}
        {!reduceMotion && (
          <div
            className="tbHead"
            style={{
              top: `calc(${clamp(effectiveProgress * intensity, 0, 1) * 100}% - 10px)`,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="tbContent">{children}</div>
    </div>
  );
}
