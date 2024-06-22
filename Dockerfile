# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.15
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Remix/Prisma"

# Working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential openssl pkg-config python-is-python3 nodejs && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Install node modules
COPY bun.lockb package.json ./
RUN bun install

# Generate Prisma Client
COPY prisma ./
RUN bunx prisma generate

# Copy application code
COPY . .

# Build application
RUN bun run build

# Remove development dependencies and install only production dependencies
RUN rm -rf node_modules && \
    bun install --ci

# Final stage for the application image
FROM base

# Install runtime packages
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl sqlite3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Ensure /data directory exists and is used for volume
RUN mkdir -p /data
VOLUME /data

# Add a shortcut for the database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

# Ensure the entrypoint script is executable
RUN chmod +x /app/docker-entrypoint.js

# Set the entry point and command
ENTRYPOINT ["/app/docker-entrypoint.js"]
CMD ["bun", "run", "start"]

# Expose the application port
EXPOSE 3000

# Set environment variables for the application
ENV DATABASE_URL="file:///data/sqlite.db"
