FROM node:20 AS build-stage

#RUN apt-get update && apt-get install -y xsel xclip

WORKDIR /usr/src/app

COPY . .

ENV VITE_BACKEND_URL=http://localhost:8080/api

RUN npm ci
RUN npm run build

# test stage
FROM build-stage AS test-stage

RUN npm run test

# serve stage
FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80