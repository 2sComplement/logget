FROM node:16


WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

COPY package.json .
COPY yarn.lock .
RUN yarn install --production
CMD [ "yarn", "start" ]