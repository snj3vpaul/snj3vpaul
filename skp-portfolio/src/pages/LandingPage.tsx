import CardNav from "@/components/Navbar/CardNav";
import Hero from "../sections/Hero/Hero";

export default function LandingPage() {
  return (
    <>
      <CardNav />
      <Hero />

      <section id="about" style={{ padding: "96px 20px" }}>
        <div style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
          <h2 style={{ margin: 0 }}>About</h2>
          <p style={{ opacity: 0.75, marginTop: 10 }}>Coming next…</p>
        </div>
      </section>

      <section id="projects" style={{ padding: "96px 20px" }}>
        <div style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
          <h2 style={{ margin: 0 }}>Projects</h2>
          <p style={{ opacity: 0.75, marginTop: 10 }}>Coming next…</p>
        </div>
      </section>

      <section id="contact" style={{ padding: "96px 20px" }}>
        <div style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
          <h2 style={{ margin: 0 }}>Contact</h2>
          <p style={{ opacity: 0.75, marginTop: 10 }}>Coming next…</p>
        </div>
      </section>
    </>
  );
}
