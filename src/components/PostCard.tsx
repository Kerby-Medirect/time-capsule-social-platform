'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface Author {
  _id: string;
  username: string;
  avatar: string;
}

interface PostComment {
  _id: string;
  author: Author;
  content: string;
  createdAt: string;
  replies?: PostComment[];
}

interface Post {
  _id: string;
  author: Author;
  content: string;
  image: string;
  likes: string[];
  comments: PostComment[];
  tags: string[];
  decade: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const { user, token } = useAuth();
  const [isLiked, setIsLiked] = useState(user ? post.likes.includes(user.id) : false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<PostComment[]>(post.comments);

  const handleLike = async () => {
    if (!user || !token) return;
    
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
        onLike(post._id);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token || !commentText.trim()) return;

    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setCommentText('');
        onComment(post._id, commentText);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden border border-gray-200 card-hover">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.username}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.image}
          alt="Memory"
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {post.decade}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-900 mb-3">
          <span className="font-medium text-purple-600">Do you remember...</span> {post.content}
        </p>
        
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{comments.length}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Comment Form */}
            {user && (
              <form onSubmit={handleComment} className="mb-4">
                <div className="flex space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.slice(0, 3).map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="font-medium text-sm text-gray-900">
                        {comment.author.username}
                      </p>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
              
              {comments.length > 3 && (
                <button className="text-sm text-purple-600 hover:text-purple-800">
                  View all {comments.length} comments
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
