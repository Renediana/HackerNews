FROM node:14.15-alpine as node

WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g @angular/cli@latest
RUN ng build --prod


FROM nginx:1.19.3-alpine

COPY --from=node app/nginx.conf /etc/nginx/nginx.conf
COPY --from=node app/dist/HackerNews /usr/share/nginx/html
