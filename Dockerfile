
FROM node:22.12.0-alpine3.21 AS builder

LABEL maintainer="Duong Cong Chien"

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn config set network-timeout 60000
RUN yarn config set fetch-retries 5
RUN yarn --frozen-lockfile
RUN yarn cache clean

COPY . .

RUN yarn build

FROM node:22.12.0-alpine3.21 AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]

