FROM node:22-alpine AS build
WORKDIR /app
# Railway entrega estas variables al build solo si se declaran como ARG.
# Se usan en las páginas prerenderizadas (canonical, hreflang, Analytics) y en
# la lista de dominios de confianza del proxy.
ARG PUBLIC_SITE_URL
ARG PUBLIC_GA4_ID
ARG RAILWAY_PUBLIC_DOMAIN
ARG ALLOWED_HOSTS
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/scripts/migrate.mjs ./scripts/migrate.mjs
EXPOSE 8080
CMD ["npm", "start"]
