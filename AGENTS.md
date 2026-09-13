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
- The article workflow should stay short and non-formal while preserving evidence, first-principles reasoning, AI challenge, ideal-form analysis, and transfer.
- Module settings control defaults. Region settings may override them but must never delete the underlying article, theme, or progress data.
- The fixed compass opens the module guide. The guide, not persistent description text, is the place for operating instructions.
- Each article can override which learning steps are enabled. The AI debate step is triggered when the user sends “我学会了”.
- Each theme owns a persistent Freeform-style board in `state.boards`.
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
