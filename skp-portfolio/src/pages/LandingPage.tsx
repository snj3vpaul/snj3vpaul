// src/pages/LandingPage.tsx
import { useReveal } from "../hooks/useReveal";
import Hero from "../sections/Hero";
import TrustStrip from "../sections/TrustStrip";
import Work from "../sections/Work";
import Lifecycle from "../sections/LifeCycle";
import Experience from "../sections/Experience";
import Capabilities from "../sections/Capabilities";
import Credentials from "../sections/Credentials";
import BeyondWork from "../sections/BeyondWork";
import Contact from "../sections/Contact";
import { profile } from "../data/portfolio";

export default function LandingPage() {
  useReveal();

  return (
    <>
      <main>
        <Hero />
        <TrustStrip />
        <Work />
        <Lifecycle />
        <Experience />
        <Capabilities />
        <Credentials />
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
