# ---- base ----
FROM alpine AS base

RUN apk add --no-cache nodejs npm tini
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENTRYPOINT ["/sbin/tini", "--"]
COPY package.json /usr/src/app

# ---- Dependencies ----
FROM base as dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
RUN cp -R node_modules prod_node_modules
RUN npm install

# ---- Test ----
FROM dependencies AS test
COPY . /usr/src/app
RUN npm run build

# ---- Release ----
FROM base AS release
COPY --from=dependencies /usr/src/app/prod_node_modules /usr/src/app/node_modules
COPY . /usr/src/app
EXPOSE 3000
CMD npm run start