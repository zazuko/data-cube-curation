# First step: build the assets
FROM node:lts-alpine AS builder

WORKDIR /
ADD packages/cli ./packages/cli/
ADD packages/rdfine-csvw ./packages/rdfine-csvw/
ADD packages/rdfine-data-cube ./packages/rdfine-data-cube/
ADD lerna.json .
ADD package*.json ./
# install and build backend
ENV NODE_ENV=
RUN npm ci --unsafe-perm
ENV NODE_ENV=production
RUN npm run build

# Second step: only install runtime dependencies
FROM node:lts-alpine

WORKDIR /app

RUN npm i -g lerna

COPY --from=builder /lerna.json ./lerna.json
COPY --from=builder /package*.json ./
COPY --from=builder /packages/cli/package*.json ./packages/cli/
COPY --from=builder /packages/rdfine-csvw/package*.json ./packages/rdfine-csvw/
COPY --from=builder /packages/rdfine-data-cube/package*.json ./packages/rdfine-data-cube/
RUN lerna bootstrap -- --only=production

# Copy the built assets from the first step
COPY --from=builder /packages/cli/dist ./packages/cli/
COPY --from=builder /packages/rdfine-csvw/dist ./packages/rdfine-csvw/
COPY --from=builder /packages/rdfine-data-cube/dist ./packages/rdfine-data-cube/
COPY packages/cli/pipelines ./packages/cli/pipelines/

# USER nobody:nobody

ENTRYPOINT ["node", "packages/cli/index.js", "run", "/input", "/output"]
