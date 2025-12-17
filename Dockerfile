# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (use 10000 or whatever Render assigns)
EXPOSE 10000

# Start the app
CMD ["node", "server.js"]