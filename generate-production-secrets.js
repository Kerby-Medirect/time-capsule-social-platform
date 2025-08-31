// Generate secure secrets for production deployment
const crypto = require('crypto');

console.log('🔐 Production Secrets for Vercel Environment Variables');
console.log('=====================================================');
console.log('');
console.log('Copy these to your Vercel project → Settings → Environment Variables:');
console.log('');

console.log('JWT_SECRET=');
console.log(crypto.randomBytes(32).toString('hex'));
console.log('');

console.log('NEXTAUTH_SECRET=');
console.log(crypto.randomBytes(32).toString('hex'));
console.log('');

console.log('⚠️  IMPORTANT NOTES:');
console.log('1. Never use development secrets in production!');
console.log('2. Keep these secrets secure and private');
console.log('3. Update NEXTAUTH_URL to your Vercel domain');
console.log('4. Use your MongoDB Atlas production connection string');
console.log('');

console.log('📝 Don\'t forget to set:');
console.log('MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/time-capsule-social?...');
console.log('NEXTAUTH_URL=https://your-vercel-app.vercel.app');
console.log('NODE_ENV=production');
