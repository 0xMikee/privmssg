# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.1.15
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Remix/Prisma"

WORKDIR /app

ENV NODE_ENV="production"

FROM base as build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential openssl pkg-config python-is-python3 nodejs && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

COPY bun.lockb package.json ./
RUN bun install

COPY prisma ./
RUN bunx prisma generate

COPY . .

RUN bun run build

RUN rm -rf node_modules && \
    bun install --ci

FROM base

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl sqlite3 && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

COPY --from=build /app /app

RUN mkdir -p /data
VOLUME /data

RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

RUN chmod +x /app/docker-entrypoint.js
RUN chmod -R +x /app

ENTRYPOINT ["/app/docker-entrypoint.js"]
CMD ["bun", "run", "start"]

EXPOSE 3000

ENV DATABASE_URL="file:///data/sqlite.db"
