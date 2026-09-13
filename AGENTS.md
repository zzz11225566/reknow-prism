# ReKnow Prism Development Notes

## Product Boundary

- This repository is the frontend prototype for the Zhihu Hackathon track "知识炼金场".
- The first version uses mock data and must remain demonstrable without a backend.
- Real Zhihu and AI calls must be implemented behind `api.js` or a future server API.
- Never place an access token, model key, or other secret in browser code.

## Architecture

- `index.html`: static shell and view containers.
- `styles.css`: light workspace, dark universe, responsive behavior.
- `data.js`: demo themes, articles, decomposition content, and search results.
- `api.js`: the only frontend data boundary; replace mock methods with backend calls.
- `app.js`: workspace, article lifecycle, personalization, and local persistence.
- `universe.js`: Three.js scene and universe interactions.
- `server.js`: local static server only.

## Behavior Rules

- A theme is a galaxy. Articles follow the lifecycle `seed -> planet -> lit`.
- Adding a theme uses a snapshot. New articles are not silently added to an existing snapshot.
- The decomposition workflow must remain four steps and preserve both first-principles reasoning and ideal-form analysis.
- Keep the product usable on desktop and narrow mobile screens.
- Prefer native HTML, CSS, and JavaScript so this version can later be merged with the existing ReKnow prototype.

## Verification

Run:

```bash
npm test
```

For browser verification:

```bash
npm start
```

Then open `http://127.0.0.1:4173`.
