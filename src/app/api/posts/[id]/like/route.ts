import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { verifyToken, extractTokenFromHeaders } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeaders(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const { id: postId } = await params;

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isLiked = post.likes.includes(decoded.userId);
    
    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id: string) => id.toString() !== decoded.userId);
      user.likedPosts = user.likedPosts.filter((id: string) => id.toString() !== postId);
    } else {
      // Like the post
      post.likes.push(decoded.userId);
      user.likedPosts.push(postId);
    }

    await post.save();
    await user.save();

    return NextResponse.json({
      message: isLiked ? 'Post unliked' : 'Post liked',
      isLiked: !isLiked,
      likesCount: post.likes.length
    });

  } catch (error: unknown) {
    console.error('Like/unlike post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
