# Use Alpine-based Node.js image to reduce size
FROM node:20.9.0-alpine

# Add tini for proper signal handling
RUN apk add --no-cache tini

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm@9.15.1

# Copy package files first to leverage layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the application
RUN pnpm run build

EXPOSE 3000

# Use tini as entrypoint
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main"]
