import User from '../../src/models/User';
import { createTestUser } from '../helpers/testUtils';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword123',
        bio: 'Test bio'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.bio).toBe(userData.bio);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should set default avatar if not provided', async () => {
      const user = await createTestUser({ avatar: undefined });
      expect(user.avatar).toContain('unsplash.com');
    });

    it('should initialize likedPosts as empty array', async () => {
      const user = await createTestUser();
      expect(user.likedPosts).toEqual([]);
    });
  });

  describe('User Validation', () => {
    it('should require username', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      await expect(user.save()).rejects.toThrow(/username.*required/i);
    });

    it('should require email', async () => {
      const user = new User({
        username: 'testuser',
        password: 'password123'
      });

      await expect(user.save()).rejects.toThrow(/email.*required/i);
    });

    it('should require password', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com'
      });

      await expect(user.save()).rejects.toThrow(/password.*required/i);
    });

    it('should validate email format', async () => {
      const user = new User({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      });

      await expect(user.save()).rejects.toThrow(/email/i);
    });

    it('should enforce unique username', async () => {
      await createTestUser({ username: 'duplicate' });
      
      const duplicateUser = new User({
        username: 'duplicate',
        email: 'different@example.com',
        password: 'password123'
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      await createTestUser({ email: 'duplicate@example.com' });
      
      const duplicateUser = new User({
        username: 'different',
        email: 'duplicate@example.com',
        password: 'password123'
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should enforce username length constraints', async () => {
      // Too short
      const shortUser = new User({
        username: 'ab',
        email: 'test@example.com',
        password: 'password123'
      });
      await expect(shortUser.save()).rejects.toThrow(/3 characters/i);

      // Too long
      const longUser = new User({
        username: 'a'.repeat(21),
        email: 'test2@example.com',
        password: 'password123'
      });
      await expect(longUser.save()).rejects.toThrow(/20 characters/i);
    });

    it('should enforce password length constraint', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: '12345' // Too short
      });

      await expect(user.save()).rejects.toThrow(/6 characters/i);
    });

    it('should enforce bio length constraint', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'a'.repeat(501) // Too long
      });

      await expect(user.save()).rejects.toThrow(/500 characters/i);
    });
  });

  describe('User Methods', () => {
    it('should convert email to lowercase', async () => {
      const user = await createTestUser({ 
        email: 'TEST@EXAMPLE.COM' 
      });
      
      expect(user.email).toBe('test@example.com');
    });

    it('should trim username and email', async () => {
      const user = await createTestUser({
        username: '  testuser  ',
        email: '  test@example.com  '
      });

      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
    });
  });

  describe('User Relationships', () => {
    it('should handle liked posts relationship', async () => {
      const user = await createTestUser();
      const { ObjectId } = require('mongoose').Types;
      const postId = new ObjectId();

      user.likedPosts.push(postId);
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.likedPosts).toHaveLength(1);
      expect(updatedUser?.likedPosts[0].toString()).toBe(postId.toString());
    });
  });
});
