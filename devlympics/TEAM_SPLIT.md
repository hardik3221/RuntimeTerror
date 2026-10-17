# Team Workstream Split

This repository is divided into three workstreams for parallel hackathon development.

## 1. Frontend — `public/`
Owner: Frontend teammate
- `index.html`: markup and UI structure
- `style.css`: all extracted styles
- `game.js`: existing game logic, Canvas rendering, controls, multiplayer client behavior
- `fonts/`: existing local fonts

Keep the existing gameplay and global function names intact. The current `game.js` intentionally remains a classic script because the HTML uses inline event handlers.

## 2. Backend — `server.js`, `package.json`
Owner: Backend teammate
- Node HTTP server serves `public/`
- WebSocket room relay supports two players per room
- Keep the current protocol stable while adding any new HTTP routes
- `npm start` remains the run command

## 3. AI — `ai/`
Owner: AI teammate
- The source project did not yet contain a real AI integration.
- `ai/README.md` defines the proposed API contract.
- Coordinate with Backend on the service interface and with Frontend on the request/response shape.
- Never place API keys in frontend files or commit secrets.

## Integration workflow
1. Commit this split baseline first.
2. Work on separate branches or separate commits.
3. Merge small changes and test both same-browser and two-device multiplayer.
4. Do not replace the whole project with an independently edited copy.
