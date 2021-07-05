FROM node:erbium-alpine3.12

RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser --disabled-password app
COPY ./ .
RUN chown -R app:app /opt/app
USER app
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
