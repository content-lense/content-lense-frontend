ARG NODE_VERSION=18

# "common" stage
FROM node:${NODE_VERSION}-alpine AS deps


WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

COPY . ./

# -------------------------

FROM deps AS dev

EXPOSE 3000

CMD ["pnpm", "dev"]

# -------------------------

FROM deps as build

ENV NODE_ENV production

RUN set -eux; \
    pnpm build

# -------------------------

FROM node:${NODE_VERSION}-alpine as prod

WORKDIR /app


COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
