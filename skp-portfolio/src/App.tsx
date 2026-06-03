// src/App.tsx
import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <>
      <div className="bg" aria-hidden="true" />
      <Navbar />
      <LandingPage />
    </>
  );
}
