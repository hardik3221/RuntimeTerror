# Prototype direction

## What this update adds

- A name field before joining through the Level 1 setup sheet. Each tab remembers its own name for refreshes.
- An original cartoon level map: floating islands, numbered level buttons, a winding trail, crooked signs, a castle, and goofy sock characters. Click 1 for name and room setup.
- Future Level 2 and Level 3 concepts clearly marked Coming Soon, not playable.
- A large main map with an upper-right partner inset on both screens. Two big views remains available; the gravity chamber opens separate maps to keep high platforms visible.
- Room and teammate badges, a timer, gate progress, and role-specific instructions.
- Optional Wait / Ready / Jump / Again messages, sent to the other player with the sender's name.
- Fullscreen, a return-to-adventures button, a completion stamp and best completed time saved in this browser.

The world layouts, artwork, character drawings, existing emotes, OYEE effect, sounds and puzzle rules are retained. This is still one playable level with three cooperative gates.

## Is the current information exchange appropriate?

Yes. Keep asymmetric information as the core: one player sees something the other cannot, and both players have to explain and act. The private rune clue remains hidden from the Navigator's map. The new quick signals help with timing without revealing the answer.

Use speaking as the main channel when players are together, or use an existing voice call for remote play. This build does not contain microphone capture or voice chat.

Avoid turning each puzzle into a list of automatic instructions or showing both private clues on both screens. That would remove much of the cooperation. Also avoid making every puzzle depend on typed chat; typing would interrupt movement and jumping.

A direction worth trying later: let players communicate through an in-world signal device for one specific puzzle. For example, the Explorer hears a short rhythm while the Navigator operates a matching sequence of bells. Limit that change to a new puzzle and playtest it before changing the existing gates.

## Most useful next steps

1. **Reconnect and resume.** A temporary connection loss currently ends the run and returns players to the menu. Preserve a shared checkpoint and let the same pair reconnect. This matters more than adding more levels before a live demo.
2. **A short first-time tutorial.** Let players learn move, jump, E and the partner radar in a safe area. Keep it skippable and roughly 30 seconds long.
3. **Role swapping between runs.** Offer a coordinated swap at the result screen so both people can try the other perspective.
4. **Separate sound and accessibility controls.** Individual effects/ambience volume, optional text-to-speech, and a high-contrast signal mode could make the prototype easier to use. Keep rune shapes and labels alongside their colors.
5. **Playtest with three fresh pairs.** Watch where they stop talking, fail to find the console, miss a jump, or misunderstand a private clue. Fix those points before adding a leaderboard or accounts.

## What to show in a pitch

“Two players are in different dimensions. Each has information and abilities the other needs. The first gate teaches trust, the second tests communication, and the third tests timing. You only escape by combining what both players know.”

## Validation for this build

Tested in two Chromium browser clients against the included Node WebSocket relay: required name entry, name exchange, separate map placement, radar pings, quick signals, movement after toolbar focus, all three chamber transitions, rune-clue privacy, prism completion, actual gravity-assisted jumps, anchor checkpoints, synchronized final pads, the completion screen, replay, return to menu and saved name/completion state. Checked horizontal fit at desktop, tablet and narrow phone widths. The phone layout adapts, but this prototype still needs a physical keyboard; it does not add touch movement controls.

## Cartoon revision checks

Q sends OYEE from either player to the other; O remains an alias. Both worlds have the same width in split view and in enlarged stacked view. Rechecked all three puzzles in two browser clients, alongside name entry, radar clicks, private rune clues, gravity-assisted jumps, checkpoints, final pads, replay and completion tracking. Layout fit checked at 1366, 1024, 768 and 390 pixels.

## Trust failure and reference layout

The approved level-selection page is preserved. Gameplay follows the supplied screenshot with a large main world and 48% partner inset for both roles, framed with stitched borders, crooked gate tags and a taped plan. A trust-zero event stops both clients and shows an illustrated failure dialog. Retry restarts the whole level for both; failure never awards completion. Checked exact zero, negative-value clamping, frozen movement, shared retry, return to map, and all three stages in two browser clients. Original synthesized sounds and puzzle physics were compared against the previous build and remain unchanged.
