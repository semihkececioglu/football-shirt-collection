FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Use npm install instead of npm ci to avoid sync issues
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
