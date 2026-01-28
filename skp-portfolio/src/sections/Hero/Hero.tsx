import { motion } from "framer-motion";
import monogramUrl from "../../assets/Monogram.svg";
import "./Hero.css";

export default function Hero() {
  const scrollToNext = () => {
    const el = document.getElementById("about");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="home" className="hero">
      {/* Content grid */}
      <div className="heroInner">
        {/* LEFT */}
        <motion.div
          className="heroLeft"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <motion.h1
            className="heroTitle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.05 }}
          >
            Sanjeev K Paul
          </motion.h1>

          <motion.p
            className="heroSubtitle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
          >
            Athlete Turned CyberSecurity Professional
          </motion.p>

          <motion.div
            className="heroActions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
          >
            <button className="btn btnPrimary" onClick={scrollToNext} type="button">
              Know more
            </button>

            <a className="btn btnGhost" href="/cv.pdf" download>
              Download CV
            </a>
          </motion.div>

          <motion.div
            className="heroMeta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.28 }}
          >
            <span className="pill">Cybersecurity</span>
            <span className="pill">Compliance</span>
            <span className="pill">Athlete Mindset</span>
          </motion.div>
        </motion.div>

        {/* RIGHT: spacer column for layout balance */}
        <div className="heroRight" aria-hidden="true" />
      </div>

      {/* Background Monogram: separate absolute layer */}
      <motion.div
        className="heroBgMonogram"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.05 }}
        aria-hidden="true"
      >
        <img src={monogramUrl} alt="" />
      </motion.div>
    </section>
  );
}
