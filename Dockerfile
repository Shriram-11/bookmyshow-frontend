# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Final stage
FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/bookmyshow-frontend/browser /usr/share/nginx/html
COPY entrypoint.sh /usr/share/nginx/
RUN chmod +x /usr/share/nginx/entrypoint.sh
EXPOSE 80
CMD ["/usr/share/nginx/entrypoint.sh"]
