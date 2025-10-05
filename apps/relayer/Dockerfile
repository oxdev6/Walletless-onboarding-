FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.12.1 --activate && pnpm install --frozen-lockfile
COPY tsconfig.json ./tsconfig.json
COPY src ./src
ENV PORT=8787
EXPOSE 8787
CMD ["pnpm", "start"]

