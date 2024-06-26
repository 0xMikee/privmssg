# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.6
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Remix/Prisma"

# Remix/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install necessary packages
RUN apt-get update && apt-get install -y openssl sqlite3 curl

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential openssl pkg-config python-is-python3

# Install node modules
COPY --link .npmrc bun.lockb package.json ./
RUN bun install

# Generate Prisma Client
COPY --link prisma .
RUN bunx prisma generate

# Copy application code
COPY --link . .

# Build application
RUN bun --bun run build

# Remove development dependencies
RUN rm -rf node_modules && \
    bun install --ci


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl sqlite3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

# Entrypoint prepares the database.
ENTRYPOINT [ "/app/docker-entrypoint.js" ]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENV DATABASE_URL="file:/data/sqlite.db"
CMD [ "bun", "run", "start" ]
