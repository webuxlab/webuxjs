# Install the node modules
FROM node:latest AS backendbuilder

WORKDIR /usr/src/app
COPY ./package.json .

RUN npm install --omit=dev




# create the container to host the backend.
FROM node:20.12.2

WORKDIR /usr/src/app

COPY --from=backendbuilder /usr/src/app/node_modules ./node_modules
COPY . .

VOLUME [ "/usr/src/app/log" ]
VOLUME [ "/usr/src/app/defaults" ]
VOLUME [ "/usr/src/app/uploads" ]
VOLUME [ "/usr/src/app/locales" ]

EXPOSE 1337
CMD [ "npm", "start" ]

