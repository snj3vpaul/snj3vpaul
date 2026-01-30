import LightPillar from "../components/LightPillar";
import Hero from "../sections/Hero/Hero";
import "./LandingPage.css"; // create if needed
import BeyondWork from "@/components/BeyondWork";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import TracingBeam from "@/components/TracingBeam/TracingBeam";
export default function LandingPage() {
  return (
    <div className="landing">
      {/* Background FX */}
      <LightPillar />

      {/* Content */}
      <main className="landingContent">
        <TracingBeam left={18} width={2} paddingY={24}>
        <Hero />

        {/* other sections */}
        <AboutSection />
        <ProjectsSection />
        <BeyondWork />
        </TracingBeam>
      </main>
    </div>
  );
}
