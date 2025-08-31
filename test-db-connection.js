// Test MongoDB connection for Time Capsule Social Platform
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  try {
    console.log('🎮 Testing MongoDB Connection - Time Capsule Social Platform');
    console.log('===============================================================');
    
    // Check environment variables
    console.log('🔍 Environment Check:');
    console.log('   MONGODB_URI:', MONGODB_URI ? '✅ Set' : '❌ Missing');
    console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
    console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
    console.log('');
    
    if (!MONGODB_URI) {
      console.log('❌ MONGODB_URI not found in environment variables');
      console.log('');
      console.log('📝 To fix this:');
      console.log('   1. Copy env-local-template.txt to .env.local');
      console.log('   2. Update MONGODB_URI with your database connection string');
      console.log('   3. See MONGODB_SETUP.md for detailed instructions');
      return;
    }

    // Determine database type
    const isAtlas = MONGODB_URI.includes('mongodb+srv://');
    const isLocal = MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1');
    
    console.log('🗄️  Database Type:', isAtlas ? 'MongoDB Atlas (Cloud)' : isLocal ? 'Local MongoDB' : 'Custom MongoDB');
    console.log('');

    console.log('🔄 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test database operations
    console.log('');
    console.log('🧪 Testing database operations...');
    
    // Test creating a document
    const testSchema = new mongoose.Schema({ 
      message: String, 
      timestamp: Date,
      platform: String,
      testType: String
    });
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    const testDoc = new TestModel({
      message: 'Hello from Time Capsule Social Platform!',
      timestamp: new Date(),
      platform: 'Do You Remember?',
      testType: 'connection_test'
    });
    
    await testDoc.save();
    console.log('✅ Create operation: SUCCESS');
    
    // Test reading the document
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log('✅ Read operation: SUCCESS');
    
    // Test updating the document
    foundDoc.message = 'Updated test message';
    await foundDoc.save();
    console.log('✅ Update operation: SUCCESS');
    
    // Test deleting the document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Delete operation: SUCCESS');
    
    // Clean up test collection
    await TestModel.collection.drop().catch(() => {
      // Collection might not exist, ignore error
    });
    
    console.log('');
    console.log('🎉 Database connection test completed successfully!');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Run: npm run seed (to populate with sample data)');
    console.log('   2. Run: npm run dev (to start the development server)');
    console.log('   3. Visit: http://localhost:3000');
    
  } catch (error) {
    console.log('');
    console.log('❌ Database connection test failed:');
    console.log('Error:', error.message);
    console.log('');
    
    // Provide specific troubleshooting advice
    if (error.message.includes('authentication failed')) {
      console.log('🔧 Troubleshooting - Authentication Error:');
      console.log('   • Check your username and password in the connection string');
      console.log('   • Verify database user has proper permissions');
      console.log('   • For Atlas: Check Database Access settings');
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      console.log('🔧 Troubleshooting - Network Error:');
      console.log('   • For Atlas: Check Network Access (IP whitelist)');
      console.log('   • For Local: Ensure MongoDB is running');
      console.log('   • Check firewall settings');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('🔧 Troubleshooting - Connection Refused:');
      console.log('   • For Local MongoDB: brew services start mongodb/brew/mongodb-community');
      console.log('   • Check if MongoDB is running on the correct port');
      console.log('   • Verify MONGODB_URI format');
    } else {
      console.log('🔧 General Troubleshooting:');
      console.log('   • Check MONGODB_URI format in .env.local');
      console.log('   • See MONGODB_SETUP.md for detailed setup instructions');
      console.log('   • Try using MongoDB Compass to test connection manually');
    }
    
    console.log('');
    console.log('📚 For help, see: MONGODB_SETUP.md');
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('');
      console.log('👋 Disconnected from database');
    }
  }
}

testConnection();

