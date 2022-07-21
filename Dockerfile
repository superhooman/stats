FROM node:16-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY . /app

RUN npm ci

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]