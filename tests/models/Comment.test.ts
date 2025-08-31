import Comment from '../../src/models/Comment';
import { createTestUser, createTestPost, createTestComment } from '../helpers/testUtils';

describe('Comment Model', () => {
  let testUser: any;
  let testPost: any;

  beforeEach(async () => {
    testUser = await createTestUser();
    testPost = await createTestPost(testUser._id);
  });

  describe('Comment Creation', () => {
    it('should create a comment with valid data', async () => {
      const commentData = {
        author: testUser._id,
        post: testPost._id,
        content: 'Great nostalgic memory!'
      };

      const comment = new Comment(commentData);
      const savedComment = await comment.save();

      expect(savedComment._id).toBeDefined();
      expect(savedComment.content).toBe(commentData.content);
      expect(savedComment.author.toString()).toBe(testUser._id.toString());
      expect(savedComment.post.toString()).toBe(testPost._id.toString());
      expect(savedComment.createdAt).toBeDefined();
      expect(savedComment.updatedAt).toBeDefined();
    });

    it('should initialize likes and replies as empty arrays', async () => {
      const comment = await createTestComment(testUser._id, testPost._id);
      expect(comment.likes).toEqual([]);
      expect(comment.replies).toEqual([]);
    });

    it('should set parentComment to null by default', async () => {
      const comment = await createTestComment(testUser._id, testPost._id);
      expect(comment.parentComment).toBeNull();
    });
  });

  describe('Comment Validation', () => {
    it('should require author', async () => {
      const comment = new Comment({
        post: testPost._id,
        content: 'Test content'
      });

      await expect(comment.save()).rejects.toThrow();
    });

    it('should require post', async () => {
      const comment = new Comment({
        author: testUser._id,
        content: 'Test content'
      });

      await expect(comment.save()).rejects.toThrow();
    });

    it('should require content', async () => {
      const comment = new Comment({
        author: testUser._id,
        post: testPost._id
      });

      await expect(comment.save()).rejects.toThrow(/content.*required/i);
    });

    it('should enforce content length constraint', async () => {
      const comment = new Comment({
        author: testUser._id,
        post: testPost._id,
        content: 'a'.repeat(501) // Too long
      });

      await expect(comment.save()).rejects.toThrow(/500 characters/i);
    });
  });

  describe('Comment Threading', () => {
    it('should create a reply to another comment', async () => {
      const parentComment = await createTestComment(testUser._id, testPost._id, {
        content: 'Original comment'
      });

      const anotherUser = await createTestUser({
        username: 'replier',
        email: 'replier@example.com'
      });

      const replyComment = await createTestComment(anotherUser._id, testPost._id, {
        content: 'Reply to original comment',
        parentComment: parentComment._id
      });

      expect(replyComment.parentComment?.toString()).toBe(parentComment._id.toString());
    });

    it('should add reply to parent comment replies array', async () => {
      const parentComment = await createTestComment(testUser._id, testPost._id);
      const replyComment = await createTestComment(testUser._id, testPost._id, {
        parentComment: parentComment._id
      });

      // Add reply to parent's replies array
      parentComment.replies.push(replyComment._id);
      await parentComment.save();

      const updatedParent = await Comment.findById(parentComment._id);
      expect(updatedParent?.replies).toHaveLength(1);
      expect(updatedParent?.replies[0].toString()).toBe(replyComment._id.toString());
    });

    it('should handle nested comment structure', async () => {
      const level1Comment = await createTestComment(testUser._id, testPost._id, {
        content: 'Level 1 comment'
      });

      const level2Comment = await createTestComment(testUser._id, testPost._id, {
        content: 'Level 2 reply',
        parentComment: level1Comment._id
      });

      const level3Comment = await createTestComment(testUser._id, testPost._id, {
        content: 'Level 3 reply',
        parentComment: level2Comment._id
      });

      expect(level2Comment.parentComment?.toString()).toBe(level1Comment._id.toString());
      expect(level3Comment.parentComment?.toString()).toBe(level2Comment._id.toString());
    });
  });

  describe('Comment Relationships', () => {
    it('should handle likes relationship', async () => {
      const comment = await createTestComment(testUser._id, testPost._id);
      const anotherUser = await createTestUser({
        username: 'liker',
        email: 'liker@example.com'
      });

      comment.likes.push(anotherUser._id);
      await comment.save();

      const updatedComment = await Comment.findById(comment._id);
      expect(updatedComment?.likes).toHaveLength(1);
      expect(updatedComment?.likes[0].toString()).toBe(anotherUser._id.toString());
    });

    it('should populate author information', async () => {
      const comment = await createTestComment(testUser._id, testPost._id);
      
      const populatedComment = await Comment.findById(comment._id).populate('author');
      expect(populatedComment?.author).toBeDefined();
      expect((populatedComment?.author as any).username).toBe(testUser.username);
    });

    it('should populate post information', async () => {
      const comment = await createTestComment(testUser._id, testPost._id);
      
      const populatedComment = await Comment.findById(comment._id).populate('post');
      expect(populatedComment?.post).toBeDefined();
      expect((populatedComment?.post as any).content).toBe(testPost.content);
    });

    it('should populate parent comment information', async () => {
      const parentComment = await createTestComment(testUser._id, testPost._id, {
        content: 'Parent comment'
      });

      const replyComment = await createTestComment(testUser._id, testPost._id, {
        content: 'Reply comment',
        parentComment: parentComment._id
      });
      
      const populatedReply = await Comment.findById(replyComment._id).populate('parentComment');
      expect(populatedReply?.parentComment).toBeDefined();
      expect((populatedReply?.parentComment as any).content).toBe('Parent comment');
    });

    it('should populate replies information', async () => {
      const parentComment = await createTestComment(testUser._id, testPost._id);
      const replyComment = await createTestComment(testUser._id, testPost._id, {
        parentComment: parentComment._id
      });

      parentComment.replies.push(replyComment._id);
      await parentComment.save();
      
      const populatedParent = await Comment.findById(parentComment._id).populate('replies');
      expect(populatedParent?.replies).toHaveLength(1);
      expect((populatedParent?.replies[0] as any).content).toBe(replyComment.content);
    });
  });
});
