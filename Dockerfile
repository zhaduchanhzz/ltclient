
FROM node:22-alpine AS builder

LABEL maintainer="ZenoByte"

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn config set network-timeout 60000
RUN yarn config set fetch-retries 5
RUN yarn --frozen-lockfile
RUN yarn cache clean

COPY . .

RUN yarn build

FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]

