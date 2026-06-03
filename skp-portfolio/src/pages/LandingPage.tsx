// src/pages/LandingPage.tsx
import { useReveal } from "../hooks/useReveal";
import Hero from "../sections/Hero";
import Work from "../sections/Work";
import Standards from "../sections/Standards";
import Capabilities from "../sections/Capabilities";
import Experience from "../sections/Experience";
import BeyondWork from "../sections/BeyondWork";
import Contact from "../sections/Contact";
import { profile } from "../data/portfolio";

export default function LandingPage() {
  useReveal();

  return (
    <>
      <main>
        <Hero />
        <Work />
        <Standards />
        <Capabilities />
        <Experience />
        <BeyondWork />
        <Contact />
      </main>

      <footer>
        <div className="wrap foot-in">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built secure · No client-side secrets · FIPS 140-3 · NDcPP · EUCC</span>
        </div>
      </footer>
    </>
  );
}
