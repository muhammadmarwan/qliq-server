FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# ⚠️ COMPILE TypeScript -> JavaScript
RUN npm run build

# App runs on port 8000
EXPOSE 8000

# Run the compiled JS file
CMD ["npm", "start"]
