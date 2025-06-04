FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

COPY --from=builder /app/entrypoint.sh .

RUN chmod +x entrypoint.sh

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000

CMD ["sh", "./entrypoint.sh"]
