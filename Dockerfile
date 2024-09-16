ARG NODE_VERSION=20.11.0

# Stage 1: Base setup
# Use the official Node.js image
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Stage 2: Production setup
FROM base AS production

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Default command for production
CMD ["node", "src/server.js"]

# Stage 3: Development setup
FROM base AS development

# Install all dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Command for development (runs nodemon)
CMD ["nodemon", "-L", "src/server.js"]