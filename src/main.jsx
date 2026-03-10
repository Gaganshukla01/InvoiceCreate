import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import InvoiceGenerator from './pages/InvoiceCreate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InvoiceGenerator/>
  </StrictMode>,
)
