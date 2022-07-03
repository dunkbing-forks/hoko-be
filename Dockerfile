FROM node:16
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
COPY ["package.json", "pnpm-lock.yaml", "npm-shrinkwrap.json*", "./"]
RUN pnpm install --frozen-lockfile --prod
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
