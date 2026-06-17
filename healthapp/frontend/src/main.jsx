import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * METASCALE CLINICAL OS — HYDRATION ENGINE
 * Uses named `createRoot` import to prevent production minification crash
 * ("ReferenceError: t is not defined").
 */
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
