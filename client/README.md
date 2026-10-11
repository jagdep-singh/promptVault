# PromptVault — Client

A web application for creating, organizing, and managing reusable AI prompts in one place. PromptVault helps users maintain a personal prompt library, find prompts quickly, organize them with tags, and track their usage across different AI tools.

The client is built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui. It communicates with a separate Express REST API backed by MongoDB.

## Overview

PromptVault provides an authenticated workspace where users can create and manage prompts for AI-assisted development, writing, research, and other tasks.

Instead of repeatedly searching through chat histories or notes, users can save prompts with titles, content, tags, and associated AI tools. They can subsequently search, filter, sort, pin, copy, edit, and delete their saved prompts.

The client communicates with the backend through a centralized Axios API client. Authentication, prompt management, and user data are handled by the backend rather than by connecting the frontend directly to MongoDB.

## Features

### Authentication

- User registration with name, email, and password.
- Login using registered credentials.
- JWT-based authentication.
- Authenticated user state managed through a React context.
- Session restoration by retrieving the current user.
- Logout and removal of the stored authentication token.
- Error handling for authentication failures.

### Prompt Management

- Create prompts with a title and content.
- Associate prompts with tags.
- Select the AI tool associated with a prompt.
- View saved prompts on the dashboard.
- Edit existing prompts.
- Delete prompts with a confirmation dialog.
- Pin and unpin important prompts.
- Track prompt usage through the backend.

### Search, Filtering, and Organization

- Search saved prompts.
- Filter prompts by tags.
- Sort prompts by pinned status, recency, or usage.
- Navigate through paginated prompt results.
- View available tags retrieved from the backend.

### Prompt Usage

- Copy prompt content to the clipboard.
- Record prompt usage through the API.
- Display prompt metadata such as tags, selected tool, pinned status, and usage count.

### User Interface

- Responsive dashboard and authentication pages.
- Reusable UI components built with shadcn/ui.
- Tailwind CSS styling.
- Form validation and feedback for user actions.
- Confirmation dialogs for destructive actions.
- Centralized API error handling.

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework and application routing |
| React 19 | Component-based user interface |
| TypeScript | Static typing and improved maintainability |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui | Reusable interface components |
| Radix UI | Accessible UI primitives used by components |
| Axios | HTTP requests to the backend API |
| React Context | Authentication state management |
| Lucide React | Interface icons |
| ESLint | Static code and lint checks |
| Node.js and npm | Development runtime and package management |

### Backend dependencies

The client depends on a separately deployed backend that uses:

- Node.js and Express.js
- TypeScript
- MongoDB and Mongoose
- JWT authentication
- Request validation

Refer to the backend repository's README for backend installation, database configuration, and complete API documentation.

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js compatible with the project's Next.js version.
- npm.
- Git.
- Access to the PromptVault backend, either running locally or deployed.

A MongoDB connection is required by the backend, not by the client itself.

### 1. Clone the repository

```bash
git clone <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
cd PromptVault/client
```

Replace the placeholder with the actual public repository URL.

If the client is in its own repository, clone that repository and navigate to its root directory instead.

### 2. Install dependencies

```bash
npm ci
```

If the project does not contain a package-lock file, use:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the client directory. See [Environment Configuration](#environment-configuration) below.

### 4. Start the development server

```bash
npm run dev
```

Open the URL printed in the terminal, normally:

http://localhost:3000

The frontend requires a reachable backend API for signup, login, and prompt management.

## Environment Configuration

The client uses the `NEXT_PUBLIC_API_URL` environment variable to identify the backend API.

### Local development

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

This assumes the local Express backend is listening on port `5001`.

### Production

For the deployed application, configure:

```env
NEXT_PUBLIC_API_URL=https://promptvault-api-3m5s.onrender.com/api
```

Set this value in the frontend hosting provider's environment-variable settings.

### Environment variable reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the PromptVault REST API, including the `/api` prefix |

Because Next.js exposes variables prefixed with `NEXT_PUBLIC_` to browser-side code, this variable must contain only the API's public URL. Never put passwords, JWT signing secrets, or MongoDB credentials in it.

### Example environment file

The repository can include a `.env.example` file with the local default:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Copy it to `.env.local` and adjust the URL for your environment.

Do not commit `.env.local` or other files containing real credentials.

**Important:** Restart the development server after changing environment variables. For production, rebuild and redeploy the application after changing build-time public environment variables.

## Running the Application

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production build

```bash
npm run build
```

Compiles the application and checks it for production-build errors.

### Production server

After successfully building:

```bash
npm run start
```

Starts the production Next.js server. Run this command after `npm run build`.

### Linting

```bash
npm run lint
```

Runs ESLint according to the configured project script.

Check the scripts in `package.json` if the available commands change.

## Application Routes

| Route | Description | Authentication |
|---|---|---|
| `/` | Landing page with navigation to the application | Public |
| `/login` | User login | Public |
| `/signup` | User registration | Public |
| `/dashboard` | Prompt dashboard with search, filters, sorting, and pagination | Required |
| `/dashboard/new` | Create a prompt | Required |
| `/dashboard/[id]/edit` | Edit an existing prompt using its ID | Required |

The dashboard and prompt-management pages depend on successful authentication and backend connectivity.

## API Integration

The client uses the backend's REST API through the shared Axios client.

### Production API

```text
https://promptvault-api-3m5s.onrender.com/api
```

### Local API

```text
http://localhost:5001/api
```

The client uses the following API operations.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Check API health |
| `POST` | `/auth/signup` | Register a user |
| `POST` | `/auth/login` | Authenticate a user |
| `GET` | `/auth/me` | Retrieve the authenticated user |
| `GET` | `/prompts` | List prompts with search, filters, sorting, and pagination |
| `GET` | `/prompts/tags` | Retrieve available tags |
| `POST` | `/prompts` | Create a prompt |
| `GET` | `/prompts/:id` | Retrieve a prompt |
| `PUT` | `/prompts/:id` | Update a prompt |
| `PATCH` | `/prompts/:id/pin` | Toggle pin status |
| `POST` | `/prompts/:id/use` | Record prompt usage |
| `DELETE` | `/prompts/:id` | Delete a prompt |

All paths above are relative to the API base URL. Prompt-management endpoints require authentication.

For full request and response schemas, validation rules, status codes, and API examples, see the backend README.

### Search, sorting, and pagination

The prompt-list endpoint supports query parameters such as:

```text
GET /prompts?search=React&tag=frontend&sort=recent&page=1&limit=10
```

Supported sorting values:

- `pinned`
- `recent`
- `used`

The backend determines the pagination defaults and validation limits. The client should use the returned pagination metadata rather than assuming all results fit on a single page.

### Centralized API client

API requests should use the service functions in `lib/api/` rather than duplicating backend URLs in components.

The shared client:

- Uses `NEXT_PUBLIC_API_URL` as the API base URL.
- Reads the stored JWT from browser local storage.
- Adds a Bearer token to authenticated requests.
- Handles API errors centrally and exposes useful error messages to calling code.

## Authentication

PromptVault uses JWT-based authentication.

### Signup and login

When signup or login succeeds, the backend returns the authenticated user and a token. The frontend stores the token under:

```text
promptvault_token
```

The authentication context manages the user state and exposes the signup, login, logout, and current-user refresh actions.

### Session restoration

When the application initializes, the authentication provider checks whether a token exists. If it does, the client requests the current user from the backend.

If the token is missing or invalid, the application clears invalid stored authentication state and updates the user context accordingly.

### Logout

Logging out removes the stored token and clears the authenticated user from the frontend state.

Because the client uses a browser-accessible token store, the implementation should be reviewed for production security. See [Security Considerations](#security-considerations).

## Prompt Management

### Creating prompts

Users can create a prompt with:

- A title.
- Prompt content.
- Optional tags.
- An associated AI tool.

The frontend submits the prompt to the backend and updates the interface based on the response.

### Editing prompts

The edit page retrieves an existing prompt and allows its supported fields to be updated. The backend remains responsible for validation and ownership checks.

### Pinning prompts

Users can pin or unpin prompts to make important items easier to organize. The pin action uses the backend's dedicated endpoint.

### Recording usage

The client can call the usage endpoint to record that a prompt has been used. The backend maintains the usage count.

### Deleting prompts

Deleting a prompt requires confirmation in the interface. After a successful delete response, the client removes the prompt from the visible list and updates relevant dashboard state.

### Copying prompts

Prompt content can be copied to the clipboard using the browser clipboard API. Clipboard access may require a secure context and user interaction.

## Build and Quality Checks

Before submitting changes, run:

```bash
npm run lint
npm run build
```

Verify the following manually:

- Signup and login work against the configured backend.
- The dashboard loads for an authenticated user.
- Creating a prompt works.
- Editing and deleting prompts work.
- Pinning and usage tracking update correctly.
- Search, tag filtering, sorting, and pagination behave correctly.
- Copying prompt content works.
- The application handles API failures without exposing sensitive information.
- The production frontend can reach the configured backend.
- The deployed backend allows requests from the frontend's origin.

These commands are build and lint checks; they do not replace manual functional verification.

## Deployment

The client can be deployed to a Next.js-compatible hosting provider such as Vercel or Netlify.

### Deployment checklist

1. Push the client code to the public GitHub repository.
2. Import the repository into the hosting provider.
3. Configure the project root as `client` if the frontend and backend share one repository.
4. Use the Next.js framework preset where the provider offers it.
5. Configure the production environment variable:

   ```env
   NEXT_PUBLIC_API_URL=https://promptvault-api-3m5s.onrender.com/api
   ```

6. Deploy the application.
7. Confirm the production build succeeds.
8. Test signup, login, and prompt management against the deployed API.
9. Verify that the backend's CORS configuration allows the deployed frontend origin.
10. Update the project documentation with the final public URLs.

### Backend CORS configuration

The backend must allow the frontend's origin. For local development, this is commonly:

```text
http://localhost:3000
```

For production, use the actual deployed frontend origin. Configure this on the backend; changing the frontend API URL alone does not resolve CORS restrictions.

### Deployment URLs

| Resource | URL |
|---|---|
| Frontend | Add the final deployed frontend URL |
| Backend API | `https://promptvault-api-3m5s.onrender.com/api` |
| GitHub repository | Add the public repository URL |

Only publish the final frontend URL after the deployment is live and verified.

## Troubleshooting

### The frontend cannot connect to the API

- Check that `NEXT_PUBLIC_API_URL` is configured correctly.
- Ensure it includes `/api`.
- Confirm the backend is running.
- Restart the development server after changing `.env.local`.
- Check the browser's Network and Console panels for failed requests.

### CORS errors

Verify that the backend permits the frontend's exact origin, including the scheme and hostname. Local and production origins may need separate configuration.

### Login or dashboard requests return 401

- Log in again.
- Check that the token exists in browser local storage.
- Verify the `Authorization` header uses the `Bearer` scheme.
- Confirm the configured API points to the correct backend environment.

### Prompts are not appearing

- Check authentication and API connectivity.
- Clear search and tag filters.
- Confirm the selected sort order and page.
- Verify the authenticated account has saved prompts.

### Changes to environment variables have no effect

- Confirm the variable is in the client project's `.env.local`.
- Restart the development server.
- For deployment, update the hosting environment variable and trigger a new build or deployment.

### Production build fails

Run:

```bash
npm run build
```

Read the first relevant TypeScript or build error, resolve it, and rerun the build. Check that local-only environment settings and required dependencies are configured correctly.

## Security Considerations

- Never commit `.env.local` or private credentials.
- Never expose `JWT_SECRET` or `MONGO_URI` to browser-side code.
- Do not log passwords or authentication tokens.
- Use the backend to enforce authorization and prompt ownership.
- Treat browser local storage as accessible to JavaScript; an XSS vulnerability can expose stored tokens.
- Configure CORS on the backend using the intended frontend origins.
- Avoid displaying raw internal server errors or sensitive API response data to users.

## Development Workflow

### Code0 usage

Code0's terminal was used for Git and GitHub operations, including pushing and pulling repository changes.

Code0's AI-assisted features were not used because AI credits were unavailable during development. This README does not attribute implementation or debugging tasks to Code0's AI assistant.

### AI-assisted development

Where applicable, external AI assistance was used as a development aid for reviewing the frontend/API integration, examining project structure, preparing technical documentation, and planning deployment checks. Suggestions were evaluated against the existing code and project requirements rather than accepted automatically.

The final implementation and verification remain the developer's responsibility.

## Project Scope

This version provides authentication, prompt CRUD operations, tags, search, sorting, pagination, pinning, usage tracking, and clipboard copying.

**Dynamic template variables and a live-preview editor for placeholders such as `{{language}}` are not implemented in this version.** They can be added as a future enhancement without representing them as an existing capability.

---

## License

Add the applicable license information if the project is distributed under an explicit open-source license.