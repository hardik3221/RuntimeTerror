/* AI hint UI. This file only calls the backend; it never holds API credentials. */
(() => {
  const button = document.getElementById('aiHintBtn');
  const panel = document.getElementById('aiHintPanel');
  const text = document.getElementById('aiHintText');
  if (!button || !panel || !text) return;

  const fallback = (ctx) => {
    if (!ctx) return 'Start a game first, then ask for a hint.';
    if (ctx.gate === 1) return ctx.role === 'Explorer'
      ? 'Tell your Navigator exactly where you are stuck, then ask them to ping the hidden route.'
      : 'Use your radar to help the Explorer find safe ground. Give one direction at a time.';
    if (ctx.gate === 2) return ctx.role === 'Explorer'
      ? 'Ask the Navigator which rune is next, then interact with the matching lit receiver.'
      : 'Check the rune order and guide the Explorer one rune at a time; coordinate before changing the beam.';
    return ctx.role === 'Explorer'
      ? 'Coordinate with the Navigator before moving between lifts, and activate both anchors.'
      : 'Cycle the gravity/lifts deliberately, tell the Explorer which phase is safe, then sync together.';
  };

  button.addEventListener('click', async () => {
    const ctx = typeof window.getAiGameContext === 'function' ? window.getAiGameContext() : null;
    panel.hidden = false;
    text.textContent = ctx ? ' Thinking of a hint…' : ' ' + fallback(null);
    if (!ctx) return;
    button.disabled = true;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      let response;
      try {
        response = await fetch('/api/hint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ctx),
          signal: controller.signal
        });
      } finally { clearTimeout(timeout); }
      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.hint !== 'string' || !data.hint.trim()) {
        throw new Error(data.error || 'Hint service unavailable');
      }
      text.textContent = ' ' + data.hint.trim();
      if (data.source === 'fallback') text.textContent += ' (offline hint)';
    } catch (err) {
      text.textContent = ' ' + fallback(ctx) + ' (backup hint; AI service unavailable)';
    } finally {
      button.disabled = false;
    }
  });
})();
