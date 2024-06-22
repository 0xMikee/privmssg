# Base image with Bun
ARG BUN_VERSION=1.1.15
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Remix/Prisma"

# Set environment variables
ENV NODE_ENV="production"

# Install necessary runtime packages for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3

# Install dependencies, including development dependencies
FROM base as deps

WORKDIR /myapp

COPY bun.lockb package.json ./
RUN bun install

# Setup production dependencies
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY package.json ./
RUN bun install --production

# Build the application
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY prisma ./
RUN bunx prisma generate

COPY . .
RUN bun run build

# Create the final production image
FROM base

ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="3000"
ENV NODE_ENV="production"

# Add a shortcut for the database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma
COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh
COPY --from=build /myapp/prisma /myapp/prisma

# Ensure the entrypoint script is executable
RUN chmod +x /myapp/start.sh

# Use the start script as the entry point
ENTRYPOINT ["./start.sh"]
