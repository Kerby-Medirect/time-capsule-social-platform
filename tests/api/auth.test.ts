import { createTestUser, generateTestToken } from '../helpers/testUtils';
import User from '../../src/models/User';
import { hashPassword } from '../../src/lib/auth';

// Mock Next.js request/response for API testing
const mockRequest = (method: string, body: any = {}, headers: any = {}) => ({
  method,
  json: async () => body,
  headers,
  nextUrl: { searchParams: new URLSearchParams() }
});

const mockResponse = () => {
  const res: any = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    headers: new Map()
  };
  return res;
};

describe('/api/auth', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        bio: 'New user bio'
      };

      // Mock the registration logic
      const hashedPassword = await hashPassword(userData.password);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.bio).toBe(userData.bio);
    });

    it('should reject registration with duplicate username', async () => {
      await createTestUser({ username: 'existing' });

      const duplicateUser = new User({
        username: 'existing',
        email: 'different@example.com',
        password: await hashPassword('password123')
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should reject registration with duplicate email', async () => {
      await createTestUser({ email: 'existing@example.com' });

      const duplicateUser = new User({
        username: 'different',
        email: 'existing@example.com',
        password: await hashPassword('password123')
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should reject registration with invalid email format', async () => {
      const user = new User({
        username: 'testuser',
        email: 'invalid-email',
        password: await hashPassword('password123')
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should reject registration with short password', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: await hashPassword('123') // Too short
      });

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser: any;
    const testPassword = 'password123';

    beforeEach(async () => {
      testUser = await createTestUser({
        email: 'login@example.com',
        password: await hashPassword(testPassword)
      });
    });

    it('should login with valid credentials', async () => {
      const foundUser = await User.findOne({ email: 'login@example.com' });
      expect(foundUser).toBeTruthy();
      expect(foundUser?.email).toBe('login@example.com');
    });

    it('should reject login with invalid email', async () => {
      const foundUser = await User.findOne({ email: 'nonexistent@example.com' });
      expect(foundUser).toBeNull();
    });

    it('should generate JWT token for valid user', () => {
      const token = generateTestToken(testUser._id.toString());
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });
  });

  describe('Authentication Helpers', () => {
    it('should hash passwords correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeTruthy();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(10);
    });

    it('should generate valid JWT tokens', () => {
      const userId = 'test-user-id';
      const token = generateTestToken(userId);
      
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      
      expect(decoded.userId).toBe(userId);
      expect(decoded.exp).toBeTruthy();
    });
  });
});
