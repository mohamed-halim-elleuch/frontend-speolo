FROM node:21.1.0

WORKDIR /app

COPY package.json .

COPY . .

RUN yarn install

RUN yarn run build


EXPOSE 3000

CMD ["npm","start"]

