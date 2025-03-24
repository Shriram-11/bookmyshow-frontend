# Step 1: Build Stage
FROM node:18 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files and build Angular app
COPY . .
RUN npm run build --prod

# Step 2: Production Image
FROM nginx:latest

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app to Nginx's HTML folder
COPY --from=build /app/dist/bookmyshow-frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
