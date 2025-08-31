# API Issues Documentation

## Overview
This document details the API issues encountered during development and their resolutions.

## Issues Encountered

### 1. TypeScript Compilation Error
**Error**: `Cannot assign to 'NODE_ENV' because it is a read-only property`

**Location**: `tests/env.ts:2:13`

**Root Cause**: 
- NODE_ENV is a read-only property in production builds
- Direct assignment `process.env.NODE_ENV = 'test'` fails during Next.js compilation

**Solution**:
```typescript
// Before (failing)
process.env.NODE_ENV = 'test';

// After (working)
if (process.env.NODE_ENV !== 'test') {
  (process.env as any).NODE_ENV = 'test';
}
```

### 2. MongoDB Connection String Missing Database Name
**Error**: API returning empty results despite data existing in database

**Root Cause**: 
- MongoDB Atlas connection string was missing database name
- Connection defaulted to "test" database instead of "time-capsule-social"

**Solution**:
```javascript
// Before
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority

// After  
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/time-capsule-social?retryWrites=true&w=majority
```

### 3. Mongoose Population Issues in Next.js API Routes
**Error**: `MissingSchemaError: Schema hasn't been registered for model "User"`

**Location**: `/api/posts` route when using `.populate()`

**Root Cause**:
- Next.js API route execution context issues with Mongoose model registration
- Complex nested population causing schema registration conflicts
- Intermittent failures with `.populate('author', 'username avatar')`

**Attempted Solutions**:
1. ❌ Complex nested population with comments
2. ❌ Standard `.populate()` method
3. ❌ Model re-registration in API routes

**Working Solution**:
```typescript
// Manual population approach
const posts = await Post.find(query)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

const populatedPosts = await Promise.all(
  posts.map(async (post) => {
    const author = await User.findById(post.author).select('username avatar');
    return {
      ...post.toObject(),
      author: author || { username: 'Unknown', avatar: '' }
    };
  })
);
```

### 4. Port Conflicts During Development
**Issue**: Next.js starting on different ports (3000, 3001, 3003, 3004)

**Root Cause**: Multiple development server instances running simultaneously

**Solution**:
```bash
# Kill existing Next.js processes
pkill -f "next dev"

# Start fresh
npm run dev
```

## Best Practices Learned

### 1. Database Connection
- Always include database name in MongoDB URI
- Test connection string format before deployment
- Use connection testing scripts for validation

### 2. Mongoose in Next.js
- Avoid complex population in API routes when possible
- Consider manual population for better reliability
- Test model registration in API route context

### 3. Environment Variables
- Use type casting for read-only environment variables
- Separate test environment configuration
- Validate environment setup in build process

### 4. Development Workflow
- Clean up processes between development sessions
- Monitor port usage for conflicts
- Use background processes judiciously

## Current API Status

### Working Endpoints
- ✅ `GET /api/posts` - Returns posts with manual author population
- ✅ `POST /api/posts` - Creates new posts
- ✅ `GET /api/posts/random` - Returns random post
- ✅ `POST /api/posts/[id]/like` - Like/unlike posts
- ✅ `GET /api/posts/[id]/comments` - Get comments
- ✅ `POST /api/posts/[id]/comments` - Create comments
- ✅ `POST /api/auth/login` - User authentication
- ✅ `POST /api/auth/register` - User registration
- ✅ `GET /api/users/[username]` - User profiles

### Performance Considerations
- Manual population adds N+1 query overhead
- Consider implementing database views or aggregation pipelines for better performance
- Monitor response times with realistic data loads

## Testing Results

### Database Population
- ✅ 27 users (25 realistic + 2 demo)
- ✅ 25 nostalgic posts across decades
- ✅ 291 comments with authentic engagement
- ✅ 1,338 likes distributed realistically

### API Performance
- ✅ All endpoints responding correctly
- ✅ Manual population working reliably
- ✅ No schema registration errors
- ✅ Consistent data format

## Future Improvements

1. **Performance Optimization**
   - Implement database aggregation pipelines
   - Add response caching where appropriate
   - Optimize manual population queries

2. **Error Handling**
   - Add retry logic for population failures
   - Implement fallback mechanisms
   - Enhance error logging and monitoring

3. **Development Experience**
   - Create development scripts for cleanup
   - Add automated testing for API routes
   - Implement health check endpoints

## Demo Credentials
- Email: `demo@example.com` | Password: `demo123`
- Email: `nostalgia@example.com` | Password: `90skid`
