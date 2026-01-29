// src/components/BeyondWork.tsx
import { motion } from "framer-motion";
import { FaHandsHelping, FaFutbol, FaMountain } from "react-icons/fa";
import { container, item, fadeUp } from "../animations/motionPresets";
import "./BeyondWork.css";

type Pillar = {
  title: string;
  icon: React.ReactNode;
  points: string[];
};

const pillars: Pillar[] = [
  {
    title: "Community & Volunteering",
    icon: <FaHandsHelping />,
    points: [
      "Regular contributor to Khalsa Aid humanitarian relief efforts",
      "Volunteer judge at Montessori School Science Exhibition Fair",
    ],
  },
  {
    title: "Sport & Competition",
    icon: <FaFutbol />,
    points: [
      "University-level footballer — primarily Left Back, now playing CDM to stay active",
      "Selected for Punjab U16 Cricket Camp representing Nawanshahr district",
      "Reignited cricket journey in Canada with Canterbury Cricket Club (scouted via Kanata CC)",
    ],
  },
  {
    title: "Outdoors & Personal Goals",
    icon: <FaMountain />,
    points: [
      "Winters are dedicated to hiking and trekking",
      "Focused on discipline, endurance, and consistently achieving personal goals",
    ],
  },
];

export default function BeyondWork() {
  return (
    <section id="beyond-work" className="beyondWork">
      <div className="beyondWorkInner">
        <motion.header
          className="beyondWorkHeader"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2>Beyond Work</h2>
          <p>
            What keeps me grounded, competitive, and constantly growing —
            outside of my day job.
          </p>
        </motion.header>

        <motion.div
          className="pillarGrid"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.title}
              className="pillarCard"
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <div className="pillarIcon">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <ul>
                {pillar.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
