# Multi-stage build: optimize production image size and build time

# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies (required for better-sqlite3 native compilation)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY drizzle.config.ts ./

# Install dependencies (including better-sqlite3, will compile here)
RUN npm ci

# Copy source code
COPY src ./src
COPY server ./server
COPY public ./public
COPY index.html ./

# Build frontend (React + Vite)
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache tini

# Create data directory for SQLite persistence
RUN mkdir -p /app/data /app/backups && chmod 755 /app/data /app/backups

# Copy package files
COPY package*.json ./

# Install production dependencies only (no dev dependencies)
RUN npm ci --omit=dev

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# Copy public assets
COPY --from=builder /app/public ./public

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use tini as init process for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Expose port
EXPOSE 3000

# Environment defaults
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/data/mp-manager.db
ENV PORT=3000

# Start server
CMD ["node", "dist/server/index.js"]
