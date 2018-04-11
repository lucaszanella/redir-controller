FROM node:latest

RUN npm install -g express body-parser

WORKDIR /home

CMD node redir.js
