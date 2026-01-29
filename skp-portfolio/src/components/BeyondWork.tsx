import { FaHandsHelping, FaFutbol, FaMountain } from "react-icons/fa";
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
        <header className="beyondWorkHeader">
          <h2>Beyond Work</h2>
          <p>
            What keeps me grounded, competitive, and constantly growing —
            outside of my day job.
          </p>
        </header>

        <div className="pillarGrid">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="pillarCard">
              <div className="pillarIcon">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <ul>
                {pillar.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
