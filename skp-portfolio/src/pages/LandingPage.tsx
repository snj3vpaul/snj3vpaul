import LightPillar from "../components/LightPillar";
import Hero from "../sections/Hero/Hero";
import "./LandingPage.css"; // create if needed

export default function LandingPage() {
  return (
    <div className="landing">
      <LightPillar />
      <main className="landingContent">
        <Hero />
        {/* other sections */}
      </main>
    </div>
  );
}
