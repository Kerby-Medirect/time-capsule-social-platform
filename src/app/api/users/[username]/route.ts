import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    
    const { username } = await params;
    
    // Find user
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's posts
    const posts = await Post.find({ author: user._id })
      .populate('author', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });

    // Get user's liked posts
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate('author', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt
      },
      posts,
      likedPosts,
      stats: {
        postsCount: posts.length,
        likedPostsCount: likedPosts.length,
        totalLikes: posts.reduce((sum, post) => sum + post.likes.length, 0)
      }
    });

  } catch (error: unknown) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
