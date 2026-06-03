// src/sections/Hero/Hero.tsx
import { motion } from "framer-motion";
import { FaLinkedin } from "react-icons/fa";
import heroImage from "@/assets/LandingPage/portfolio.png";
import "./Hero.css";

export default function Hero() {
  const scrollToWork = () => {
    // points at the projects/case-studies section
    const el = document.getElementById("projects") ?? document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="hero">
      <div className="heroInner">
        {/* LEFT — TEXT */}
        <motion.div
          className="heroContent"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="heroTitle">
            Building secure, scalable <br /> systems with intent
          </h1>

          {/* Names the standards explicitly — this is what recruiters and ATS search for,
              and what differentiates you from a generic security/dev profile. */}
          <p className="heroSubtitle">
            Cryptographic validation &amp; security-compliance work across
            FIPS&nbsp;140-3, NDcPP, and EUCC — turning complex standards into
            validated products and audit-ready evidence.
          </p>

          <div className="heroActions">
            <button className="btnPrimary" onClick={scrollToWork}>
              View case studies
            </button>

            {/* FIX: file in public/ is cv.pdf — the old href (/Sanjeev_K_Paul_CV.pdf) 404'd.
                Either keep this href, or rename public/cv.pdf to match a nicer download name. */}
            <a className="btnSecondary" href="/cv.pdf" download="Sanjeev_K_Paul_CV.pdf">
              Download résumé
            </a>

            <a
              className="btnSecondary"
              href="https://www.linkedin.com/in/sanjeev-kumar-paul/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Open Sanjeev Kumar Paul's LinkedIn profile"
            >
              <FaLinkedin aria-hidden="true" /> LinkedIn
            </a>
          </div>
        </motion.div>

        {/* RIGHT — IMAGE */}
        <motion.div
          className="heroVisual"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <img
            src={heroImage}
            alt="Sanjeev Kumar Paul"
            className="heroImage"
            draggable={false}
            fetchPriority="high"
          />
        </motion.div>
      </div>
    </section>
  );
}
