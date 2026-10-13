# Brainly – Second Brain frontend

React + TypeScript + Vite + Tailwind client for the Brainly API (save links, tweets, YouTube links and PDFs; search them).

## Run
```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend
npm run dev
npm run build          # type-check + production build
```

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL, e.g. `https://brainly-wzoi.onrender.com` (no trailing slash) |

## How it talks to the backend
- Sign in / sign up store a JWT in `localStorage`; `src/apiClient.ts` sends it as `Authorization: Bearer ...` and redirects to sign-in on a 401.
- Memories are created, updated and searched through the API (`src/atoms/MemoryData.ts`); PDFs are uploaded first and their URL saved as the link.
- The title needs 3+ characters, the description 10+ and the link must be a valid URL (the API's rules are shown as errors in the form).
- Google sign-in is disabled in the UI until the Auth0 redirect flow is connected back to the SPA.

## Deploy (Vercel)
Import the repo, framework "Vite", add `VITE_API_URL`. `vercel.json` rewrites all paths to `index.html` so deep links like `/main` work. Then set the backend's `CORS_ORIGIN` to the Vercel URL.
