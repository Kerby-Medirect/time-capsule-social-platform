import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET() {
  try {
    await connectDB();
    
    // Get a random post using MongoDB aggregation
    const randomPosts = await Post.aggregate([
      { $sample: { size: 1 } }
    ]);

    if (randomPosts.length === 0) {
      return NextResponse.json(
        { error: 'No posts found' },
        { status: 404 }
      );
    }

    // Populate the random post
    const post = await Post.findById(randomPosts[0]._id)
      .populate('author', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });

    return NextResponse.json({ post });

  } catch (error: unknown) {
    console.error('Get random post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
