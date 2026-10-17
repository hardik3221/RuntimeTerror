# AI Workstream — OTHER SIDE

## Status
The uploaded source ZIP does **not** contain an AI model integration or AI hint endpoint yet. This folder marks the separate AI workstream; it does not pretend AI is already connected to the game.

## Responsibility
Build an optional context-aware hint service for the three-gate cooperative game. Hints should help the Explorer and Navigator communicate without instantly revealing the full solution.

## Suggested contract
Backend route: `POST /api/hint`

Request JSON:
```json
{
  "gate": 1,
  "role": "Explorer",
  "puzzleState": {
    "summary": "short, non-sensitive summary of current puzzle progress",
    "failedAttempts": 0
  }
}
```

Success response:
```json
{ "hint": "Ask your partner what they can see near the upper platform." }
```

Error response:
```json
{ "error": "AI hints are temporarily unavailable." }
```

## Integration boundaries
- AI owner: implement the prompt/model call and safe fallback hints in this folder.
- Backend owner: add `/api/hint` in `server.js`, validate input, call the AI service, enforce timeouts, and keep API keys in environment variables.
- Frontend owner: add the hint button/UI and call `/api/hint`; never expose API credentials in browser code.

## Important
- The existing game currently works without AI. Keep it that way.
- Do not commit `.env` or API keys.
- Use a provider only after the team agrees which provider and model to use.
