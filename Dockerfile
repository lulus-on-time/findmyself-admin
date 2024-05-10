FROM node:20.11.0 

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

ENV NODE_ENV=production

RUN npm run build

RUN npm i --omit=dev


LABEL name="lulus on time"
LABEL version="1.0.0"

CMD [ "npm", "run", "start-gcp"]

EXPOSE 80