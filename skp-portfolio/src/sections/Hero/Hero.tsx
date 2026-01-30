// src/sections/Hero/Hero.tsx
import { motion } from "framer-motion";
import heroImage from "@/assets/LandingPage/portfolio.png";
import "./Hero.css";

export default function Hero() {
  const scrollToAbout = () => {
    const el = document.getElementById("about");
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

          <p className="heroSubtitle">
            Cybersecurity engineer focused on cryptography, network security,
            and building reliable products that scale.
          </p>

          <div className="heroActions">
            <button className="btnPrimary" onClick={scrollToAbout}>
              Know More
            </button>

            <a
              className="btnSecondary"
              href="/Sanjeev_K_Paul_CV.pdf"
              download
            >
              Download CV
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
            alt="Portfolio hero"
            className="heroImage"
            draggable={false}
          />
        </motion.div>
      </div>
    </section>
  );
}
