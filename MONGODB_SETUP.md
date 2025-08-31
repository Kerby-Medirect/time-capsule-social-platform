# MongoDB Setup Guide for Time Capsule Social Platform

## 🗄️ Database Configuration Options

### Option 1: Local MongoDB (Recommended for Development)

#### Install MongoDB on macOS:
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify MongoDB is running
brew services list | grep mongodb
```

#### Create your .env.local file:
```bash
# Copy the template
cp env-local-template.txt .env.local

# Edit the file with your preferred editor
nano .env.local
```

Use this configuration in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/time-capsule-social
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-for-development
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### Option 2: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Configure Database Access:**
   - Go to "Database Access" → "Add New Database User"
   - Create username/password
   - Set permissions to "Read and write to any database"

3. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` for development (allows all IPs)
   - For production, use your specific IP addresses

4. **Get Connection String:**
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

5. **Update .env.local:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/time-capsule-social?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-for-development
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

## 🧪 Testing Your Database Connection

After setting up your `.env.local` file, test your connection:

```bash
# Test database connection
node test-db-connection.js

# If successful, seed the database
npm run seed

# Start the development server
npm run dev
```

## 🔒 Security Best Practices

### For Development:
- Use simple passwords in local MongoDB
- Keep JWT secrets different from production
- Use localhost URLs

### For Production:
- Generate strong, random JWT secrets (32+ characters)
- Use MongoDB Atlas with restricted IP access
- Enable database authentication
- Use environment-specific database names

### Generate Secure Secrets:
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator: https://generate-secret.vercel.app/32
```

## 📊 Database Structure

Your Time Capsule platform uses these collections:
- **users**: User accounts and profiles
- **posts**: Nostalgic memory posts
- **comments**: Comments on posts (with threading support)

## 🚀 Quick Start Commands

```bash
# 1. Create .env.local file
cp env-local-template.txt .env.local

# 2. Edit with your MongoDB settings
nano .env.local

# 3. Test database connection
node test-db-connection.js

# 4. Install dependencies (if not done)
npm install

# 5. Seed database with sample data
npm run seed

# 6. Start development server
npm run dev
```

## 🆘 Troubleshooting

### Common Issues:

1. **"MongoDB not running"**
   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

2. **"Authentication failed" (Atlas)**
   - Check username/password in connection string
   - Verify database user permissions

3. **"Network timeout" (Atlas)**
   - Check Network Access settings
   - Ensure your IP is whitelisted

4. **"Database connection failed"**
   - Verify MONGODB_URI in .env.local
   - Check if database service is running

### Test Database Connection:
```bash
# This will test your MongoDB connection and create/delete a test document
node test-db-connection.js
```

## 📝 Next Steps

After successful setup:
1. Visit http://localhost:3000
2. Register a new account or use demo credentials:
   - Email: `demo@example.com` | Password: `demo123`
   - Email: `nostalgia@example.com` | Password: `90skid`
3. Start creating nostalgic memories!
