// src/pages/LandingPage.tsx
import { useReveal } from "../hooks/useReveal";
import Hero from "../sections/Hero";
import Work from "../sections/Work";
import MyStory from "../sections/MyStory";
import Approach from "../sections/Approach";
import Writing from "../sections/Writing";
import Experience from "../sections/Experience";
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
        <MyStory />
        <Work />
        <Approach />
        <Experience />
        <BeyondWork />
        <Writing />
        <Credentials />
        <Contact />
      </main>

      <footer>
        <div className="wrap foot-in">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>A little work, a little curiosity, and everything in between.</span>
        </div>
      </footer>
    </>
  );
}
