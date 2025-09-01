'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PostCard from './PostCard';


interface Author {
  _id: string;
  username: string;
  avatar: string;
}

interface Comment {
  _id: string;
  author: Author;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

interface Post {
  _id: string;
  author: Author;
  content: string;
  image: string;
  likes: string[];
  comments: Comment[];
  tags: string[];
  decade: string;
  createdAt: string;
}

interface FeedProps {
  searchQuery?: string;
  selectedTag?: string | null;
  selectedDecade?: string | null;
}

const Feed: React.FC<FeedProps> = ({ searchQuery, selectedTag, selectedDecade }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(async (pageNum: number = 1, reset: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedTag) params.append('tag', selectedTag);
      if (selectedDecade) params.append('decade', selectedDecade);

      const response = await fetch(`/api/posts?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();

      if (reset || pageNum === 1) {
        setPosts(data.posts || []);
      } else {
        setPosts(prev => [...prev, ...(data.posts || [])]);
      }
      setHasMore(data.pagination?.hasMore || false);
      setError(null);
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchQuery, selectedTag, selectedDecade]);

  useEffect(() => {
    setPage(1);
    fetchPosts(1, true);
  }, [fetchPosts]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, false);
    }
  };

  const handleLike = () => {
    // Optimistic update handled in PostCard component
  };

  const handleComment = () => {
    // Optimistic update handled in PostCard component
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, loadingMore]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="h-64 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchPosts(1, true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No memories found. Be the first to share one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}

      {loadingMore && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-500">No more memories to load</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
