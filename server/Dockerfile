FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install sequelize-cli globally
RUN npm install -g sequelize-cli

# Copy app files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3001

# Start command (migrations run via docker-compose)
CMD ["npm", "start"]