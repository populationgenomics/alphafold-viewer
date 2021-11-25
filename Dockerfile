# Stage 1: build the website
FROM node:16-buster-slim as builder

ENV NODE_ENV=production
WORKDIR /usr/src/app

ADD package.json package-lock.json .

# Install dependencies
RUN npm install

COPY public public
COPY src src
COPY tsconfig.json .
RUN npm run build

# separate docker stage to host the files
# doing it this way saves many layers

FROM builder as src
FROM httpd:2.4-alpine

ENV PORT 80

# listen on the PORT cloud run asks us to
RUN echo 'Listen ${PORT}' >> /usr/local/apache2/conf/httpd.conf

# Copy the static website!
COPY --from=src /usr/src/app/build/ /usr/local/apache2/htdocs/
