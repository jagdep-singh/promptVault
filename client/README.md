# PromptVault Client

The Next.js frontend for [PromptVault](../README.md), a personal library for saving, organizing, and reusing AI prompts. It talks to the separate Express API in [`../server`](../server/README.md) through Axios.

## Live Demo

[https://prompt-vault-rho-flame.vercel.app/](https://prompt-vault-rho-flame.vercel.app/)

| Field | Value |
|---|---|
| Email | `jazz@gmail.com` |
| Password | `jazz1234` |

> The API runs on Render's free tier and spins down after about 15 minutes idle. The first request after a quiet period can take 30 seconds or more.

## Features

- Sign up, log in, and log out, with the session restored on page reload
- Prompt dashboard with search, tag filter, sorting (pinned, recent, most used), and pagination
- Create and edit prompts with a title, content, tags, and the target AI tool
- Pin or unpin prompts
- One-click copy to the clipboard, which also increments the prompt's usage counter
- Delete with a confirmation dialog
- Loading, empty, and error states
- Responsive layout

## Technologies Used

- Next.js 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4 and shadcn/ui components
- Axios for HTTP requests
- Lucide icons

## Setup and Installation

### Prerequisites

- Node.js 20 or newer
- npm
- The PromptVault API running locally (see [`../server/README.md`](../server/README.md)) or the deployed API URL

### Install

```bash
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd PromptVault/client
npm install
```

### Configure

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Make sure the API is running first, otherwise requests will fail.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL, including `/api` |

Production value:

```env
NEXT_PUBLIC_API_URL=https://promptvault-api-3m5s.onrender.com/api
```

`NEXT_PUBLIC_` variables are built into the browser bundle, so never put secrets in them. Restart the dev server after changing `.env.local`, and redeploy after changing the value on Vercel.

## Scripts

```bash
npm run dev     # start the development server
npm run build   # create a production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | public | Redirects to `/dashboard` |
| `/login` | public | Log in |
| `/signup` | public | Create an account |
| `/dashboard` | signed in | Prompt library |
| `/dashboard/new` | signed in | Create a prompt |
| `/dashboard/[id]/edit` | signed in | Edit a prompt |

Dashboard pages check the signed-in user and redirect to `/login` when there is none.

## How It Works

- **API layer:** every request goes through one Axios instance in `lib/api/client.ts`. A request interceptor adds the `Authorization: Bearer <token>` header, and a response interceptor turns API errors into readable messages.
- **Auth state:** `AuthProvider` keeps the current user in React context. On load it reads the saved token and calls `/auth/me` to restore the session.
- **Token storage:** the JWT is stored in `localStorage` under `promptvault_token`. This is simple, but it is readable by JavaScript, so an httpOnly cookie would be the safer choice for a production app.
- **Typed data:** `lib/api/types.ts` mirrors the API responses, so components work with typed prompts, users, and list responses.
- **Copy and usage tracking:** copying a prompt writes it to the clipboard, calls `POST /prompts/:id/use`, and refreshes the list so the usage counter updates.

## Deployment

Deploy the `client` directory to Vercel:

1. Import the repository and set the **root directory** to `client`.
2. Add `NEXT_PUBLIC_API_URL` pointing to the production API, including `/api`.
3. Deploy.

Make sure the backend allows the frontend origin in its CORS configuration.

## Troubleshooting

- **Cannot reach the API:** check that `NEXT_PUBLIC_API_URL` ends with `/api`, then restart the dev server.
- **First request is very slow:** the Render free tier is waking up. Wait and retry.
- **CORS errors:** the backend must allow the exact frontend origin.
- **Redirected to login unexpectedly:** the token may be expired or invalid. Log in again.

## Code0 Usage

Code0 was used during development, specifically its terminal for Git and GitHub operations (commits, pushes, and pulls), along with its project tree and Git graph views.

Code0's AI-assisted features were **not** used because AI credits were unavailable. This README does not attribute any frontend implementation or debugging work to Code0's AI assistant. The overall Code0 notes are in the [root README](../README.md#code0-usage).