# PromptVault API

The Express and MongoDB backend for [PromptVault](../README.md), a personal library for saving, organizing, and reusing AI prompts. It is written in TypeScript and exposes a JSON REST API consumed by the Next.js frontend in [`../client`](../client/README.md).

**Production API:** https://promptvault-api-3m5s.onrender.com/api

> The API runs on Render's free tier and spins down after about 15 minutes idle. The first request after a quiet period can take 30 seconds or more.

## Features

- Signup and login with bcrypt-hashed passwords and JWT access tokens
- Protected prompt routes where every query is scoped to the signed-in user
- Prompt CRUD with tags and a target AI tool
- Search, tag filter, three sort modes, and pagination
- Pin toggle and an atomic usage counter
- Request validation with Zod and one consistent error format
- Security middleware: Helmet and CORS

## Technologies Used

- Node.js and Express 5
- TypeScript (ES modules, run with `tsx` in development)
- MongoDB with Mongoose
- Zod for request validation
- jsonwebtoken and bcryptjs for authentication
- Helmet, CORS, and Morgan

### Request flow

`route -> middleware (auth, validation) -> service -> repository -> model -> MongoDB`

Routes stay thin and call services. Services hold the business rules and throw `ApiError` when something is wrong. Repositories run the queries and always include the user's ID, which is what stops one user from reading or changing another user's data.

## Setup and Installation

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database: a local instance or a free MongoDB Atlas cluster

### Install

```bash
cd server
npm install
```

### Configure

Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5001
```

Never commit `.env`. It is already ignored by `.gitignore`.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | yes | MongoDB connection string. Include the database name, for example `.../promptvault`. |
| `JWT_SECRET` | yes | Long random string used to sign tokens. |
| `JWT_EXPIRES_IN` | no | Token lifetime. Defaults to `7d`. |
| `PORT` | no | Port to listen on. Defaults to `5001`. |
| `NODE_ENV` | no | Set to `production` in production so internal error details are hidden. |

The server refuses to start if `MONGO_URI` or `JWT_SECRET` is missing.

## Running the Application

```bash
npm run dev     # development with auto-restart (nodemon and tsx)
npm run build   # compile TypeScript to dist/
npm start       # run the compiled server from dist/
```

Check that it is running: `GET http://localhost:5001/api/health` returns `{"status":"ok"}`.

## API Reference

Base URL: `http://localhost:5001/api` locally. Requests and responses are JSON.

Protected routes require this header:

```
Authorization: Bearer <token>
```

### Health

| Method | Endpoint | Response |
|---|---|---|
| GET | `/health` | `200` `{ "status": "ok" }` |

### Auth

| Method | Endpoint | Body | Success response |
|---|---|---|---|
| POST | `/auth/signup` | `{ name, email, password }` | `201` `{ user, token }` |
| POST | `/auth/login` | `{ email, password }` | `200` `{ user, token }` |
| GET | `/auth/me` | none (protected) | `200` the user object |

Notes:
- Passwords must be 8 to 72 characters. Emails are lowercased.
- Signup returns `409` if the email is already registered.
- Login returns `401` with the same message for a wrong email or a wrong password.
- A user looks like `{ "id": "...", "name": "...", "email": "...", "createdAt": "...", "updatedAt": "..." }`. The password is never returned.

### Prompts (all protected)

| Method | Endpoint | Description | Success response |
|---|---|---|---|
| GET | `/prompts` | List prompts | `200` `{ prompts, pagination }` |
| GET | `/prompts/tags` | List the user's tags | `200` `{ tags: string[] }` |
| GET | `/prompts/:id` | Get one prompt | `200` `{ data }` |
| POST | `/prompts` | Create a prompt | `201` `{ data }` |
| PUT | `/prompts/:id` | Update fields of a prompt | `200` `{ data }` |
| PATCH | `/prompts/:id/pin` | Toggle pin | `200` `{ data }` |
| POST | `/prompts/:id/use` | Increment the usage counter | `200` `{ data }` |
| DELETE | `/prompts/:id` | Delete a prompt | `204` no body |

**List query parameters**

| Parameter | Description |
|---|---|
| `search` | Text search over title and content |
| `tag` | Only prompts that have this tag |
| `sort` | `pinned` (default), `recent`, or `used` |
| `page` | Page number, defaults to 1 |
| `limit` | Page size, defaults to 10, maximum 100 |

List response:

```json
{
  "prompts": [ { "id": "...", "title": "...", "content": "...", "tags": ["testing"], "tool": "code0", "isPinned": false, "usedCount": 0, "createdAt": "...", "updatedAt": "..." } ],
  "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
}
```

**Create and update body**

| Field | Required | Notes |
|---|---|---|
| `title` | yes on create | Trimmed, must not be empty |
| `content` | yes on create | Trimmed, must not be empty |
| `tags` | no | Array of non-empty strings |
| `tool` | no | One of `code0`, `chatgpt`, `claude`, `copilot`, `opencode`, `other` (default `other`) |

An update must contain at least one field.

### Errors

Errors use one shape:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [ { "field": "title", "message": "Title is required" } ]
}
```

| Status | Meaning |
|---|---|
| 400 | Validation error, invalid ID, or invalid query parameter |
| 401 | Missing, invalid, or expired token, or wrong credentials |
| 404 | Resource not found, or it belongs to another user |
| 409 | Email already registered |
| 500 | Unexpected server error (details hidden in production) |

## Data Model

**User:** `name`, `email` (unique, lowercased), `password` (bcrypt hash, excluded from queries by default), plus timestamps.

**Prompt:** `user` (owner), `title`, `content`, `tags[]`, `tool`, `isPinned`, `usedCount`, plus timestamps.

**Indexes on prompts**

| Index | Purpose |
|---|---|
| `{ user, isPinned, updatedAt }` | Default list order (pinned first, then newest) |
| `{ user, usedCount }` | Sort by most used |
| `{ user, tags }` | Tag filter |
| `{ title, content }` text | Search |

## Security Notes

- Passwords are hashed with bcrypt (cost 12) and never returned by the API.
- JWTs carry the user ID in the `sub` claim and expire after `JWT_EXPIRES_IN`.
- Prompt queries always include the authenticated user's ID, so other users' prompts return `404`.
- Request bodies are validated with Zod before reaching the services.
- Helmet sets security headers. Raw error details are hidden when `NODE_ENV=production`.
- Atomic `$inc` updates the usage counter, so two quick copies never lose a count.

## Deployment (Render and MongoDB Atlas)

1. Create a free MongoDB Atlas cluster, a dedicated database user, and allow network access. Put the database name in the connection string.
2. Create a Render **Web Service** from the repository with these settings:
   - Root directory: `server`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
3. Add the environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `NODE_ENV=production`.
4. Confirm `https://<your-service>.onrender.com/api/health` returns `{"status":"ok"}`.

## Code0 Usage

Code0 was used during development, specifically its terminal for Git and GitHub operations, along with its project tree and Git graph views. Code0's AI-assisted features were **not** used because AI credits were unavailable. This README does not attribute any backend implementation or debugging work to Code0's AI assistant. See the [root README](../README.md#code0-usage) for the full note.

## Known Limitations and Future Work

- No automated tests yet. Jest and Supertest with an in-memory MongoDB are the planned approach.
- No rate limiting on the auth routes.
- CORS currently allows any origin and should be restricted to the frontend URL.
- Text search matches whole words only, so partial words will not match.
- Offset (skip and limit) pagination is fine for small vaults but would move to cursor pagination at scale.