# WEPIECES

## Getting Started

### About

WEPIECES is a highly inspired application starter kit based on
[create-t3-app](https://create.t3.gg/). It’s 100% production ready and built
with technologies like Bun, Hono, Docker, React, Tanstack, tRPC, Drizzle, Jotai,
Zod, Tailwind, Jose, and more. The goal of this project is to provide a modern
web application framework that doesn't require features like server-side
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

- Bun 1.2.x or higher
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

3. Create a `.env` file based on the `.env.development` file:

```bash
cp .env.development .env
```

4. Start the development server:

```bash
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

Since the database ports should not be exposed in docker-compose, this will
require some manual steps. Currently, you need to expose the port`s and remove
them after the migration in the docker-compose configuration.

```
bun run migrate
```

3. Open your browser and navigate to `http://localhost`.

## Contributing

Contributions are welcome!
