# OTHER SIDE — Three Gates Edition

One level. Two players. Three connected cooperative chambers.

## Quick start (same computer)

1. Extract the ZIP first.
2. Open `public/index.html` in two tabs of the same browser.
3. Enter the same four-letter room code in both tabs.
4. Choose Explorer in one tab and Navigator in the other.

Use two visible browser windows side by side for easy testing. For the proper experience, each player should see only their own screen and speak to their partner.

If your browser restricts communication between local files, use the server option below.

## Two computers / server mode

Install Node.js, then run these commands inside the `devlympics` folder:

```sh
npm install
npm start
```

Open `http://localhost:3000` on the host, and `http://<host-LAN-IP>:3000` on another computer on the same network. Use the same room and opposite roles. Hosting still uses `npm start` and respects the `PORT` environment variable.

## Controls

- **A/D or left/right arrows:** move
- **W, Space or up arrow:** jump
- **E:** interact with a nearby object or console
- **O / OYEE button:** send a loud help call to your partner
- **1–4:** emotes
- **M:** mute
- **Navigator, Gate 1:** click the radar to ping hidden platforms

## The extended level

### Gate 1 — Bridge & secrets

The original puzzle remains: Explorer sends the plank, Navigator crosses and activates the switch, and Explorer follows guidance across hidden platforms. Crossing the first gate now moves **both** players to the next chamber instead of ending the game.

### Gate 2 — The Prism Post Office

Explorer sees a private, randomized order of three runes. Navigator sees the prism controls but cannot read that order, even in the radar. Talk to each other: Navigator walks to the prism console and presses E to route a beam; Explorer stands on the matching receiver and presses E to store it. Three correct deliveries open Gate 2. Each delivery turns the beam off, requiring Navigator to route it again. Incorrect attempts preserve completed charges.

### Gate 3 — The Gravity Duet

Navigator's gravity console cycles the heights of three lifts. Explorer rides them and jumps onto two energy-anchor ledges. The height differences require Navigator's help; the middle lift must rise before Explorer can reach the second anchor. Charged anchors save Explorer's respawn point so a fall does not erase progress.

After both anchors charge, each player stands on their own golden SYNC pad. Hold both pads together for 1.6 seconds to unlock the final gate. Explorer walks through it to finish the level.

## Included improvements

- Three gate progress chips and role-specific instructions.
- Private clues, randomized rune order and prism routing each run.
- Shared puzzle state and automatic chamber transitions.
- Gravity lifts carry a standing Explorer when their height changes.
- Checkpoints and a synchronized final hold meter.
- Existing OYEE effects, emotes, trust system and synthesized sounds retained.
- Play again resets all three chambers for both players.

No build step. No game asset downloads required. Google Fonts is optional; the game falls back to system fonts when offline. LAN play needs the Node relay; two local tabs use BroadcastChannel.


## Team work split (Frontend / Backend / AI)

- **Frontend:** `public/index.html`, `public/style.css`, `public/js/game.js`, `public/js/ai-ui.js`
- **Backend:** `server.js` (static files, WebSocket multiplayer relay, `POST /api/hint`)
- **AI:** `ai/hint-service.js` (prompt, provider call, fallback hints)

The original inline CSS and JavaScript have been moved to separate files without intentionally changing the game logic. The AI hint button calls `POST /api/hint`. If no AI provider settings are configured, the server returns gate- and role-specific fallback hints, so the feature remains usable offline.

### Optional AI provider configuration

The AI service supports an OpenAI-compatible Chat Completions endpoint through environment variables (Node.js 18+ is required for built-in `fetch`):

- `AI_API_URL` — full chat completions endpoint URL
- `AI_API_KEY` — secret API key (server-side only)
- `AI_MODEL` — model name supported by that endpoint

Do not commit secrets. Set these variables in your deployment platform's environment settings. The app works without them using fallback hints.
