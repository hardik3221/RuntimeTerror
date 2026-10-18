# Add your Groq API keys

1. Open the included `.env` beside `server.js`. It already contains four empty slots.
2. Paste one key after each equals sign:

   GROQ_API_KEY_1=your_first_key
   GROQ_API_KEY_2=your_second_key
   GROQ_API_KEY_3=your_third_key
   GROQ_API_KEY_4=your_fourth_key

3. Save the file. Run `npm install`, then `npm start`.
4. Open http://localhost:3000. Restart the server whenever keys change.

One to four keys work; leave unused slots blank. Do not paste keys into public/index.html. For hosting, use the same names in your server environment.

Requests rotate through valid configured keys in order. Duplicate keys are counted once. Keys rejected with 401/403 are skipped for the rest of that server run, and the request tries another configured key. If all keys are rejected, Leggy reports that clearly. No key values are included in the status endpoint or error messages.

The old `GROQ_API_KEY` single-key setting still works when all numbered slots are blank. Numbered slots take priority. The bundled `.env` intentionally contains no real keys, ready for you to fill in.

**Four keys from the same Groq organization do not give four times the quota.** Request/token limits are organization-wide. On a 429, all keys respect the provider cooldown; rotating keys cannot remove this limit. If you need more capacity, check your Groq limits and use a suitable higher-limit plan. The existing fresh-line buffering and automatic retry behavior remain enabled.

## Commentary timing and sound

- Regular commentary refreshes about every eight seconds during play. The current line remains until its replacement is ready. Network delays, provider limits, falls and open hints can delay background remarks.
- Ten seconds without local input triggers one AFK joke. Moving, pressing a key or using the UI starts a new inactivity period. Held movement keys count as activity. Hidden tabs do not request background commentary.
- Groq generates six fresh, general co-op asides per background request. Each is consumed once; none are predefined. This reduces request and prompt-token use compared with generating every display separately. Falls, hints and other meaningful events still request context-specific dialogue.
- The supplied huh MP3 replaces the synthesized HAHA. It plays on either player’s fall and on level failure. Mute stops it immediately; rapid falls do not overlap clips. Remarks remain text-only.
- The task bar lives in a reserved footer beneath the main canvas, so it cannot obscure playable puzzles. Long instructions scroll within the footer.

## Temporary AI limits

The previous code used a fixed 20-second cooldown after an HTTP 429. The server now honors Groq’s Retry-After header, or uses increasing cooldowns when that header is absent. It preserves the real error reason rather than reporting all failures as busy. Background remarks keep their last visible line and resume automatically; hints retry automatically up to three times, with a manual retry button available afterward. Some request capacity is reserved for direct interactions.

A busy response does not by itself mean the API key is wrong. Groq limits requests and tokens at organization level. If it persists, check https://console.groq.com/settings/limits for this model’s minute/day limits. Wait for the applicable reset or use an appropriate higher-limit plan. Another key in the same organization does not increase those limits. Invalid keys are reported separately. These changes reduce avoidable throttling; they cannot remove the provider’s quota.

The selected model and port are preserved; the four key slots are empty for you to fill. Never place the key in public files.

## Verification

npm test uses mocked Groq responses and checks timing, AFK episodes, buffered lines, stale events, retry delays, sound controls, hint grounding and private clues. Browser checks also use mocked AI responses. Live rate limits and comic quality depend on your account and model.
