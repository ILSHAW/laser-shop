FROM node:18-alpine

ENV TZ Europe/Moscow

WORKDIR /usr/src/app/

COPY *.json ./

RUN yarn install

COPY ./ ./

RUN yarn build

USER root

CMD [ "yarn", "start" ]