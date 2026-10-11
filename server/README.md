
# PromptVault API

Backend for PromptVault, a personal prompt management application.

## Production API

https://promptvault-api-3m5s.onrender.com/api

## Tech stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5001
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Start the compiled server:

```bash
npm start
```

## Authentication endpoints

| Method | Endpoint |
|---|---|
| POST | `/auth/register` |
| POST | `/auth/signup` |
| POST | `/auth/login` |
| GET | `/auth/me` |

Protected routes require:

`Authorization: Bearer <token>`

## Prompt endpoints

| Method | Endpoint |
|---|---|
| GET | `/prompts` |
| GET | `/prompts/tags` |
| GET | `/prompts/:id` |
| POST | `/prompts` |
| PUT | `/prompts/:id` |
| PATCH | `/prompts/:id/pin` |
| POST | `/prompts/:id/use` |
| DELETE | `/prompts/:id` |

List query parameters:

- `search`: search prompt titles and content
- `tag`: filter by tag
- `sort`: `pinned`, `recent`, or `used`
- `page`: page number, defaults to 1
- `limit`: page size, defaults to 10

Prompt creation accepts `title`, `content`, optional `tags`, and optional `tool`.
