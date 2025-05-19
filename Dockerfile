# Use the latest LTS version of Node.js (currently Node 20)
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose the app port
EXPOSE 8000

# Start the application
CMD ["node", "server.js"]