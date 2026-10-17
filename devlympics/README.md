# OTHER SIDE — Three Gates Edition

One level. Two players. Three connected cooperative chambers.

## Quick start (same computer)

1. Extract the ZIP first.
2. Open `public/index.html` in two tabs of the same browser. Click the big Level 1 button on the cartoon map in each tab, then enter your names.
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
- **Q (or O) / OYEE button:** send a loud help call to your partner
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

No build step. No game asset downloads required. The rounded fonts are bundled locally and include their license files; no font downloads are needed. LAN play needs the Node relay; two local tabs use BroadcastChannel.

## Interface update

Start on the illustrated level map, click Level 1, enter your name and choose a role. Level 1 contains all three existing gates. The other two numbered islands are future level concepts, locked and marked Coming Soon.

Play starts with one large world and a large partner inset in the upper-right, matching the reference layout for both roles. Use **Two big views** for equally sized separate maps. The gravity chamber opens these larger views automatically so the inset cannot hide high platforms. Navigator clicks **that radar panel** to send Gate 1 pings. It uses the same map and hidden-platform view as before. The main game view is no longer covered by the radar.

Wait / Ready / Jump / Again send optional quick messages. Speaking to your partner is still the main way to exchange clues; no microphone permissions or built-in voice chat are required. The fullscreen button is in the top toolbar. Returning to Adventures leaves the room for both players and resets the active run.

The interface adapts to smaller screens, but gameplay still needs a physical keyboard. See `PROTOTYPE_NOTES.md` for suggested next features and a short pitch.

## Cartoon map edition

The main menu is now an original illustrated world with floating islands, a dotted trail, numbered level buttons, wooden signs, goofy socks, and locked future levels. The playable maps, characters, three puzzles and sound effects remain the same. Press **Q** to send OYEE; the original **O** shortcut remains supported.

## Trust and failure

When team trust reaches zero, the run stops for both players and a Friendship Out of Order screen appears. Either player can choose **Try again, together!** to restart the entire level for both, or **Level map** to leave the room and return to the approved level screen. Failed runs do not earn completion stars or a best-time record. Q / O still send OYEE while playing.
