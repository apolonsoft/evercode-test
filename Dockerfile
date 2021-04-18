FROM node:12.21.0

RUN mkdir /evercode

WORKDIR /

COPY package*.json ./

RUN npm i

COPY . .

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
