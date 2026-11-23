// Fonts are self-hosted (bundled from npm), not loaded from Google.
import '@fontsource-variable/dm-sans/opsz.css';
import '@fontsource-variable/space-grotesk/wght.css';
import './theme.css';

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
