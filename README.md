# PromptVault

PromptVault is a personal library for saving, organizing, and reusing the prompts you give to AI tools. Developers rewrite the same prompts constantly and lose the good ones in chat history. PromptVault keeps them in one searchable place, tracks how often each one is used, and copies a prompt to the clipboard in one click.

Built as a MERN-stack technical assessment for StartupMeu (Software Engineer Intern, MERN). The frontend uses **Next.js with TypeScript**, which the StartupMeu hiring team approved by email on 9 October 2026. MongoDB, Express.js, and Node.js are unchanged, and the Express API runs as a separate service.

## Live Demo

| Part | URL |
|---|---|
| Frontend (Vercel) | https://prompt-vault-rho-flame.vercel.app/ |
| API (Render) | https://promptvault-api-3m5s.onrender.com/api |

**Demo account**

| Field | Value |
|---|---|
| Email | `jazz@gmail.com` |
| Password | `jazz1234` |

> **First load can be slow.** The API runs on Render's free tier, which spins the service down after about 15 minutes without traffic. The first request after an idle period can take 30 seconds or more while it wakes up. Later requests are fast.

## Key Features

- **Authentication:** sign up, log in, log out, and session restore on page reload, using JWT and bcrypt-hashed passwords.
- **Private vault:** every prompt belongs to one user, and every query is scoped to the signed-in user.
- **Prompt management:** create, edit, and delete prompts with a title, content, tags, and the AI tool they are meant for.
- **Pin prompts** so your most-used ones stay at the top.
- **One-click copy** with a usage counter that increments each time you copy a prompt.
- **Search, tag filter, sorting, and pagination** for finding prompts quickly.
- **Responsive UI** built with Tailwind CSS and shadcn/ui, including a confirmation dialog before deleting.

## Technologies Used

**Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Axios, Lucide icons

**Backend:** Node.js, Express 5, TypeScript, Mongoose, Zod (validation), JSON Web Tokens, bcryptjs, Helmet, CORS, Morgan

**Database:** MongoDB (MongoDB Atlas in production)

**Hosting:** Vercel (frontend), Render (API), MongoDB Atlas (database)


## Setup and Installation

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database: a local MongoDB instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repository

```bash
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd PromptVault
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5001
```

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Running the Application

Open two terminals.

**Terminal 1: API**

```bash
cd server
npm run dev
```

The API starts on `http://localhost:5001`. Check `http://localhost:5001/api/health`, which should return `{"status":"ok"}`.

**Terminal 2: frontend**

```bash
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and add your first prompt.

### Production build

```bash
# API
cd server && npm run build && npm start

# Frontend
cd client && npm run build && npm start
```

## API Overview

All routes are under `/api`. Protected routes need an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/auth/signup` | Create an account |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Current user (protected) |
| GET | `/prompts` | List prompts with search, tag filter, sort, and pagination |
| GET | `/prompts/tags` | List the user's tags |
| GET | `/prompts/:id` | Get one prompt |
| POST | `/prompts` | Create a prompt |
| PUT | `/prompts/:id` | Update a prompt |
| PATCH | `/prompts/:id/pin` | Toggle pin |
| POST | `/prompts/:id/use` | Increment the usage counter |
| DELETE | `/prompts/:id` | Delete a prompt |

Full request and response details are in [`server/README.md`](./server/README.md). Frontend details are in [`client/README.md`](./client/README.md).

## Deployment

- **Database:** MongoDB Atlas free cluster. Create a dedicated database user, allow network access, and put the database name in the connection string.
- **API (Render):** root directory `server`, build command `npm install && npm run build`, start command `npm start`. Set `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `NODE_ENV=production`.
- **Frontend (Vercel):** root directory `client`. Set `NEXT_PUBLIC_API_URL` to the Render API URL including `/api`. This value is built into the frontend, so redeploy after changing it.

## Code0 Usage

**Confirmation:** Code0 was used during development, specifically its terminal for Git and GitHub operations, plus its project tree and Git graph views.

### AI Development Experience

Code0's AI assistant was **not** used to write or debug code in this project. The AI features were unavailable during development because there were no AI credits on the account. Nothing in this repository is attributed to Code0's AI, and this section describes only the Code0 features that were actually used. The application code was written and debugged by hand.

### Where Code0 Helped

1. **Git and GitHub from the Code0 terminal:** repository initialization, staging, commits, pushes, and pulls for the whole project were done in the Code0 terminal.
2. **Project tree for navigating the monorepo:** the file tree made it easy to move between `client/` and `server/` and to keep the layered backend structure (routes, services, repositories, models) organized as it grew.
3. **Git graph for reviewing history:** the graph view made it simple to see the order of commits and keep the history clear and meaningful, one feature or fix at a time.

## Design Decisions

- **Separate Express API instead of Next.js API routes:** keeps this a true MERN application. The frontend and backend are deployed and scaled independently.
- **JWT sent as a Bearer token:** keeps the API stateless. The token is stored in `localStorage` for simplicity. The trade-off is exposure to XSS compared with an httpOnly cookie, which would be the next step for a production system.
- **Repositories always filter by user:** ownership checks live in one layer, so a new route cannot accidentally leak another user's data.
- **Same error for wrong email and wrong password:** prevents revealing which emails are registered.
- **Zod validation in middleware:** keeps route handlers short and validation reusable.

## Future Improvements

- `{{variable}}` placeholders in prompts, with a form that fills them in before copying
- Automated tests for the API (Jest and Supertest) and the frontend
- Rate limiting on the auth routes
- Restricting CORS to the known frontend origin
- Refresh tokens or httpOnly cookie sessions
- Public share links for individual prompts
- Cursor-based pagination for very large vaults

## Author

Jagdeep Singh