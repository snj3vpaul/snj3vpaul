import LightPillar from "../components/LightPillar";
import Hero from "../sections/Hero/Hero";
import "./LandingPage.css"; // create if needed
import BeyondWork from "@/components/BeyondWork";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
export default function LandingPage() {
  return (
    <div className="landing">
      {/* Background FX */}
      <LightPillar />

      {/* Content */}
      <main className="landingContent">
        <Hero />

        {/* other sections */}
        <AboutSection />
        <ProjectsSection />
        <BeyondWork />
      </main>
    </div>
  );
}
