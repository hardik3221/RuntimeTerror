https://runtimeterror.onrender.com
# I Need YOU — Five Level Edition (v1.7.2)


Five playable co-op adventures, selected directly after PLAY. The restored menus and Level 3 summit fix remain. Gameplay fills each player's available canvas edge to edge, keeping the entire puzzle visible.

New in this version: **The Midnight Diner** and **The Bubble Ballet**. See `LEVELS_4_AND_5.md` for their concepts, controls, recovery rules, and validation.

## Level 3 update in v1.7.2

Explorer's partner preview stays in the lower-right empty area throughout the climb. Its normal desktop size is preserved; short windows adapt its size to keep all platforms clear.

Two marked fabric scoops catch the wind and turn it upward. **Pad 1 needs LEFT wind; pad 4 needs RIGHT wind.** Charge almost/full to launch from those scoops. Both climbs are 150 pixels high, above the ordinary jump's maximum, so wind changes are required. Active updrafts add lift and reduce horizontal drift. Ordinary charged jumps retain their original launch values and no mid-air steering. The final platform and reachable summit gate are separate, clear landings.

## Fixes in v1.7.1

- Diner service uses one shared receipt. Nearly simultaneous SEND/SERVE actions wait for handoff instead of disagreeing between screens.
- Dish feedback distinguishes quantity, ingredient sequence, and sauce. Correct ingredients with a wrong sauce do not need rebuilding. Tray layers are numbered bottom to top.
- Bubble simulation runs independently of rendering; Navigator can lift while Explorer's tab is inactive. W / Up lifts, S / Down dives; Space brakes the currently owned axis.
- Inputs send immediately on press/release, and held controls continue through a checkpoint's role swap.

## Quick start with live Leggy

1. Extract the ZIP and open the `devlympics` folder.
2. Copy `.env.example` to `.env` and put your key after `GROQ_API_KEY_1=` (or use the legacy `GROQ_API_KEY=` setting).
3. In this folder run `npm install`, then `npm start` (Node.js 20+).
4. Open `http://localhost:3000` in two tabs or windows.
5. Click PLAY, choose any of the five levels, enter your names, and use the same room code with opposite roles. Shared invite links carry the selected level.

Use two visible windows for testing. During play, each player should see their own screen and speak to their partner. Restart the server after changing `.env`. Requests rotate across the configured keys; organization-wide quotas still apply. See `LEGGY_SETUP.md` for help. Directly opening the HTML runs the game without its AI connection.

## Two computers / server mode

Install Node.js, then run these commands inside the `devlympics` folder:

```sh
npm install
npm start
```

Open `http://localhost:3000` on the host, and `http://<host-LAN-IP>:3000` on another computer on the same network. Use the same room and opposite roles. Hosting still uses `npm start` and respects the `PORT` environment variable.

## Controls

- **A/D or left/right arrows:** move
- **W, Space or up arrow:** jump in Levels 1–2 and 4; in Tangle Tower, hold to charge and release to launch. Level 5 uses W/S or up/down for the vertical axis, A/D or left/right for horizontal, and Space to brake your axis.
- **E:** interact with a nearby object or console
- **Q (or O) / OYEE button:** send a loud help call to your partner
- **1–4:** emotes
- **M:** mute
- **Navigator, Gate 1:** click the radar to ping hidden platforms

## Level 1 — The Other Side: three connected gates

### Gate 1 — Bridge & secrets

The original puzzle remains: Explorer sends the plank, Navigator crosses and activates the switch, and Explorer follows guidance across hidden platforms. Crossing the first gate now moves **both** players to the next chamber instead of ending the game.

### Gate 2 — The Prism Post Office

Explorer sees a private, randomized order of three runes. Navigator sees the prism controls but cannot read that order, even in the radar. Talk to each other: Navigator walks to the prism console and presses E to route a beam; Explorer stands on the matching receiver and presses E to store it. Three correct deliveries open Gate 2. Each delivery turns the beam off, requiring Navigator to route it again. Incorrect attempts preserve completed charges.

### Gate 3 — The Gravity Duet

Navigator's gravity console cycles the heights of three lifts. Explorer rides them and jumps onto two energy-anchor ledges. The height differences require Navigator's help; the middle lift must rise before Explorer can reach the second anchor. Charged anchors save Explorer's respawn point so a fall does not erase progress.

After both anchors charge, each player stands on their own golden SYNC pad. Hold both pads together for 1.6 seconds to unlock the final gate. Explorer walks through it to finish the level.

## New Level 2 — Whispering Woods: Firefly Choir

This is a rhythm-and-coordination level, not another hidden-platform, rune-routing, or gravity-control puzzle. The Explorer must collect five wandering fireflies, but they can only be caught while the Navigator rings a golden bell. The chime freezes the swarm for a short window, so the team has to coordinate repeated bursts: Navigator rings; Explorer sweeps through the swarm; both call out what remains. After all five are collected, the Explorer reaches the moon gate at the far right.

**Controls:** Explorer moves with A/D and jumps with Space/W/Up. Navigator walks beside any of three bells and presses **E**. The chime lasts about 2.8 seconds, with a short cooldown before the next ring.

## New Level 3 — Tangle Tower: Charged Ascent (hard mode)

A tougher precision platform climb inspired by the tension of *Jump King*, with a bespoke platform layout and original art. The Explorer must commit to every launch: hold Space/W/Up to charge, release to jump, and use A/D to choose the launch direction before takeoff. There is no steering mid-air. Platforms rise in a zig-zag path toward the summit; falling sends Explorer back to the base, so each jump matters. The Navigator operates a wind vane at the foot of the tower, cycling **LEFT / CALM / RIGHT** and communicating which gust helps the next jump.

**Controls:** Explorer holds then releases Space/W/Up to set jump power; A/D chooses direction before launch. Navigator stands by the wind vane and presses **E** to change wind. Coordinate each launch aloud. The final summit platform is the finish.

## Included improvements

- Three gate progress chips and role-specific instructions.
- Private clues, randomized rune order and prism routing each run.
- Shared puzzle state and automatic chamber transitions.
- Gravity lifts carry a standing Explorer when their height changes.
- Checkpoints and a synchronized final hold meter.
- Existing OYEE effects, emotes, trust system and synthesized sounds retained.
- Play again resets all three chambers for both players.

No build step. No game asset downloads required. The rounded fonts are bundled locally and include their license files; no font downloads are needed. LAN play needs the Node relay; two local tabs use BroadcastChannel.

## Interface update

Start on the illustrated level map and choose one of the three World 1 levels. Level 1 retains its three original gates; Levels 2 and 3 are now playable, with individual saved times and stars. Worlds 2 and 3 remain preview-only.

Play starts with one large world and a large partner inset in the upper-right, matching the reference layout for both roles. Use **Two big views** for equally sized separate maps. The gravity chamber opens these larger views automatically so the inset cannot hide high platforms. Navigator clicks **that radar panel** to send Gate 1 pings. It uses the same map and hidden-platform view as before. The main game view is no longer covered by the radar.

Wait / Ready / Jump / Again send optional quick messages. Speaking to your partner is still the main way to exchange clues; no microphone permissions or built-in voice chat are required. The fullscreen button is in the top toolbar. Returning to Adventures leaves the room for both players and resets the active run.

The interface adapts to smaller screens, but gameplay still needs a physical keyboard. See `PROTOTYPE_NOTES.md` for suggested next features and a short pitch.

## Cartoon map edition

The main menu is now an original illustrated world with floating islands, a dotted trail, numbered level buttons, wooden signs, goofy socks, and locked future levels. The map, characters and original three-gate puzzle remain, alongside the new Whispering Woods and Tangle Tower adventures. Press **Q** to send OYEE; the original **O** shortcut remains supported.

## Trust and failure

When team trust reaches zero, the run stops for both players and a Friendship Out of Order screen appears. Either player can choose **Try again, together!** to restart the entire level for both, or **Level map** to leave the room and return to the approved level screen. Failed runs do not earn completion stars or a best-time record. Q / O still send OYEE while playing.


## Title, worlds and level maps

The new UI flow is Title → Play → World picker → Level map → Player setup. The title has illustrated islands, two arguing socks, How to Play and a working sound setting. Back buttons and Escape navigate between pages.

Three worlds each contain three level stops:

| World | Level 1 | Level 2 | Level 3 (hardest) |
| --- | --- | --- | --- |
| The Other Side | The Other Side | Whispering Woods | Tangle Tower |
| Echo Vault | Frozen Frequencies | Mirror Mine | The Great Echo |
| Clockwork Chaos | Lopsided Factory | Tick-Tock Trouble | The Last Stitch |

World 1 keeps the existing level-map artwork. Echo Vault uses an icy palette and crystal decorations; Clockwork Chaos uses a purple palette and gears. Each world has nine possible stars. World 1 totals the saved stars across its three playable levels; each level also shows its own stars.

World 1 now has three playable adventures. Worlds 2 and 3 remain illustrated previews and are not playable in this build. Their future unlock chain is not activated yet.

After a run, Level Map returns to World 1’s level map. Sound, hints, gameplay and the illustrated victory popup remain available.


## I Need YOU / Cartoon polish edition

This edition restores the colourful cartoon menus and polishes their existing look. The title, world picker and level maps retain the original smiling clouds, sock characters, irregular wooden signs and bright palette. Added details include softly shaded floating islands, richer button surfaces, improved spacing, consistent branding and clear lock icons on world previews.

The game name is now **I Need YOU** in the browser tab, title screen, menu branding, completion screen, package metadata and server output. “The Other Side” remains the name of the first world/chapter. Existing local progress keys are retained so earlier stars and completion times stay compatible.

The same three-world, nine-stop menu flow remains. World 1 Levels 1–3 are playable; Worlds 2 and 3 remain previews.


## Leggy: live AI commentator

Leggy is now a dry, observant sock commentator, powered by Groq for every joke, introduction, roast, hint and completion verdict. There are no canned Leggy dialogue arrays. Background generation returns several fresh asides per request, consumed once at roughly eight-second intervals. Repeated requests generate afresh; the model receives the last eight remarks to discourage repetition, and copied style examples, near repeats and overlong jokes are regenerated once. A language model can still occasionally produce similar jokes.

Falls, repeated failures, cooperation and gate changes queue a contextual remark. Quiet moments also trigger a fresh aside at varied intervals (roughly 24–38 seconds). Event priority and readable dwell times prevent chatter flooding the screen. Every screen has its own role-aware commentary. Existing game controls, stages, sounds and two-player relay remain.

Comments slide out beside the trust meter and remain until the next remark replaces them. Clicking Leggy replays the last line. His face changes from a neutral smile to a sideways smirk for sarcasm, and to a thinking expression while waiting for AI.

HINT opens in the same top HUD dock to the right of the trust meter, never above the bottom bulb. Groq writes a fresh roast first; after 2.6–5 seconds, its own newly worded practical hint appears below. Hints stay open while moving and jumping until closed with ×, Escape, or the bulb. Puzzle progress refreshes the hint; stale responses are discarded. Smaller screens stack the card beneath Leggy and the radar while retaining its position to the right of the meter.

The model receives authoritative next-step mechanics from the server and writes its own hint from those facts. Output checks reject malformed responses, unsupported example controls, and explicit private rune names in Navigator hints. These checks reduce mistakes but cannot guarantee every model-generated instruction is correct. Names and room codes are omitted. Leggy does not record microphones or control physics.

### Add your Groq keys

Node.js 20+ is required. No real key is included.

1. Open the included `.env` beside `server.js` (or copy `.env.example` if needed).
2. Fill `GROQ_API_KEY_1` through `GROQ_API_KEY_4`. Unused slots may stay blank.
3. Run `npm install`, then `npm start`.
4. Open `http://localhost:3000`. Use the same room and opposite roles in two windows/devices.

Restart the server after changing `.env`. Requests rotate across the configured keys; organization-wide quotas still apply. Use the server URL, not a double-clicked HTML file, for AI. `GROQ_MODEL` defaults to `llama-3.3-70b-versatile`. Keep the key server-side. The included `.gitignore` excludes `.env`.

If the key is missing, rejected, rate-limited, or Groq is unavailable, Leggy shows a clear connection status. It does **not** substitute scripted jokes or static hints. The hint card offers a retry button. The game itself continues to work.

The server limits body sizes, concurrent requests and overall request volume. Commentary waits behind an open hint. Both players make independent AI requests, so rate limits on your Groq account can affect response availability.

Run `npm test` for service and UI logic checks: no-key behavior, fresh requests, model-written hints, duplicate regeneration, private clue protection, errors/timeouts and puzzle grounding. Tests use mocked Groq responses; live generation requires your own key.

API references: https://console.groq.com/docs/text-chat and https://console.groq.com/docs/structured-outputs.


See LEGGY_SETUP.md and UPDATE_NOTES.md for the new eight-second commentary, ten-second AFK trigger, uploaded failure sound, task footer, and automatic recovery from temporary API limits.
