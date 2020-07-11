# https://create-react-app.dev/docs/deployment/
FROM node:lts

# set working directory
RUN mkdir /app
WORKDIR /app

# Copy package.json
COPY package.json package-lock.json yarn.lock /app/

RUN npm install --production --silent
RUN npm install -g serve

# Actual build
COPY . /app
RUN npm run build