# -------------------------------------------------------------------- STAGE 1: Builder --------------------------------------------------------------------

# Use the official Node.js image for building
FROM node:22 AS builder

# Set working directory inside container
WORKDIR /usr/src/app

# Copy only package files first (better caching)
COPY package*.json ./

# Install dependencies using npm ci (deterministic, faster)
# Includes devDependencies so we can build if needed
RUN npm ci

# Copy the rest of the application code
COPY . .

# -------------------------------------------------------------------- STAGE 2: Runtime --------------------------------------------------------------------

# Use slim Node.js image for smaller production image
FROM node:22-slim AS runtime

# Install system dependencies required for Chromium/Puppeteer + Ghostscript
RUN apt-get update && apt-get install -y \
    ghostscript \
    chromium \
    libnss3 \
    libatk-bridge2.0-0 \
    libgbm1 \
    libasound2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libpango-1.0-0 \
    libcups2 \
    libatk1.0-0 \
    libgtk-3-0 \
    libatspi2.0-0 \
    libxinerama1 \
    libpangoft2-1.0-0 \
    fonts-liberation \
    gconf-service \
    libappindicator1 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory for runtime
WORKDIR /usr/src/app

# Copy only built app and installed modules from builder stage
COPY  --from=builder /usr/src/app ./

# Set environment variables for Puppeteer and Node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
ENV NODE_ENV=production

# Expose application port
EXPOSE 3000

# Default entrypoint and command (can be overridden if needed)
ENTRYPOINT ["npm", "run"]
CMD ["start"]