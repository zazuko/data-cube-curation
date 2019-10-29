FROM node:12-alpine AS builder

WORKDIR /src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Skip Cypress binary installation
ENV CYPRESS_INSTALL_BINARY=0
RUN npm ci

# Bundle app source
COPY ./ ./

ENV VUE_APP_API_URL=https://api.datacube.zazukoians.org/
RUN npm run build

FROM nginx

COPY --from=builder /src/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
