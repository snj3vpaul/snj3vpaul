// src/sections/Hero/Hero.tsx
import { motion } from "framer-motion";
import monogramUrl from "../../assets/Monogram.svg";
import { container, item, fade } from "../../animations/motionPresets";
import "./Hero.css";

export default function Hero() {
  const scrollToNext = () => {
    const el = document.getElementById("about");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="home" className="hero">
      {/* Content (Motion owns) */}
      <motion.div
        className="heroContent"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="heroTitle" variants={item}>
          Sanjeev K Paul
        </motion.h1>

        <motion.p className="heroSubtitle" variants={item}>
          Athlete Turned CyberSecurity Professional
        </motion.p>

        <motion.div className="heroActions" variants={item}>
          <button className="btn btnPrimary" onClick={scrollToNext} type="button">
            Know more
          </button>

          <a className="btn btnGhost" href="/cv.pdf" download>
            Download CV
          </a>
        </motion.div>

        {/* keep meta for later; fade only */}
        <motion.div className="heroMeta" variants={fade} />
      </motion.div>

      {/* Background monogram (Motion owns, GSAP does NOT touch) */}
      <motion.div
        className="heroBgMonogram"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        aria-hidden="true"
      >
        <img src={monogramUrl} alt="" />
      </motion.div>
    </section>
  );
}
