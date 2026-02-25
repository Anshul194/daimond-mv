import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  try {
    if (cached.conn) {
      // Check if connection is still alive
      if (mongoose.connection.readyState === 1) {
        return cached.conn;
      } else {
        // Connection is dead, reset cache
        cached.conn = null;
        cached.promise = null;
      }
    }
    
    if (!cached.promise) {
      // Check if using SRV connection string and suggest standard format
      if (MONGODB_URI.includes('mongodb+srv://')) {
        console.warn('⚠️  Using SRV connection string. If you get DNS errors, use standard format:');
        console.warn('   mongodb://username:password@host1:port,host2:port,host3:port/database?ssl=true&replicaSet=...');
      }
      
      const connectionOptions = {
        serverSelectionTimeoutMS: 30000, // Increased timeout for DNS resolution
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
      };
      
      cached.promise = mongoose.connect(MONGODB_URI, connectionOptions).catch((error) => {
        // Reset promise on error so we can retry
        cached.promise = null;
        console.error('MongoDB connection failed:', error.message);
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'querySrv' || error.name === 'MongoServerSelectionError') {
          const errorMsg = `MongoDB connection failed. This is likely a DNS resolution issue.
          
SOLUTION: Use standard connection string (without +srv) in your .env.local file.

Get it from MongoDB Atlas:
1. Go to https://cloud.mongodb.com → Database → Connect
2. Choose "Connect your application"
3. Look for "Standard connection string" option
4. Copy that connection string to .env.local

Or get from MongoDB Compass connection settings.

Current error: ${error.message}`;
          throw new Error(errorMsg);
        }
        throw error;
      });
    }
    
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected - Ready state:', mongoose.connection.readyState);
    return cached.conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

export default dbConnect
