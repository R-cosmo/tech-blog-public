# Tech Blog

A full-stack blog platform built with Next.js, Prisma, and a Turbo monorepo. The project is split into:

- a public-facing blog frontend for readers
- an authenticated admin dashboard for content management
- a shared database layer and reusable project configuration

This repository is designed to support a content-driven site with filtering, markdown-based posts, admin authorisation, and database-backed data access.

## Project Goals

The application is built to provide a modern editorial workflow with a clean separation between public content and internal management tools. Core goals include:

- serving a responsive reading experience for blog visitors
- filtering blog content by category, tag, history, and search query
- supporting Markdown-based article content and rich rendering
- allowing authenticated staff to create, update, and manage article visibility
- storing post activity and user interaction data in a relational database
- keeping the codebase maintainable by using a monorepo structure and shared packages

## Design Rationale

The project uses a small but deliberate architecture to balance simplicity and maintainability:

- Next.js App Router is used for both the public site and admin interface, making route-based features and API endpoints straightforward.
- Prisma is used as the data layer to provide a typed, database-first model for posts, likes, and comments.
- Shared libraries under `packages/` centralise common concerns such as database access, environment validation, and UI helpers.
- The public site keeps read-only and viewer interactions distinct from the admin interface, which holds authenticated actions and CMS workflows.
- Server-side filtering and counts are preferred over client-only rendering to keep state and data ownership consistent with the backing database.

This design favours clarity and extensibility over over-engineering, which is appropriate for a content-focused application with manageable complexity.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS
- Turbo Repo
- Vitest and Playwright for testing

## Repository Structure

```text
.
├── apps/
│   ├── admin/            # authenticated CMS/admin panel
│   └── web/              # public blog frontend
├── packages/
│   ├── db/               # Prisma client and database seed/data helpers
│   ├── env/              # environment validation
│   ├── eslint-config/    # shared lint rules
│   ├── tailwind-config/  # Tailwind configuration
│   ├── typescript-config/# TypeScript project config
│   ├── ui/               # shared UI components
│   └── utils/            # reusable helper functions
├── tests/
│   ├── playwright/      # browser-based end-to-end tests
│   └── storybook/        # isolated component development
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
├── render.yaml
└── README.md
```

## Prerequisites

Before you begin, ensure the following are installed:

- Node.js 18 or later
- pnpm
- PostgreSQL database instance for Prisma

If you do not have `pnpm` installed, run:

```bash
npm install -g pnpm
```

If you want to use Turbo globally as well:

```bash
pnpm add -g turbo
```

## Environment Setup

1. Install workspace dependencies:

```bash
pnpm install
```

2. Create the required environment variables.

The project uses Prisma and environment validation packages. The database configuration is defined in the Prisma datasource and the shared apps env modules.

Example pattern:

```bash
cp packages/db/.env.example .env
```

Then update the values in the local environment to match your database and auth settings, including variables such as:

- `DATABASE_URL`
- `PASSWORD`
- `JWT_SECRET`

If your local setup requires app-specific `.env` files, create them next to the relevant app or package and mirror the same variable names expected by the code.

## Running the Project

From the project root:

```bash
pnpm dev
```

This starts the workspace through Turbo and launches the applications. By default, the project is configured to run as:

- public web app: http://localhost:3001
- admin app: http://localhost:3002

If you want to run a single app directly, you can use the workspace scripts in the app package manifests.

## Common Development Commands

### Install dependencies

```bash
pnpm install
```

### Start development servers

```bash
pnpm dev
```

### Build the monorepo

```bash
pnpm build
```

### Run lint checks

```bash
pnpm lint
```

### Run tests

Depending on the project configuration, tests may be run from the package roots or via Turbo tasks. Typical commands include:

```bash
pnpm --filter @repo/web test
pnpm --filter @repo/admin test
```

For browser-based verification, install Playwright browsers if needed:

```bash
cd tests/playwright
pnpx playwright install
```

## Application Overview

### Public Blog Frontend

The blog app presents content to readers and supports the following flows:

- list of active posts
- category, tag, and archive views
- search filtering
- post detail pages with markdown rendering
- like and comment workflows
- theme toggling

This app is designed around readable, content-first interfaces and server-backed data queries.

### Admin Dashboard

The admin app is a protected CMS for content management. It provides:

- sign-in with a server-side password validation flow
- JWT-based session handling
- authenticated access to post management screens
- creation and editing of blog posts
- visibility toggling for active/inactive posts
- validation for core content fields such as title, description, and image URL

The admin experience is intentionally constrained by authentication checks, ensuring that only approved users can change content.

## API and Route Reference

The project exposes a lightweight API layer through the Next.js app routes.

### Public app routes

- `GET /api/posts` — returns visible post data for the blog
- `GET /api/posts/:id` — fetches a single active post
- `POST /api/likes` — creates a like for a client IP
- `DELETE /api/likes` — removes a like for a client IP
- `GET /api/likes?postId=<id>` — returns whether the current client has liked the post and the total like count
- `GET /api/comments` or related comment endpoints — fetches post comments
- `POST /api/comments` — adds a comment or reply
- `GET /api/posts/:id/views` — records or updates post view count

### Admin app routes

- `POST /api/auth` — validates password and signs the admin in
- `DELETE /api/auth` — signs the admin out
- `GET /api/posts` — returns admin post data, including active and inactive content
- `POST /api/posts` — creates a new post
- `PATCH /api/posts/:id` or equivalent update route — updates a post
- `DELETE /api/posts/:id` — removes a post if supported
- `PATCH /api/posts/:id/toggle` — toggles active/inactive status

The API design keeps route responsibilities aligned with the business behavior: public routes serve reader-facing interactions, and admin routes handle authenticated content management.

## Data Model

The core database schema centers on blog content and interaction tracking:

- `Post` — blog article content and metadata
- `Like` — record of a user IP liking a specific post
- `Comment` — threaded comment support for posts

Important schema decisions:

- `Like` entries are unique per `postId + userIP` to prevent duplicate likes from the same client.
- `Post.active` controls whether content is publicly visible.
- `Post.tags` are stored as a comma-separated value in the application schema, which keeps the data model simple for this project scope.

## Feature Notes

- Markdown is rendered on the content detail pages to support rich article formatting.
- Post filtering is done at the data/service layer so clients receive only relevant records.
- View counting is treated as user interaction tracking, enabling analytics-style behaviour without bloating the UI.
- Authentication is server-side and cookie-backed to avoid exposing credentials in client state.

## Testing Strategy

The repository includes automated test tooling for multiple layers:

- unit and component tests via Vitest
- end-to-end browser validation via Playwright
- storybook for isolated UI exploration

If needed, run the relevant suites from the package or workspace level. This project is designed so that both behavioural checks and UI validation can be executed without leaving the monorepo.

## Contribution Notes

When working in this repository:

- keep shared code in the package layer rather than duplicating it across apps
- prefer typed, server-side validation for data-heavy behaviour
- respect the existing auth boundaries between public and admin areas
- keep routes and UI consistent with the domain model defined in Prisma

## Summary

This project combines a content-driven frontend, authenticated content tooling, and a structured data layer into a single monorepo workflow. Its architecture is intentionally straightforward and production-lean: Next.js handles application routing and rendering, Prisma manages persistence and schemes, and a shared monorepo keeps the system easier to extend over time.

For local development, follow the environment setup and run commands above, then open the public site or admin dashboard in the browser to begin working with the application.

