#!/bin/bash

# Express TypeScript Backend Setup Script

echo "🚀 Setting up Express TypeScript Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "🔧 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration!"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Build the project
echo "🏗️  Building the project..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your MongoDB connection string and JWT secret"
echo "2. Run 'npm run db:push' to sync your database schema"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📚 API Documentation: Check README.md for API endpoints"
echo "🔧 Database Studio: Run 'npm run db:studio' to view your database"
