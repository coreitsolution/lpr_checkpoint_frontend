# Use the Node.js image for building the application
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Use a lightweight web server (nginx) to serve the built files
FROM nginx:alpine

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default for nginx)
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
