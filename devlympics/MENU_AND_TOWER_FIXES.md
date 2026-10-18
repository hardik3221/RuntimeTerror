# Current Tower route — v1.7.2

This section supersedes the older Tower geometry notes below.

Explorer holds Space/W/Up to charge and releases to launch, using A/D to choose direction. Ordinary launch constants are unchanged and there is no mid-air steering.

1. Jump from the base to pad 1.
2. Navigator sets **LEFT** at the wind vane. The fabric scoop on pad 1 catches that wind. Charge high/full and jump right to pad 2.
3. Continue right to pads 3 and 4; CALM is a comfortable setting for these ordinary jumps.
4. Navigator sets **RIGHT**. Charge high/full on pad 4 and jump **left** onto pad 5; its scoop turns that gust upward and slows horizontal drift.
5. Jump right from pad 5 onto the separate summit platform. Keeping RIGHT wind works. Walk through the gold gate.

The tall jumps from pad 1 and pad 4 rise 150px. An unassisted maximum charged jump rises about 140px before discrete integration losses, so the appropriate wind is physically required. A matching scoop adds up to 100 vertical launch speed, with 60% of the ordinary horizontal launch speed; all other launch physics remains the same. Falls still return to the base.

Explorer's partner preview stays below the right-side platforms throughout play, including at spawn. Short viewports adapt its size to avoid hiding the route. It keeps its usual desktop width.

The complete route was played through in two connected browser clients, changing wind with Navigator's actual E interaction. All six landings succeeded and the final gate completed on both screens with zero falls. Automated tests verify the route and required wind settings at 30 and 60fps.

---

Historical notes from v1.6.1 follow:

# v1.6.1 — Menu restoration and Tower ending repair

This update starts from your `I_Need_YOU_Leggy_Larger_Lower (1)(1).zip` build. Your firefly/chime Level 2 and charged-jump/wind Level 3 are retained.

## Menus

- PLAY goes directly from the illustrated title to the level map. Back and Escape return to the title; leaving gameplay returns to the level map.
- The map has five numbered stops. Levels 1–3 are playable; 4 and 5 only show a Coming Soon notice. No gameplay, theme, mechanics or names were designed for those future levels.
- The original local fonts, cartoon artwork, warm colours, floating islands and wooden signs are retained. The title keeps its original composition with full-size desktop controls.
- Map width follows the window rather than shrinking to the viewport's height. All five buttons use large, consistent sizing. Narrow windows scroll the map horizontally instead of making the islands and text tiny.
- The current larger, lower Leggy placement, hint laughter, audio, AI behavior and four-key server setup are preserved.

## Why the old Tower ending got stuck

The old summit slab started at x580, y45 and extended to x900. It sat directly over the lower x585–675 landing at y95. The slab's underside was y61, leaving only 34px of clearance above that lower landing. The sock is 36px tall. That overlap could trap or displace the Explorer before the final jump.

## Repaired ending

- The final approach platform at x645, y155 is widened from 95 to 125px.
- The next landing at x585, y95 is widened from 90 to 110px.
- The awkward extra upper-left ledge and overlapping summit slab are replaced by a separate summit at x770–900, y70. There is open space between the last landing and the summit.
- The gate is drawn fully inside the canvas, resting at the new summit height. Winning checks that the Explorer is standing on that actual summit and has walked through its right-side gate.
- During the Explorer's high ascent, the partner inset moves to the lower right at its existing size so it does not cover the summit. It returns when the Explorer is back down. Navigator's view keeps its layout.

## Final route

1. Reach the wide approach platform at x645–770, y155 using your existing charged jumps.
2. Move toward its right end. Ask Navigator for **RIGHT** wind: it brakes a leftward launch.
3. Face left, charge a short jump, release, and land on x585–695, y95.
4. Ask for **CALM** or a suitable rightward gust. Face right, charge and release onto the separate summit at x770–900, y70.
5. Walk right through the gate. Both clients should receive the completion result.

Charge height, launch speed, wind strength, direction commitment, no mid-air steering and falling back to the base are unchanged. The jump remains `vy = -(470 + 260 × power)` and `vx = direction × (380 + 150 × power) + wind × 70`.

## Verification

- All 29 supplied tests retained, with the obsolete three-stop menu copy assertion updated for the requested five-stop map.
- Four new tests cover head clearance, unchanged jump constants, reachable final jumps at 60Hz and 30Hz, and completion on the actual summit. Total: 33 passing tests.
- A full six-jump Tower run was exercised in two Chromium clients connected through the real WebSocket relay, with keyboard charge/release and Navigator wind controls. Explorer reached the gate without a fall and both clients completed. No player-position warps or forced win events were used for that route.
- Title → Levels, all five stops, and the Coming Soon behavior were checked at 1366px, 1024px and phone width.
- AI calls were mocked during browser QA; no live Groq credits were used. The AI service implementation is unchanged.

## Run

From `devlympics`, run `npm install`, then `npm start`. Open the game on two screens, choose the same level and room code, and pick opposite roles. Keep your existing server-side `.env` when replacing the project files. Run `npm test` for the 33 tests.
