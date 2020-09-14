FROM node:14.10.1-alpine

ENV PORT 8000

WORKDIR /app

COPY package* ./

RUN npm i

COPY . .

CMD ["npm", "start"]