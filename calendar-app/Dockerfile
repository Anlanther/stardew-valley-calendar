FROM node:20-alpine
COPY . .
RUN npm install -g @angular/cli
RUN npm i
EXPOSE 4200
CMD ["ng", "serve", "--host 0.0.0.0"]
