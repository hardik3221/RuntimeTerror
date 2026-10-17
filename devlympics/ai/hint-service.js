// AI hint service. Uses an OpenAI-compatible Chat Completions endpoint when configured.
// Without credentials it returns useful deterministic fallback hints so the game remains playable.
const FALLBACKS = {
  1: {
    Explorer: 'Tell your Navigator where you are stuck and ask them to ping the hidden route. Move only after confirming the direction.',
    Navigator: 'Use the radar to help the Explorer find safe ground. Give one clear direction at a time.',
  },
  2: {
    Explorer: 'Ask the Navigator which rune comes next, then interact with the matching lit receiver.',
    Navigator: 'Check the rune order and guide the Explorer one rune at a time. Coordinate before changing the beam.',
  },
  3: {
    Explorer: 'Coordinate with the Navigator before moving between lifts, activate both anchors, then reach the sync pad together.',
    Navigator: 'Cycle the lifts deliberately, tell the Explorer which phase is safe, and coordinate the final sync.',
  },
};

function safeContext(input) {
  const gate = Number(input && input.gate);
  const role = input && input.role === 'Navigator' ? 'Navigator' : 'Explorer';
  if (![1, 2, 3].includes(gate)) return null;
  const p = input.puzzleState && typeof input.puzzleState === 'object' ? input.puzzleState : {};
  return {
    gate,
    role,
    gatesCompleted: Math.max(0, Math.min(3, Number(input.gatesCompleted) || 0)),
    gateOpen: Boolean(input.gateOpen),
    trust: Math.max(0, Math.min(100, Number(input.trust) || 0)),
    puzzleState: {
      litRunes: Math.max(0, Math.min(3, Number(p.litRunes) || 0)),
      beamSet: Boolean(p.beamSet),
      anchorsActivated: Math.max(0, Math.min(2, Number(p.anchorsActivated) || 0)),
      gravityPhase: Math.max(0, Math.min(2, Number(p.gravityPhase) || 0)),
      syncPercent: Math.max(0, Math.min(100, Number(p.syncPercent) || 0)),
    },
  };
}

async function generateHint(input) {
  const ctx = safeContext(input);
  if (!ctx) {
    const error = new Error('Invalid game context. Gate must be 1, 2, or 3.');
    error.statusCode = 400;
    throw error;
  }

  const fallback = FALLBACKS[ctx.gate][ctx.role];
  const endpoint = process.env.AI_API_URL;
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!endpoint || !apiKey || !model) return { hint: fallback, source: 'fallback' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 100,
        messages: [
          { role: 'system', content: 'You are a concise cooperative-platformer hint coach for OTHER SIDE. Help bridge the information gap between Explorer and Navigator. Give exactly one actionable hint in at most two short sentences. Do not reveal a complete solution, invent game mechanics, or claim to see information absent from the context. Encourage the players to communicate. Return plain text only.' },
          { role: 'user', content: JSON.stringify(ctx) },
        ],
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`AI provider returned HTTP ${response.status}`);
    const data = await response.json();
    const hint = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (typeof hint !== 'string' || !hint.trim()) throw new Error('AI provider returned an empty hint');
    return { hint: hint.trim().slice(0, 700), source: 'ai' };
  } catch (err) {
    // Keep the game usable even when the provider is offline or misconfigured.
    return { hint: fallback, source: 'fallback' };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { generateHint };
