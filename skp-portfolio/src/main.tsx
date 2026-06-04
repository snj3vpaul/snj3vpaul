import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/portfolio.css'
import "./styles/theme-warm.css";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
