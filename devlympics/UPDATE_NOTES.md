# v1.7.2 — Tower visibility, wind scoops, and reachable summit

- Explorer's partner preview is lower-right from the start of Level 3. It clears all platforms at desktop, phone, and short-window sizes.
- Retuned Level 3's landing geometry and kept a clear final gap onto the summit.
- Added two physical wind scoops: pad 1 catches LEFT wind; pad 4 catches RIGHT wind. Each tall climb is 150px, exceeding the normal 140px ballistic maximum. The matching scoop adds charge-scaled lift and reduces horizontal drift. Charge high/full. Wind remains controlled by Navigator at the vane.
- The footer, scoop signs, animations, and grounded hints describe the required settings.
- Levels 4–5 retain the accepted v1.7.1 fixes. All other level mechanics and menu artwork remain unchanged.

Validation: all six sequential landings at 30 and 60fps; wrong-wind climbs fail; two connected clients reach the real summit gate with zero falls; preview/platform overlap checks at five viewport sizes; 47 passing automated tests.

# v1.7.1 — Diner handoff and Navigator lift fixes

Fixed two reproduced failures from v1.7.0:

1. SEND and SERVE could cross in transit and produce different customer counts on each screen. Navigator now issues a single immutable service receipt. A service request arriving first waits for the plate. Each receipt advances that order once on both screens.
2. Shared bubble motion depended on Explorer's animation frames. Browsers can suspend those frames when the other tab is active. One elapsed-time clock is now pumped by rendering, a timer, and incoming Navigator control packets, so simulation continues without Explorer rendering and cannot run twice from overlapping pumps.

Added distinct ingredient-count, stack-order, and sauce feedback; numbered tray layers; selected sauce text on both views; exact current axis keys in the footer; immediate input transitions; and held-key retention at star swaps. Other gameplay and menus remain as in v1.7.0.

Verification includes crossing handoff/service packets, sauce-only recovery, Navigator W/up and S/down/brake with Explorer rendering paused, all three diner orders, and previous regression tests.

# v1.7.0 — Five playable adventures

- Level 4: The Midnight Diner, a cooperative alien kitchen with private orders, ordered ingredient stacks, sauce selection, handoff, and three customers.
- Level 5: The Bubble Ballet, a shared vehicle with split axis control, inertia and braking, three checkpoint stars, control swaps, coral obstacles, and a slow airlock docking finish.
- All five map stops are playable. Invites, stars, completion records, task HUD, results, retries, and grounded Leggy hints cover the new levels.
- Main gameplay fills each player's canvas without side bars or cropped platforms.
- Existing Levels 1–3, restored menu artwork, the repaired Tower summit, Leggy's appearance and commentary behavior, and server setup are retained.

Run: `npm install`, then `npm start`. Tests: `npm test`.
