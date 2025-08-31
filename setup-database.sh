#!/bin/bash

echo "🎮 Setting up MongoDB for Time Capsule Social Platform 📼"
echo "=========================================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating .env.local file from template..."
    
    if [ -f "env-local-template.txt" ]; then
        cp env-local-template.txt .env.local
        echo "✅ Created .env.local from template"
        echo ""
        echo "📝 IMPORTANT: Please edit .env.local and update:"
        echo "   1. MONGODB_URI - your database connection string"
        echo "   2. JWT_SECRET - a secure random string"
        echo "   3. NEXTAUTH_SECRET - another secure random string"
        echo ""
        echo "🔧 For MongoDB setup options, see: MONGODB_SETUP.md"
        echo ""
    else
        echo "❌ Template file not found. Creating basic .env.local..."
        cat > .env.local << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/time-capsule-social

# Authentication Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-for-development

# Application Configuration
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
EOF
        echo "✅ Created basic .env.local"
        echo ""
        echo "⚠️  IMPORTANT: Update the secrets in .env.local before proceeding!"
        echo ""
    fi
else
    echo "✅ .env.local already exists"
fi

# Check if MongoDB is running locally
echo "🔍 Checking if MongoDB is running..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running locally"
elif command -v brew &> /dev/null && brew services list | grep mongodb | grep started > /dev/null; then
    echo "✅ MongoDB service is active"
else
    echo "⚠️  MongoDB doesn't appear to be running locally"
    echo ""
    echo "📝 To start local MongoDB:"
    echo "   brew services start mongodb/brew/mongodb-community"
    echo ""
    echo "📝 Or use MongoDB Atlas (cloud) - see MONGODB_SETUP.md"
    echo ""
fi

# Test database connection
echo "🧪 Testing database connection..."
if command -v node &> /dev/null; then
    node test-db-connection.js
else
    echo "❌ Node.js not found. Please install Node.js first."
fi

echo ""
echo "🚀 Next steps:"
echo "   1. Edit .env.local with your database settings"
echo "   2. Run: npm run seed (to add sample data)"
echo "   3. Run: npm run dev (to start the server)"
echo ""
echo "📚 For detailed setup instructions, see: MONGODB_SETUP.md"
