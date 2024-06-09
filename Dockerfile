FROM node:16-alpine
WORKDIR /app
COPY . .
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
RUN yarn install && yarn build
EXPOSE 3000
CMD ["yarn", "start"]
