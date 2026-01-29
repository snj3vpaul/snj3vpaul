import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { GoArrowUpRight } from "react-icons/go";
import "./CardNav.css";
import logoUrl from "../../assets/Monogram.svg";

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo?: string;
  logoAlt?: string;
  items?: CardNavItem[];
  className?: string;

  /** Optional: override CTA text */
  ctaText?: string;
  /** Optional: CTA click handler (defaults to scroll to #contact if present) */
  onCtaClick?: () => void;
}

/**
 * Defaults
 */
const DEFAULT_ITEMS: CardNavItem[] = [
  {
    label: "Overview",
    bgColor: "#111111",
    textColor: "#ffffff",
    links: [
      { label: "About", href: "#about", ariaLabel: "Go to About section" },
      { label: "Projects", href: "#projects", ariaLabel: "Go to Projects section" },
      { label: "Beyond Work", href: "#beyond-work", ariaLabel: "Go to Beyond Work section" },
    ],
  },
  {
    label: "Connect",
    bgColor: "#f3f3f3",
    textColor: "#111111",
    links: [
      { label: "Contact", href: "#contact", ariaLabel: "Go to Contact section" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/sanjeev-kumar-paul/",
        ariaLabel: "Open LinkedIn",
      },
      { label: "GitHub", href: "https://github.com/snj3vpaul/", ariaLabel: "Open GitHub" },
    ],
  },
  {
    label: "More",
    bgColor: "#0b1b3a",
    textColor: "#ffffff",
    links: [
      {
        label: "Cricket",
        href: "https://cricheroes.com/player-profile/21592804/sanjeev-k-paul/matches",
        ariaLabel: "Open Cricket profile",
      },
      {
        label: "The Paul Show",
        href: "http://cjlo.com/shows/the-paul-show",
        ariaLabel: "Open CJLO show",
      },
      { label: "Blogs", href: "https://medium.com/@sanjeevkumarpaul25", ariaLabel: "Open Medium" },
    ],
  },
];

// ✅ typed easing tuple (safe for Framer Motion TS)
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const overlayVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.18 } },
  open: { opacity: 1, transition: { duration: 0.18 } },
};

const panelVariants: Variants = {
  closed: { opacity: 0, y: -6, transition: { duration: 0.2, ease: easeOut } },
  open: { opacity: 1, y: 0, transition: { duration: 0.22, ease: easeOut } },
};

const cardsContainer: Variants = {
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
  open: { transition: { delayChildren: 0.06, staggerChildren: 0.08 } },
};

const cardItem: Variants = {
  closed: { opacity: 0, y: 16, transition: { duration: 0.16, ease: easeOut } },
  open: { opacity: 1, y: 0, transition: { duration: 0.22, ease: easeOut } },
};

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const CardNav: React.FC<CardNavProps> = ({
  logo = logoUrl,
  logoAlt = "Logo",
  items = DEFAULT_ITEMS,
  className = "",
  ctaText = "Let's Talk",
  onCtaClick,
}) => {
  const [open, setOpen] = useState(false);

  const firstThree = useMemo(() => (items || []).slice(0, 3), [items]);

  const toggleMenu = () => setOpen((v) => !v);

  const closeMenu = () => setOpen(false);

  const handleCtaClick = () => {
    if (onCtaClick) return onCtaClick();
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  };

  const goPrimary = (href?: string) => {
    if (!href) return;

    if (isExternalHref(href)) {
      window.open(href, "_blank", "noreferrer");
      closeMenu();
      return;
    }

    // hash navigation (smooth)
    if (href.startsWith("#")) {
      closeMenu();
      scrollToHash(href);
      // also update hash (nice for refresh/deeplink)
      window.location.hash = href;
      return;
    }

    // fallback: normal navigation
    window.location.href = href;
    closeMenu();
  };

  return (
    <div className={`card-nav-container ${className}`}>
      {/* Dim overlay */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="card-nav-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onMouseDown={closeMenu}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>

      <nav className={`card-nav ${open ? "open" : ""}`} aria-label="Site navigation">
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${open ? "open" : ""}`}
            onClick={toggleMenu}
            role="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
              }
            }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            <a
              href="#home"
              aria-label="Go to Home"
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                scrollToHash("#home");
                window.location.hash = "#home";
              }}
            >
              <img src={logo} alt={logoAlt} className="logo" />
            </a>
          </div>

          <button type="button" className="card-nav-cta-button" onClick={handleCtaClick}>
            {ctaText}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              className="card-nav-content"
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
              aria-hidden={!open}
            >
              <motion.div
                className="card-nav-cards"
                variants={cardsContainer}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {firstThree.map((it, idx) => {
                  const primary = it.links?.[0];
                  const primaryHref = primary?.href;

                  return (
                    <motion.div
                      key={`${it.label}-${idx}`}
                      className="nav-card nav-card--clickable"
                      variants={cardItem}
                      style={{ backgroundColor: it.bgColor, color: it.textColor }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${it.label}${primary?.label ? `: ${primary.label}` : ""}`}
                      onClick={() => goPrimary(primaryHref)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          goPrimary(primaryHref);
                        }
                      }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.985 }}
                      transition={{ duration: 0.18, ease: easeOut }}
                    >
                      <div className="nav-card-label">{it.label}</div>

                      <div className="nav-card-links">
                        {it.links?.map((lnk, i) => {
                          const external = isExternalHref(lnk.href);

                          return (
                            <a
                              key={`${lnk.label}-${i}`}
                              className="nav-card-link"
                              href={lnk.href}
                              aria-label={lnk.ariaLabel}
                              onClick={(e) => {
                                // prevent card click from firing
                                e.stopPropagation();

                                // smooth internal hash navigation
                                if (!external && lnk.href.startsWith("#")) {
                                  e.preventDefault();
                                  closeMenu();
                                  scrollToHash(lnk.href);
                                  window.location.hash = lnk.href;
                                  return;
                                }

                                // close menu for external or normal nav
                                closeMenu();
                              }}
                              target={external ? "_blank" : undefined}
                              rel={external ? "noreferrer noopener" : undefined}
                            >
                              <GoArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                              {lnk.label}
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default CardNav;
