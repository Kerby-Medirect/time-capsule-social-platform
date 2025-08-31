import User from '../../src/models/User';
import Post from '../../src/models/Post';
import Comment from '../../src/models/Comment';
import { hashPassword } from '../../src/lib/auth';

// Test data factories
export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: await hashPassword('password123'),
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Test user bio'
  };

  const userData = { ...defaultUser, ...overrides };
  const user = new User(userData);
  await user.save();
  return user;
};

export const createTestPost = async (authorId: string, overrides = {}) => {
  const defaultPost = {
    author: authorId,
    content: 'Test nostalgic memory content',
    image: 'https://example.com/test-image.jpg',
    tags: ['Games'],
    decade: '90s' as const,
    likes: [],
    comments: []
  };

  const postData = { ...defaultPost, ...overrides };
  const post = new Post(postData);
  await post.save();
  return post;
};

export const createTestComment = async (authorId: string, postId: string, overrides = {}) => {
  const defaultComment = {
    author: authorId,
    post: postId,
    content: 'Test comment content',
    likes: [],
    replies: []
  };

  const commentData = { ...defaultComment, ...overrides };
  const comment = new Comment(commentData);
  await comment.save();
  return comment;
};

// Helper to create multiple test users
export const createTestUsers = async (count: number) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = await createTestUser({
      username: `testuser${i}`,
      email: `test${i}@example.com`
    });
    users.push(user);
  }
  return users;
};

// Helper to create test data with relationships
export const createTestDataSet = async () => {
  // Create users
  const user1 = await createTestUser({
    username: 'user1',
    email: 'user1@test.com'
  });
  
  const user2 = await createTestUser({
    username: 'user2', 
    email: 'user2@test.com'
  });

  // Create posts
  const post1 = await createTestPost(user1._id, {
    content: 'Remember Game Boys?',
    decade: '90s'
  });

  const post2 = await createTestPost(user2._id, {
    content: 'Remember dial-up internet?',
    decade: '2000s'
  });

  // Create comments
  const comment1 = await createTestComment(user2._id, post1._id, {
    content: 'Yes! I had the transparent purple one!'
  });

  const comment2 = await createTestComment(user1._id, post2._id, {
    content: 'That horrible screeching sound!'
  });

  return {
    users: [user1, user2],
    posts: [post1, post2],
    comments: [comment1, comment2]
  };
};

// JWT token helper for API testing
export const generateTestToken = (userId: string) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '24h' }
  );
};
