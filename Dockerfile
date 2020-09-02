# First step: build the UI
FROM node:lts-alpine AS build-ui

WORKDIR /ui

ADD ui/package.json ui/package-lock.json ./
# Skip Cypress binary installation
ENV CYPRESS_INSTALL_BINARY=0
ENV NODE_ENV=
ENV VUE_APP_API_URL=/
RUN npm ci --unsafe-perm

ADD ui ./

# build frontend
ENV NODE_ENV=production
RUN npm run build

# Second step: build the API project
FROM node:13-alpine AS build-api

WORKDIR /
ADD api ./api/
ADD packages/rdfine-csvw ./packages/rdfine-csvw/
ADD packages/rdfine-data-cube ./packages/rdfine-data-cube/
ADD lerna.json .
ADD package*.json ./
# install and build backend
ENV NODE_ENV=
RUN npm ci --unsafe-perm
ENV NODE_ENV=production
RUN npm run build

# Third step: only install runtime dependencies in final image
FROM node:13-alpine

WORKDIR /app

RUN npm i -g nodemon ts-node typescript lerna

COPY --from=build-api /lerna.json ./lerna.json
COPY --from=build-api /package*.json ./
COPY --from=build-api /api/package*.json ./api/
COPY --from=build-api /packages/rdfine-csvw/package*.json ./packages/rdfine-csvw/
COPY --from=build-api /packages/rdfine-data-cube/package*.json ./packages/rdfine-data-cube/
RUN lerna bootstrap -- --only=production

# Copy the built assets from the first step
COPY --from=build-api /api/dist ./api/
COPY --from=build-api /packages/rdfine-csvw/dist ./packages/rdfine-csvw/
COPY --from=build-api /packages/rdfine-data-cube/dist ./packages/rdfine-data-cube/
COPY --from=build-ui /ui/dist ./ui

ENV HOST 0.0.0.0

# USER nobody:nobody

ENTRYPOINT []

ENV PORT=8080
EXPOSE $PORT

WORKDIR /app/api

CMD ["node", "index.js"]
HEALTHCHECK CMD wget -q -O- http://localhost:8080/
