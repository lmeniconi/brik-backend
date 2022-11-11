FROM node:16-alpine

RUN apk add --no-cache chromium

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

WORKDIR /app/build
RUN npm ci --production

CMD npm run start