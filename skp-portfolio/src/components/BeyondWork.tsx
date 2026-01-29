import { useEffect, useMemo, useState } from "react";
import "./BeyondWork.css";

// Cricket
import cricketVideo from "../assets/beyondwork/cricket/100.mp4";
import cricketPoster from "../assets/beyondwork/cricket/fifer.jpeg";

// Volunteering
import aid1 from "../assets/beyondwork/volunteering/61050.jpeg";
import aid2 from "../assets/beyondwork/volunteering/65422.jpeg";

type Media =
  | { kind: "video"; src: string; poster?: string }
  | { kind: "images"; images: { src: string; alt: string }[] }
  | { kind: "placeholder"; label?: string };

type BeyondCard = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  bullets: string[];
  media: Media;
};

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export default function BeyondWork() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = useMemo(
    () => cards.find((c) => c.id === activeId) ?? null,
    [activeId]
  );

  useLockBodyScroll(!!active);

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <section id="beyond" className="bw">
      <div className="bwInner">
        <header className="bwHeader">
          <h2 className="bwTitle">Beyond Work</h2>
          <p className="bwLead">
            Community, sport, and consistency — the things I keep showing up for.
          </p>
        </header>

        <div className="bwGrid">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className={`bwCard ${
                card.media.kind === "placeholder" ? "bwCard--placeholder" : ""
              }`}
              onClick={() => setActiveId(card.id)}
              aria-haspopup="dialog"
              aria-label={`Open details: ${card.title}`}
            >
              <div className="bwCardMedia" aria-hidden="true">
                <CardPreview media={card.media} />
              </div>

              <div className="bwCardBody">
                <div className="bwCardTop">
                  <h3 className="bwCardTitle">{card.title}</h3>
                  <p className="bwCardSubtitle">{card.subtitle}</p>
                </div>

                <div className="bwTags" aria-hidden="true">
                  {card.tags.slice(0, 3).map((t) => (
                    <span key={t} className="bwTag">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="bwHint" aria-hidden="true">
                  Click to expand
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="bwOverlay" role="dialog" aria-modal="true">
          <div className="bwBackdrop" onClick={() => setActiveId(null)} />
          <div className="bwModal" role="document">
            <div className="bwModalTop">
              <div>
                <h3 className="bwModalTitle">{active.title}</h3>
                <p className="bwModalSubtitle">{active.subtitle}</p>
              </div>

              <button
                type="button"
                className="bwClose"
                onClick={() => setActiveId(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="bwModalContent">
              <div className="bwModalMedia">
                <CardExpanded media={active.media} />
              </div>

              <div className="bwModalText">
                <div className="bwTags bwTagsBig">
                  {active.tags.map((t) => (
                    <span key={t} className="bwTag">
                      {t}
                    </span>
                  ))}
                </div>

                <ul className="bwBullets">
                  {active.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CardPreview({ media }: { media: Media }) {
  if (media.kind === "images") {
    const first = media.images[0];
    return (
      <img className="bwImg" src={first.src} alt={first.alt} loading="lazy" />
    );
  }

  if (media.kind === "video") {
    return media.poster ? (
      <img className="bwImg" src={media.poster} alt="" loading="lazy" />
    ) : (
      <div className="bwPlaceholder">Video</div>
    );
  }

  // Placeholder card (e.g., Football not added yet)
  if (media.kind === "placeholder") {
    return (
      <div className="bwPlaceholder">
        <div className="bwPlaceholderInner">
          <div className="bwPlaceholderDot" />
          <div className="bwPlaceholderText">{media.label ?? "Add media"}</div>
        </div>
      </div>
    );
  }

  return null;
}

function CardExpanded({ media }: { media: Media }) {
  if (media.kind === "images") {
    return (
      <div className="bwGallery">
        {media.images.map((img) => (
          <img
            key={img.src}
            className="bwGalleryImg"
            src={img.src}
            alt={img.alt}
            loading="lazy"
          />
        ))}
      </div>
    );
  }

  if (media.kind === "video") {
    return (
      <div className="bwFrameWrap">
        <video
          className="bwVideo"
          controls
          playsInline
          preload="metadata"
          poster={media.poster}
        >
          <source src={media.src} type="video/mp4" />
          Sorry — your browser can’t play this video.
        </video>
      </div>
    );
  }

  if (media.kind === "placeholder") {
    return (
      <div className="bwEmpty">
        <div className="bwEmptyTitle">Football media coming soon</div>
        <div className="bwEmptyDesc">
          Drop your football highlight video + a poster image into
          <span className="bwCode">src/assets/beyondwork/football/</span> and
          update the imports to enable this card.
        </div>
      </div>
    );
  }

  return null;
}

const cards: BeyondCard[] = [
  {
    id: "cricket",
    title: "Cricket",
    subtitle: "Punjab U16 camp → reignited with Canterbury Cricket Club",
    tags: ["Punjab U16", "Canterbury CC", "Athlete"],
    bullets: [
      "Selected for Punjab Under-16 district camp (Nawanshahr).",
      "Reignited my passion with competitive club cricket at Canterbury CC.",
      "Staying consistent with training, match prep, and team commitment.",
    ],
    media: {
      kind: "video",
      src: cricketVideo,
      poster: cricketPoster,
    },
  },
  {
    id: "football",
    title: "Football",
    subtitle: "University left back → now CDM, staying match-fit",
    tags: ["University Level", "Left Back", "CDM"],
    bullets: [
      "Played at university level as a Left Back.",
      "Now usually play CDM — still keep my game active and disciplined.",
      "Love the intensity: defensive reads, transitions, and work rate.",
    ],
    media: {
      kind: "placeholder",
      label: "Football video soon",
    },
  },
  {
    id: "volunteering",
    title: "Volunteering & Community",
    subtitle: "Khalsa Aid relief efforts + Montessori science fair judge",
    tags: ["Khalsa Aid", "Community", "Mentorship"],
    bullets: [
      "Regularly contribute toward Khalsa Aid humanitarian relief efforts.",
      "Volunteered as a judge at a Montessori School science exhibition fair.",
      "I enjoy giving back in ways that are practical and people-focused.",
    ],
    media: {
      kind: "images",
      images: [
        { src: aid1, alt: "Volunteering moment 1" },
        { src: aid2, alt: "Volunteering moment 2" },
      ],
    },
  },
];
