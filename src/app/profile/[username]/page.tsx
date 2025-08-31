'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Heart, MessageCircle, Settings } from 'lucide-react';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  content: string;
  image: string;
  likes: string[];
  comments: {
    _id: string;
    author: {
      _id: string;
      username: string;
      avatar: string;
    };
    content: string;
    createdAt: string;
  }[];
  tags: string[];
  decade: string;
  createdAt: string;
}

interface UserStats {
  postsCount: number;
  likedPostsCount: number;
  totalLikes: number;
}

const ProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const username = params.username as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<UserStats>({ postsCount: 0, likedPostsCount: 0, totalLikes: 0 });
  const [activeTab, setActiveTab] = useState<'posts' | 'liked'>('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${username}`);
      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setPosts(data.posts);
        setLikedPosts(data.likedPosts);
        setStats(data.stats);
      } else {
        setError(data.error || 'User not found');
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId: string) => {
    // Update posts optimistically
    setPosts(prev => prev.map(post => {
      if (post._id === postId) {
        const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== currentUser?.id)
            : [...post.likes, currentUser?.id || '']
        };
      }
      return post;
    }));
  };

  const handleComment = () => {
    // Refresh posts to get updated comment count
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-retro h-12 w-12"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">@{profile.username}</h1>
            <div className="w-16">
              {isOwnProfile && (
                <button className="text-gray-600 hover:text-gray-900">
                  <Settings className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={profile.avatar}
              alt={profile.username}
              className="w-24 h-24 rounded-full object-cover"
            />
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">@{profile.username}</h1>
              {profile.bio && (
                <p className="text-gray-600 mb-4">{profile.bio}</p>
              )}
              
              <div className="flex items-center justify-center sm:justify-start space-x-1 text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start space-x-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{stats.postsCount}</div>
                  <div className="text-sm text-gray-500">Memories</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{stats.totalLikes}</div>
                  <div className="text-sm text-gray-500">Likes Received</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{stats.likedPostsCount}</div>
                  <div className="text-sm text-gray-500">Memories Liked</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Memories ({stats.postsCount})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'liked'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Liked ({stats.likedPostsCount})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {activeTab === 'posts' && (
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No memories yet</h3>
                  <p className="text-gray-500">
                    {isOwnProfile 
                      ? "Share your first nostalgic memory!" 
                      : `${profile.username} hasn't shared any memories yet.`
                    }
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'liked' && (
            <>
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No liked memories</h3>
                  <p className="text-gray-500">
                    {isOwnProfile 
                      ? "Start liking memories that resonate with you!" 
                      : `${profile.username} hasn't liked any memories yet.`
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
