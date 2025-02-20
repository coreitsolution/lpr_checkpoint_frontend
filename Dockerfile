# Use Node.js for building the application
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (only production dependencies to keep image small)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Use a lightweight web server (nginx) to serve the built files
FROM nginx:alpine

# Set working directory inside Nginx container
WORKDIR /usr/share/nginx/html

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (default for nginx)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
