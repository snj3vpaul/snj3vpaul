import "./App.css";
import CardNav from "./components/Navbar/CardNav";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <div className="app">
      <CardNav />
      <LandingPage />
    </div>
  );
}
