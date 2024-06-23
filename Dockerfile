# Base Bun image
ARG BUN_VERSION=1.1.15
FROM oven/bun:${BUN_VERSION}-slim as base

# Set for base and all layers that inherit from it
ENV NODE_ENV=production

# Install necessary packages
RUN apt-get update && apt-get install -y openssl sqlite3

# Install all dependencies including dev dependencies
FROM base as deps

WORKDIR /myapp

# Copy necessary files for dependency installation
ADD bun.lockb package.json .npmrc ./
# Install dependencies using Bun
RUN bun install --all

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

# Copy node_modules from deps stage
COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD bun.lockb package.json .npmrc ./
# Prune dev dependencies
RUN bun install --production

# Build the app
FROM base as build

WORKDIR /myapp

# Copy node_modules from deps stage
COPY --from=deps /myapp/node_modules /myapp/node_modules

# Copy Prisma files and generate client
ADD prisma .
RUN bunx prisma generate

# Copy the rest of the application and build
ADD . .
RUN bun build

# Final stage for production
FROM base

# Environment variables for production
ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="3000"
ENV NODE_ENV="production"

# Add a shortcut for connecting to the database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp

# Copy node_modules and built files from previous stages
COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh
COPY --from=build /myapp/prisma /myapp/prisma

# Set entrypoint to start the application
ENTRYPOINT ["./start.sh"]
