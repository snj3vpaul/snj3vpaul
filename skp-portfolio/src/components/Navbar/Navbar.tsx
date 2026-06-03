// src/components/Navbar/Navbar.tsx
import { useEffect, useState } from "react";
import { profile, navItems } from "../../data/portfolio";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = [...navItems.map((n) => n.href.slice(1)), "contact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="wrap navbar">
        <a className="brand" href="#home" aria-label={`Home — ${profile.name}`}>
          <span className="mark">{profile.shortName}</span>
          <span>
            <b>{profile.name}</b>
            <span className="role">{profile.tagline}</span>
          </span>
        </a>

        <nav
          className={`navlinks${open ? " open" : ""}`}
          aria-label="Primary"
          onClick={() => setOpen(false)}
        >
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={active === n.href.slice(1) ? "active" : ""}
            >
              {n.label}
            </a>
          ))}
          <a className="cta" href="#contact">
            Get in touch ↗
          </a>
        </nav>

        <button
          className={`menu-btn${open ? " open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
