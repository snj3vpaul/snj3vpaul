import React, { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import createGlobe from "cobe";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaNetworkWired,
  FaFileAlt,
  FaCertificate,
} from "react-icons/fa";
import "./AboutSection.css";

type Feature = {
  title: string;
  description: string;
  className?: string;
  skeleton: React.ReactNode;
};

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};

const gridStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export default function AboutSection() {
  const features: Feature[] = useMemo(
    () => [
      {
        title: "FIPS 140-3 (Software Level 1) — VPN Client Validation",
        description:
          "Helped drive a VPN client through strict cryptographic + compliance expectations—verifying real behavior (not just docs), tightening security posture, and producing audit-ready clarity.",
        skeleton: <SkeletonHighlight />,
        className: "as-col-1 lg:as-col-4 as-border-b lg:as-border-r",
      },
      {
        title: "Security-first validation mindset",
        description:
          "Sanity + functional testing with a risk lens—fast confidence checks, deep edge-case coverage, and reproducible evidence for stakeholders.",
        skeleton: <SkeletonTesting />,
        className: "as-border-b as-col-1 lg:as-col-2",
      },
      {
        title: "Network security on the wire",
        description:
          "Packet-level thinking: what’s negotiated, what’s encrypted, what’s exposed, and where misconfigurations hide.",
        skeleton: <SkeletonNetwork />,
        className: "as-col-1 lg:as-col-3 lg:as-border-r",
      },
      {
        title: "Docs that engineers actually use",
        description:
          "Clear, audit-friendly technical writing—tight reproduction steps, crisp requirements, and fewer cycles of back-and-forth.",
        skeleton: <SkeletonGlobe />,
        className: "as-col-1 lg:as-col-3 as-border-b lg:as-border-none",
      },
    ],
    []
  );

  return (
    <section id="about" className="asWrap">
      <motion.div
        className="asInner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      >
        <motion.header className="asHeader" variants={fadeUp}>
          <p className="asEyebrow">About</p>
          <h2 className="asTitle">Built for security, clarity, and real-world delivery.</h2>
          <p className="asSub">
            I sit at the intersection of cryptography expectations, testing discipline, and
            engineering clarity—so products ship secure and stand up under review.
          </p>
        </motion.header>

        <div className="asGridShell">
          <motion.div className="asGrid" variants={gridStagger}>
            {features.map((f) => (
              <FeatureCard key={f.title} className={f.className}>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureDescription>{f.description}</FeatureDescription>
                <motion.div className="asSkeleton" variants={cardIn}>
                  {f.skeleton}
                </motion.div>
              </FeatureCard>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* =========================
   Building blocks
========================= */

function FeatureCard({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.article
      className={`asCard ${className || ""}`}
      variants={cardIn}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: easeOut }}
    >
      <div className="asCardGlow" aria-hidden="true" />
      {children}
    </motion.article>
  );
}

function FeatureTitle({ children }: { children?: React.ReactNode }) {
  return <h3 className="asCardTitle">{children}</h3>;
}

function FeatureDescription({ children }: { children?: React.ReactNode }) {
  return <p className="asCardDesc">{children}</p>;
}

/* =========================
   Skeletons
========================= */

function SkeletonHighlight() {
  return (
    <div className="skWrap skHighlight">
      <div className="skBadge">
        <FaCertificate />
        <span>Validated</span>
      </div>

      <div className="skLines">
        <div className="skLine" />
        <div className="skLine skLineShort" />
      </div>

      <div className="skPills">
        <span className="skPill">
          <FaShieldAlt /> Approved-mode thinking
        </span>
        <span className="skPill">
          <FaCheckCircle /> Evidence-driven testing
        </span>
        <span className="skPill">
          <FaFileAlt /> Audit-ready clarity
        </span>
      </div>

      <div className="skOverlayTop" aria-hidden="true" />
      <div className="skOverlayBottom" aria-hidden="true" />
    </div>
  );
}

function SkeletonTesting() {
  return (
    <div className="skWrap skTesting">
      <div className="skMiniGrid">
        <div className="skMiniCard">
          <div className="skMiniIcon">
            <FaCheckCircle />
          </div>
          <div>
            <div className="skMiniTitle">Sanity</div>
            <div className="skMiniSub">Fast confidence</div>
          </div>
        </div>

        <div className="skMiniCard">
          <div className="skMiniIcon">
            <FaShieldAlt />
          </div>
          <div>
            <div className="skMiniTitle">Functional</div>
            <div className="skMiniSub">Real flows</div>
          </div>
        </div>

        <div className="skMiniCard">
          <div className="skMiniIcon">
            <FaFileAlt />
          </div>
          <div>
            <div className="skMiniTitle">Repro steps</div>
            <div className="skMiniSub">Audit-friendly</div>
          </div>
        </div>
      </div>

      <div className="skSpark" aria-hidden="true" />
    </div>
  );
}

function SkeletonNetwork() {
  return (
    <div className="skWrap skNetwork">
      <div className="skNetHeader">
        <div className="skNetIcon">
          <FaNetworkWired />
        </div>
        <div>
          <div className="skNetTitle">On-wire validation</div>
          <div className="skNetSub">Packets • policies • posture</div>
        </div>
      </div>

      <div className="skNetRows" aria-hidden="true">
        <div className="skNetRow">
          <span />
          <span />
          <span />
        </div>
        <div className="skNetRow">
          <span />
          <span />
          <span />
        </div>
        <div className="skNetRow">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="skOverlayTop" aria-hidden="true" />
    </div>
  );
}

function SkeletonGlobe() {
  return (
    <div className="skWrap skGlobe">
      <div className="skGlobeTop">
        <div className="skGlobeChip">
          <FaFileAlt />
          <span>Documentation</span>
        </div>
        <div className="skGlobeChip">
          <FaShieldAlt />
          <span>Security</span>
        </div>
      </div>

      <div className="skGlobeStage">
        <Globe className="skCanvas" />
      </div>
    </div>
  );
}

/* =========================
   CO﻿BE Globe (optional)
========================= */

function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 520 * 2,
      height: 520 * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.22, 0.22, 0.22],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [45.4215, -75.6972], size: 0.08 },
        { location: [37.7749, -122.4194], size: 0.05 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.0085;
      },
    });

    return () => globe.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: 520, height: 520, maxWidth: "100%", aspectRatio: 1 }}
    />
  );
}
