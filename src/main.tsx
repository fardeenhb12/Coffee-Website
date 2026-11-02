import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/main.css';
import App from './App';

/**
 * Entry point.
 *
 * `main.css` is imported once, here, and nowhere else. It is a frozen port of
 * the hand-written stylesheet: no component may import, override or append to
 * it. See `MIGRATION.md` §"The one unbreakable rule".
 *
 * `body.is-loaded` gates the hero entrance animation. Two frames are requested
 * so the browser paints the hero's hidden state before it moves — collapsing
 * this to one frame makes the headline appear already settled.
 */
requestAnimationFrame(() =>
  requestAnimationFrame(() => document.body.classList.add('is-loaded'))
);

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root not found in index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
