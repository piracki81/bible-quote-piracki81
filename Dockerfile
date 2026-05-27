# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create .env file from build args
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
RUN echo "VITE_SUPABASE_URL=${VITE_SUPABASE_URL}" > .env && \
    echo "VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}" >> .env

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create startup script that injects env vars at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-inject-env.sh && \
    echo 'cat > /usr/share/nginx/html/env-config.js << ENVEOF' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo 'window.__ENV__ = {' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  VITE_SUPABASE_URL: "'\$VITE_SUPABASE_URL'",' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '  VITE_SUPABASE_ANON_KEY: "'\$VITE_SUPABASE_ANON_KEY'"' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo '};' >> /docker-entrypoint.d/40-inject-env.sh && \
    echo 'ENVEOF' >> /docker-entrypoint.d/40-inject-env.sh && \
    chmod +x /docker-entrypoint.d/40-inject-env.sh

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
