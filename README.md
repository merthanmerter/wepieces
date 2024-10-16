# WEPIECES

## Getting Started

### About

WEPIECES is a highly inspired application starter kit based on
[create-t3-app](https://create.t3.gg/). It’s 100% production ready and built
with technologies like Bun, Hono, Træfik, Redis, Docker, React, tRPC, Drizzle,
Jotai, Zod, Tailwind, Jose, and more. The goal of this project is to provide a
modern web application framework that doesn't require features like server-side
rendering (SSR) or search engine optimization (SEO). It’s an ideal choice for
fast and simple deployment using Docker or even Bun executables, requiring
little to no configuration.

### Features

- 🔥 Full-stack development with Hono, tRPC and React.
- 📦 Modular architecture with a separation of concerns
- 🔐 Authentication with Jose
- 🐘 PostgreSQL database with Drizzle
- 🐋 100% Production Ready with Docker
- 🚢 Ready to deploy to any VPS or Cloud provider

### Technologies

- Bun
- Hono
- tRPC
- Træfik
- Redis
- Docker
- React
- Vite
- Tanstack
- Jotai
- Drizzle
- PostgreSQL
- Zod
- Jose
- Tailwind
- ShadcnUI

### Roadmap

- CLI integration for better project scaffolding and DX.
- Improve authentication and authorization. Add ~~database sessions~~ and
  permissions.
- Integrate image uploads and storage management. Image optimization and
  compression with sharp.

### Prerequisites

- Bun 1.x or higher
- Docker

### Installation

1. Clone the repository:

```bash
git clone https://github.com/wepieces/wepieces.git
```

2. Install dependencies:

```bash
cd wepieces
bun install
```

3. Create a `.env` file based on the `.env.example` file:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
bun run docker:dev
bun run dev
```

5. Open your browser and navigate to `http://localhost:4000`.

## Deployment

To deploy the application to a production environment, follow these steps:

1. Build the application for production:

```bash
bun run build
```

2. Migrate the database:

~~This may require some manual steps as database ports will not be exposed. You
might need to expose the ports and remove them after the migration in the
docker-compose configuration.~~

Migrations will be run automatically when the server starts. This is a more
convenient way to run migrations as database ports will not be exposed.

3. Open your browser and navigate to `http://localhost`.

## Contributing

Contributions are welcome!
