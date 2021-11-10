FROM node:15.12

WORKDIR /home/node/app

COPY . .

RUN npm i .

CMD ["node", "index.js"]
