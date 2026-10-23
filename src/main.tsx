import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './app/moduleLocales';
import App from './App.tsx';
import { initInputModality } from './shared/lib/inputModality';

initInputModality();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
