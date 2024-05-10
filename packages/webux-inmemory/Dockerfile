# 2024-05-09: the goal of this Dockerfile is to test the cluster implementation.
FROM node:20

COPY ./src /src
COPY ./examples /examples
COPY package.json /
COPY package-lock.json /

RUN npm ci

CMD ["node", "/examples/cluster.js"]