#!/bin/bash

echo "🎮 Setting up 'Do You Remember?' - Nostalgic Social Platform 📼"
echo "=================================================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb/brew/mongodb-community"
    echo "   OR"
    echo "   mongod --config /usr/local/etc/mongod.conf"
    exit 1
fi

echo "✅ MongoDB is running"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating environment variables..."
    cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017/time-capsule-social
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
EOF
    echo "✅ Created .env.local"
fi

# Seed the database
echo "🌱 Seeding database with nostalgic data..."
npm run seed

echo ""
echo "🚀 Starting the development server..."
echo "   The app will be available at: http://localhost:3000"
echo ""
echo "📋 Demo login credentials:"
echo "   Email: demo@example.com | Password: demo123"
echo "   Email: nostalgia@example.com | Password: 90skid"
echo ""

# Start the development server
npm run dev
