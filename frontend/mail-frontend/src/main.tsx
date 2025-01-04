//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// disable strictmode because it causes the components to render twice (and thus make 2 api requests rather than 1..)
createRoot(document.getElementById('root')!).render(
    <App />
)
