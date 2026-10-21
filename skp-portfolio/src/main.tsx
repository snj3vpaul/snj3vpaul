import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/portfolio.css'
import "./styles/theme-warm.css";
import "./styles/redesign.css";
import "./styles/theme-technical.css";
import "./styles/theme-hybrid.css";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
