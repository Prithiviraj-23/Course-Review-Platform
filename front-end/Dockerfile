# Stage 1: Build the React application (Vite)
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the React app using Vite
RUN npm run build

# Check if dist folder exists (for debugging)
RUN ls -la /app/dist  # This will help debug if dist was created

# Stage 2: Serve the build with Nginx
FROM nginx:alpine

# Remove the default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the Vite build output (dist) to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
