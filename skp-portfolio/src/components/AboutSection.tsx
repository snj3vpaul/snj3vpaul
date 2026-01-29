// src/sections/About/AboutSection.tsx

import React from "react";
import "./AboutSection.css";

type AboutSectionProps = {
  id?: string;
  name?: string;
  title?: string;
  highlight?: {
    label: string;
    title: string;
    description: string;
  };
  skills?: string[];
};

const DEFAULT_SKILLS = [
  "Technical Writing",
  "Sanity Testing",
  "Cryptography",
  "Functional Testing",
  "Network Security",
  "Firewall",
];

export default function AboutSection({
  id = "about",
  name = "Sanjeev",
  title = "Cybersecurity & Compliance | Secure Delivery",
  highlight = {
    label: "Professional Highlight",
    title: "FIPS 140-3 (Software Level 1) Validation — VPN Client Solution",
    description:
      "Helped drive a VPN client through strict cryptographic and compliance expectations—verifying behavior in the real world (not just on paper), tightening security posture, and producing audit-ready clarity.",
  },
  skills = DEFAULT_SKILLS,
}: AboutSectionProps) {
  return (
    <section id={id} className="section about" aria-label="About">
      <div className="card cardPad aboutCard">
        {/* ambient glow */}
        <div className="aboutGlow" aria-hidden="true" />

        <header className="aboutHeader">
          <p className="sectionSub aboutKicker">About</p>

          <h2 className="aboutTitle">I build secure systems — and I actually enjoy the details.</h2>

          <p className="sectionSub aboutIntro">
            I’m {name}. I sit at the intersection of security engineering, testing, and clarity —
            turning complex requirements into secure, shippable outcomes.{" "}
            <span className="aboutMeta">{title}.</span>
          </p>
        </header>

        {/* highlight */}
        <div className="card aboutHighlight">
          <div className="aboutHighlightTop">
            <span className="aboutLabel">{highlight.label}</span>

            <span
              className="aboutPill"
              title="Compliance & validation experience"
              aria-label="Compliance-ready, security-first, test-driven"
            >
              ✅ Compliance-ready • 🔐 Security-first • 🧪 Test-driven
            </span>
          </div>

          <h3 className="aboutHighlightTitle">{highlight.title}</h3>
          <p className="sectionSub aboutHighlightDesc">{highlight.description}</p>
        </div>

        {/* grid: copy + skills */}
        <div className="aboutGrid">
          <div className="card aboutWork">
            <h3 className="aboutH3">How I work</h3>
            <p className="sectionSub aboutWorkCopy">
              I’m happiest when I can jump between packet flows, test cases, and documentation
              without losing the plot. I validate the happy path, chase the weird edge cases, and
              document systems so engineers and auditors stay aligned. Security should be strong —
              but also usable.
            </p>

            <div className="aboutPills" aria-label="Working style">
              <span className="aboutPill">Practical compliance</span>
              <span className="aboutPill">Crisp documentation</span>
              <span className="aboutPill">Reliable validation</span>
            </div>
          </div>

          <div className="card aboutSkills">
            <h3 className="aboutH3">Core skills</h3>

            <div className="aboutChips" aria-label="Skills">
              {skills.map((skill) => (
                <span key={skill} className="aboutChip">
                  {skill}
                </span>
              ))}
            </div>

            <p className="sectionSub aboutSkillsNote">
              If it touches secure communications, testing discipline, or audit clarity — I’m in.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
