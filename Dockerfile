# First step: build the assets
FROM node:lts-alpine AS builder

# https://stackoverflow.com/questions/18136746/npm-install-failed-with-cannot-run-in-wd
RUN npm set unsafe-perm true

WORKDIR /ui

ADD ui/package.json ui/package-lock.json ./
# Skip Cypress binary installation
ENV CYPRESS_INSTALL_BINARY=0
ENV NODE_ENV=
RUN npm ci

ADD ui ./
ENV VUE_APP_API_URL=https://datacube.zazukoians.org/

# build frontend
ENV NODE_ENV=production
RUN npm run build

WORKDIR /api
ADD api ./
# install and build backend
ENV NODE_ENV=
RUN npm ci
ENV NODE_ENV=production
RUN npm run build

# Second step: only install runtime dependencies
FROM node:lts-alpine

WORKDIR /api

RUN npm i -g nodemon ts-node typescript

COPY --from=builder /api/package.json ./package.json
COPY --from=builder /api/package-lock.json ./package-lock.json
RUN npm ci --only=production

# Copy the built assets from the first step
COPY --from=builder /api/dist ./
COPY --from=builder /ui/dist ./ui

ENV HOST 0.0.0.0

# USER nobody:nobody

ENTRYPOINT []

ENV PORT=8080
EXPOSE $PORT

CMD ["node", "index.js"]
HEALTHCHECK CMD wget -q -O- http://localhost:8080/
