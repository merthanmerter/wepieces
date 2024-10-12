# Stage 1: Install dependencies for the entire monorepo
FROM oven/bun:latest AS dependencies

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies for the entire workspace using Bun
RUN bun install

# Stage 2: Build the client
FROM dependencies AS client-build

WORKDIR /app/apps/client

# Build the client
RUN bun run build

# Stage 3: Build the server
FROM dependencies AS server-build

WORKDIR /app/apps/server

# Build the server binary
RUN bun build --compile --target=bun-linux-x64 ./index.ts --outfile server

# Stage 4: Final runtime stage
FROM oven/bun:latest AS runtime

WORKDIR /app

# Copy the client `dist` folder from the client build stage
COPY --from=client-build /app/apps/client/dist ./dist

# Copy the built server binary from the server build stage
COPY --from=server-build /app/apps/server/server ./server

# Expose the port for the server
EXPOSE 5000

# Run the compiled server binary
CMD ["./server"]
