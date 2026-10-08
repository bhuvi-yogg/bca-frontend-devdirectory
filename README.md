# bca-frontend-devdirectory
the devdirectory 
# DevDirectory

Internal engineering portal — search developers, read their posts, publish updates behind a protected session.
Built with **React 18 + React Router v6 + Axios + plain modern CSS (Vite)**. Data comes from https://jsonplaceholder.typicode.com.

## Run

```bash
npm install
npm run dev                       # development  -> http://localhost:5173
npm run build && npm run preview  # production verification
```

## Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home (stats + jump links) | Public |
| `/users` | Developer directory with live search | Public |
| `/users/:id` | Profile + posts | Public |
| `/login` | Mock login | Guest only |
| `/add-post` | Publish a post (controlled form) | Protected |
| `*` | 404 | Public |

## Architecture

```
src/
├── assets/      global styles
├── components/  Navbar, UserCard, ProtectedRoute, SkeletonLoader, AlertBanner
├── context/     AuthContext (isAuthenticated, login, logout)
├── hooks/       useDebounce
├── pages/       Home, UserDirectory, UserProfile, AddPost, Login, NotFound
├── services/    api.js (single Axios client) + postService.js (4 endpoints)
├── App.jsx      route table
└── main.jsx     BrowserRouter + AuthProvider
```

Data flow: page → `postService.js` → `api.js` (Axios) → API → page renders skeleton / error banner (Retry) / data.

## Before submitting

1. Replace `ROLLNUMBER` in `package.json` (`name`) with your roll number.
2. Create the public repo `bca-frontend-devdirectory-<RollNumber>` and commit with conventional commits.
3. Deploy to Vercel/Netlify (SPA rewrites already in `vercel.json` and `public/_redirects`).
4. Run `npm run build && npm run preview` and keep a screenshot as proof.

## Fixes made in this version

1. Dismissing the error banner no longer leaves a blank page — a "Try again" block stays (`UserDirectory.jsx`, `UserProfile.jsx`).
2. Search debounce reduced from 200 ms to 100 ms so filtering is effectively instant (`UserDirectory.jsx`).
3. `UserProfile` ignores stale responses when the `:id` changes quickly (`UserProfile.jsx`).
