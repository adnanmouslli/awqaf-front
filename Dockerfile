FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p /app/public/uploads

# Expose port 3000
EXPOSE 3000

# Start development server
CMD ["npm", "start"]