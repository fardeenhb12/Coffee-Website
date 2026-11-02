/**
 * Escape-key overlay stack.
 *
 * Escape dismisses the topmost layer only. Layers are registered by name, so a
 * re-registration replaces rather than stacks — that keeps React StrictMode's
 * double-mounted effects from pushing the same overlay twice.
 */

interface Overlay {
  name: string;
  close: () => void;
}

const stack: Overlay[] = [];
let listening = false;

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || stack.length === 0) return;
  stack[stack.length - 1].close();
}

function ensureListener(): void {
  if (listening) return;
  document.addEventListener('keydown', handleKeydown);
  listening = true;
}

export function pushOverlay(name: string, close: () => void): void {
  ensureListener();
  removeOverlay(name);
  stack.push({ name, close });
}

export function removeOverlay(name: string): void {
  const index = stack.findIndex((overlay) => overlay.name === name);
  if (index !== -1) stack.splice(index, 1);
}
