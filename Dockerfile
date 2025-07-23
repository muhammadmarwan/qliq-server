FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build  # ✅ COMPILE TS -> JS

EXPOSE 8000

CMD ["npm", "start"]  # ✅ this runs: node dist/app.js
