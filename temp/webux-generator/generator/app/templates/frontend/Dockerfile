# Compile the frontend react app
FROM node:latest AS frontendbuilder

WORKDIR /home/node/app
COPY ./web/package.json .

## Need the development tools too.
RUN npm install
RUN npm install -g @vue/cli

COPY ./web .

# In production the .env.production will apply and the console.log will be removed.
ENV NODE_ENV=production

RUN npm run build

# Create the frontend container with Nginx
FROM nginx:stable-alpine

# To do health check
RUN apk add --update netcat-openbsd && rm -rf /var/cache/apk/*

COPY --from=frontendbuilder /home/node/app/dist /var/www
COPY ./nginx/nginx.conf /etc/nginx/conf.d/backend.conf
COPY ./nginx/certs/* /etc/nginx/certs/

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]