import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap'
import './assets/scss/all.scss'
import { RouterProvider } from 'react-router'
import router from './router/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
