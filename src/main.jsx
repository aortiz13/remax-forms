import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LeadPage from './LeadPage.jsx'
import BuscarForm from './BuscarForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/buscar-inmueble" element={<BuscarForm />} />
        <Route path="/lead/:shortId" element={<LeadPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
