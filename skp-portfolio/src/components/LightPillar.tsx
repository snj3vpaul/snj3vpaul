// src/components/LightPillar.tsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./LightPillar.css";

gsap.registerPlugin(ScrollTrigger);

export default function LightPillar() {
  const root = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const glow = root.current?.querySelector(".lpGlow");
      const beam = root.current?.querySelector(".lpBeam");

      if (glow) {
        gsap.to(glow, {
          y: -18,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      if (beam) {
        gsap.to(beam, {
          opacity: 1,
          scaleY: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="lpRoot" aria-hidden="true">
      <div className="lpBeam" />
      <div className="lpGlow" />
      <div className="lpNoise" />
    </div>
  );
}
