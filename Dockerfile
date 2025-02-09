# Stage 1: Install dependencies for the entire workspace using Bun
FROM oven/bun:latest AS base
WORKDIR /usr/src/app
COPY . .
RUN bun install
# Stage 2: Build the client
FROM base AS client-build
WORKDIR /usr/src/app/apps/client
RUN bun run build

# Stage 3: Build the server
FROM base AS server-build
WORKDIR /usr/src/app/apps/server
RUN bun build --compile --target=bun ./index.ts --outfile server --minify

# Stage 4: Final runtime stage
FROM base as release
WORKDIR /usr/src/app
COPY --from=client-build /usr/src/app/apps/client/dist ./dist
COPY ./drizzle ./drizzle
COPY --from=server-build /usr/src/app/apps/server/server ./server

ENV NODE_ENV=production
USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["./server"]