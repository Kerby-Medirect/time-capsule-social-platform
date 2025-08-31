import Post from '../../src/models/Post';
import { createTestUser, createTestPost } from '../helpers/testUtils';

describe('Post Model', () => {
  let testUser: any;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('Post Creation', () => {
    it('should create a post with valid data', async () => {
      const postData = {
        author: testUser._id,
        content: 'Remember Game Boys?',
        image: 'https://example.com/gameboy.jpg',
        tags: ['Games', 'Gadgets'],
        decade: '90s' as const
      };

      const post = new Post(postData);
      const savedPost = await post.save();

      expect(savedPost._id).toBeDefined();
      expect(savedPost.content).toBe(postData.content);
      expect(savedPost.image).toBe(postData.image);
      expect(savedPost.tags).toEqual(postData.tags);
      expect(savedPost.decade).toBe(postData.decade);
      expect(savedPost.author.toString()).toBe(testUser._id.toString());
      expect(savedPost.createdAt).toBeDefined();
      expect(savedPost.updatedAt).toBeDefined();
    });

    it('should initialize likes and comments as empty arrays', async () => {
      const post = await createTestPost(testUser._id);
      expect(post.likes).toEqual([]);
      expect(post.comments).toEqual([]);
    });
  });

  describe('Post Validation', () => {
    it('should require author', async () => {
      const post = new Post({
        content: 'Test content',
        image: 'https://example.com/test.jpg',
        decade: '90s'
      });

      await expect(post.save()).rejects.toThrow();
    });

    it('should require content', async () => {
      const post = new Post({
        author: testUser._id,
        image: 'https://example.com/test.jpg',
        decade: '90s'
      });

      await expect(post.save()).rejects.toThrow(/content.*required/i);
    });

    it('should require image', async () => {
      const post = new Post({
        author: testUser._id,
        content: 'Test content',
        decade: '90s'
      });

      await expect(post.save()).rejects.toThrow(/image.*required/i);
    });

    it('should require decade', async () => {
      const post = new Post({
        author: testUser._id,
        content: 'Test content',
        image: 'https://example.com/test.jpg'
      });

      await expect(post.save()).rejects.toThrow(/decade.*required/i);
    });

    it('should enforce content length constraint', async () => {
      const post = new Post({
        author: testUser._id,
        content: 'a'.repeat(1001), // Too long
        image: 'https://example.com/test.jpg',
        decade: '90s'
      });

      await expect(post.save()).rejects.toThrow(/1000 characters/i);
    });

    it('should validate decade enum values', async () => {
      const post = new Post({
        author: testUser._id,
        content: 'Test content',
        image: 'https://example.com/test.jpg',
        decade: 'invalid-decade' as any
      });

      await expect(post.save()).rejects.toThrow();
    });

    it('should validate tag enum values', async () => {
      const post = new Post({
        author: testUser._id,
        content: 'Test content',
        image: 'https://example.com/test.jpg',
        decade: '90s',
        tags: ['InvalidTag']
      });

      await expect(post.save()).rejects.toThrow();
    });
  });

  describe('Post Tags', () => {
    it('should accept valid tag values', async () => {
      const validTags = ['Cartoons', 'Music', 'Toys', 'Movies', 'TV Shows', 'Fashion', 'Gadgets', 'Games', 'Places'];
      
      for (const tag of validTags) {
        const post = await createTestPost(testUser._id, { tags: [tag] });
        expect(post.tags).toContain(tag);
      }
    });

    it('should allow multiple tags', async () => {
      const post = await createTestPost(testUser._id, {
        tags: ['Games', 'Gadgets', 'Toys']
      });

      expect(post.tags).toHaveLength(3);
      expect(post.tags).toEqual(['Games', 'Gadgets', 'Toys']);
    });

    it('should allow empty tags array', async () => {
      const post = await createTestPost(testUser._id, { tags: [] });
      expect(post.tags).toEqual([]);
    });
  });

  describe('Post Decades', () => {
    it('should accept valid decade values', async () => {
      const validDecades = ['80s', '90s', '2000s'] as const;
      
      for (const decade of validDecades) {
        const post = await createTestPost(testUser._id, { decade });
        expect(post.decade).toBe(decade);
      }
    });
  });

  describe('Post Relationships', () => {
    it('should handle likes relationship', async () => {
      const post = await createTestPost(testUser._id);
      const anotherUser = await createTestUser({ 
        username: 'liker', 
        email: 'liker@example.com' 
      });

      post.likes.push(anotherUser._id);
      await post.save();

      const updatedPost = await Post.findById(post._id);
      expect(updatedPost?.likes).toHaveLength(1);
      expect(updatedPost?.likes[0].toString()).toBe(anotherUser._id.toString());
    });

    it('should handle comments relationship', async () => {
      const post = await createTestPost(testUser._id);
      const { ObjectId } = require('mongoose').Types;
      const commentId = new ObjectId();

      post.comments.push(commentId);
      await post.save();

      const updatedPost = await Post.findById(post._id);
      expect(updatedPost?.comments).toHaveLength(1);
      expect(updatedPost?.comments[0].toString()).toBe(commentId.toString());
    });

    it('should populate author information', async () => {
      const post = await createTestPost(testUser._id);
      
      const populatedPost = await Post.findById(post._id).populate('author');
      expect(populatedPost?.author).toBeDefined();
      expect((populatedPost?.author as any).username).toBe(testUser.username);
    });
  });
});
