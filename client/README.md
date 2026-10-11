# PromptVault — Client

PromptVault is a personal library for saving, organizing, and reusing AI prompts.

## Live Demo

Open the deployed app: [PromptVault](https://prompt-vault-rho-flame.vercel.app/)

### Demo account

| Field | Value |
|---|---|
| Email | `jazz@gmail.com` |
| Password | `jazz1234` |

## Features

- JWT authentication with signup, login, session restoration, and logout.
- Create, edit, pin, copy, track usage of, and delete prompts.
- Tagging, search, filtering, sorting, and pagination.
- Responsive Next.js interface built with TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS and shadcn/ui
- Axios for API requests
- Express, MongoDB, and JWT authentication via the separate backend

## Getting Started

```bash
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd PromptVault/client
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Start the app:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL, including `/api` |

For production:

```env
NEXT_PUBLIC_API_URL=https://promptvault-api-3m5s.onrender.com/api
```

Restart the development server after changing `.env.local`. Do not commit `.env.local` or store secrets in `NEXT_PUBLIC_API_URL`.

## Commands

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Start the production server after building
```

## Routes

| Route | Description |
|---|---|
| `/login` | Login |
| `/signup` | Create an account |
| `/dashboard` | Prompt library |
| `/dashboard/new` | Create a prompt |
| `/dashboard/[id]/edit` | Edit a prompt |

All dashboard routes require authentication.

## API

- Production API: [https://promptvault-api-3m5s.onrender.com/api](https://promptvault-api-3m5s.onrender.com/api)
- Local API: `http://localhost:5001/api`

The client calls the API through `lib/api/`. See the backend README for complete endpoint details.

## Deployment

Deploy the `client` directory to a Next.js-compatible host such as Vercel. Set `NEXT_PUBLIC_API_URL` to the production backend URL and ensure backend CORS allows the frontend origin.

## Troubleshooting

- **Cannot connect to the API:** confirm `NEXT_PUBLIC_API_URL` includes `/api`, then restart the app.
- **CORS errors:** allow the exact frontend origin in the backend CORS configuration.
- **401 errors:** log in again and confirm the API URL points to the correct environment.

## Development Workflow

### Code0 usage

Code0's terminal was used for Git and GitHub operations, including pushing and pulling repository changes.

Code0's AI-assisted features were not used because AI credits were unavailable during development. This README does not attribute implementation or debugging tasks to Code0's AI assistant.

---

## License

Add the applicable license information if the project is distributed under an explicit open-source license.
