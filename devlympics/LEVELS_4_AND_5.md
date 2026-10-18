# Levels 4 & 5 — Design and play guide

## Level 4: The Midnight Diner

A restaurant on a flying saucer. Your customers are Captain Crumb, Lady Wobble, and a tiny black hole. This level trades platform precision for communication, sequencing, and a kitchen handoff.

Explorer runs the ingredient kitchen. Navigator runs the sauce counter and sees the private customer ticket. The ticket is redacted in Explorer's live partner preview; Navigator should read it aloud. The task footer also keeps the relevant order or tray visible.

1. Navigator reads ingredients **in order**, then the sauce.
2. Explorer uses A/D to approach a jar and E to add that ingredient. The three jars are Moon Cheese, Cloud Cream, and Star Jam. Up to three ingredients fit on a tray.
3. Explorer presses E at SEND to plate the dish.
4. Navigator presses E at CRUNCH, FIZZ, or FLOAT to select sauce, then E at SERVE.
5. Repeat for all three customers. Both players then stand on their own far-right EXIT pad.

Numbered tray layers correspond to the ticket from bottom to top. Service feedback identifies ingredient count, sequence, and sauce separately. If Navigator presses SERVE before the plate arrives, the request waits for SEND. A single shared service receipt keeps both screens on the same customer.

The black-hole BIN clears Explorer's tray, including an already plated dish. An incorrect dish costs no trust and does not delete progress. A wrong sauce can be corrected without rebuilding a correct plate. Empty plates cannot advance service. Old order messages cannot accidentally serve the next customer.

## Level 5: The Bubble Ballet

Both socks squeeze into one soap bubble in a cosmic coral sea. Neither player can navigate the maze alone. Explorer begins with horizontal control; Navigator controls lift. Every collected star switches those assignments.

- Horizontal pilot: A/D or left/right arrows.
- Vertical pilot: W/S or up/down arrows.
- Space: stronger braking on **your own axis**. Releasing direction also slows the bubble gradually.
- Follow stars 1, 2, and 3. A star is a permanent checkpoint and resets drift. Read your new axis after every swap.
- Coral needles return the bubble to the last checkpoint and cost 3 trust. Collected stars remain collected.
- After star 3, guide the bubble to the right airlock, release/brake, and settle there slowly for 1.2 seconds.

There is no race timer or forced moving obstacle. The challenge comes from shared momentum, talking through a zigzag route, and adjusting after a swap. Explorer's client simulates the shared bubble on an elapsed-time clock independent of rendering; Navigator sends control input immediately and periodically. Incoming controls also advance the clock if Explorer's rendering is paused. Held keys remain held through control swaps. Snapshots synchronize its position, velocity, and docking progress. Navigator input expires after a short silence so an interrupted input cannot keep driving forever.

## Viewport and existing content

The full logical 900×480 world is projected across the available gameplay canvas, using its entire width and height. Nothing is cropped; the world adapts its proportions to the window. Partner previews and the existing footer, controls, menus, and Leggy dock remain in place. Levels 1–3 retain their mechanics and geometry, including the previous Tower summit repair.

## Validation

`npm test` includes recipe/role/sequence validation, wrong-dish recovery, stale order rejection, both-player exit requirement, swapped controls, checkpoint persistence, coral collision, safe routes at 30 and 60fps, docking requirements, grounded hints, and all prior Leggy/Tower tests.

Browser checks use two actual clients joined through the WebSocket relay. The diner was completed from fresh state through all three orders and both exits, including rejected service and BIN recovery. The bubble route is driven through directional inputs and requires all three stars and slow docking on both clients. No player position or completion state is injected during these playthroughs.

No extra runtime dependency or generated art service is needed. All new artwork is drawn directly in canvas. Local fonts and audio remain bundled.
