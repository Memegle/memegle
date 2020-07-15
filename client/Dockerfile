# https://create-react-app.dev/docs/deployment/
FROM node:lts

# set working directory
RUN mkdir /app
WORKDIR /app

# Copy package.json
COPY package.json yarn.lock /app/

RUN yarn install --production --silent
RUN yarn global add serve

# Actual build
COPY . /app
RUN yarn build