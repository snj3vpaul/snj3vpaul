import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "../animations/motionPresets";
import "./Section.css";

type Props = {
  id: string;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export default function Section({ id, title, eyebrow, children, className }: Props) {
  return (
    <section id={id} className={`section ${className || ""}`}>
      <motion.header
        className="sectionHeader"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
        {title && <h2 className="sectionTitle">{title}</h2>}
      </motion.header>

      <div className="sectionBody">{children}</div>
    </section>
  );
}
