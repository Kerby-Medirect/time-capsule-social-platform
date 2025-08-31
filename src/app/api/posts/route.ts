import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { verifyToken, extractTokenFromHeaders } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tag = searchParams.get('tag');
    const decade = searchParams.get('decade');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: Record<string, unknown> = {};
    if (tag) query.tags = tag;
    if (decade) query.decade = decade;
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get posts without population first to avoid MissingSchemaError
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Manually populate authors to avoid mongoose schema registration issues
    const populatedPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          const author = await User.findById(post.author).select('username avatar');
          return {
            ...post.toObject(),
            author: author || { username: 'Unknown', avatar: '' }
          };
        } catch (authorError) {
          // Fallback if author lookup fails
          return {
            ...post.toObject(),
            author: { username: 'Unknown', avatar: '' }
          };
        }
      })
    );

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      posts: populatedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasMore: page < totalPages
      }
    });

  } catch (error: unknown) {
    console.error('API Posts Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { content, image, tags, decade } = await request.json();

    // Validation
    if (!content || !image || !decade) {
      return NextResponse.json(
        { error: 'Content, image, and decade are required' },
        { status: 400 }
      );
    }

    // Create post
    const post = new Post({
      author: decoded.userId,
      content,
      image,
      tags: tags || [],
      decade
    });

    await post.save();
    
    // Manually populate author info to avoid mongoose issues
    const author = await User.findById(decoded.userId).select('username avatar');
    const populatedPost = {
      ...post.toObject(),
      author: author || { username: 'Unknown', avatar: '' }
    };

    return NextResponse.json({
      message: 'Post created successfully',
      post: populatedPost
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
