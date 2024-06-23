# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.1.15
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Remix/Prisma"

WORKDIR /app

ENV NODE_ENV="production"

# Install build dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential openssl pkg-config python-is-python3 nodejs && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install app dependencies
COPY bun.lockb package.json ./
RUN bun install || (cat bun-error.log && exit 1)

# Prisma setup
COPY prisma ./
RUN bunx prisma generate

# Copy application files
COPY . .

# Build the application
RUN bun run build

# Remove development dependencies and reinstall for production
RUN rm -rf node_modules && \
    bun install --ci

FROM base

# Install runtime dependencies
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl sqlite3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application from build stage
COPY --from=build /app /app

# Ensure data directory exists
RUN mkdir -p /data
VOLUME /data

# Add a shortcut for database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

# Ensure the entrypoint script is executable
RUN chmod +x /app/docker-entrypoint.js
RUN chmod -R +x /app

# Set the entry point and command
ENTRYPOINT ["/app/docker-entrypoint.js"]
CMD ["bun", "run", "start"]

EXPOSE 3000

# Set environment variable for the database
ENV DATABASE_URL="file:///data/sqlite.db"
