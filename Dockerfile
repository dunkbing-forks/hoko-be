FROM node:16.15.0
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../ && npm install -g @nestjs/cli && npm install source-map-support
COPY . .
EXPOSE 3001
RUN cp .env.example .env
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
