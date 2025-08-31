'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CreatePostPage: React.FC = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [decade, setDecade] = useState<'80s' | '90s' | '2000s'>('90s');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tags = [
    'Cartoons', 'Music', 'Toys', 'Movies', 'TV Shows', 
    'Fashion', 'Gadgets', 'Games', 'Places'
  ];

  const sampleImages = [
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop'
  ];

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleImageSelect = (imageUrl: string) => {
    setImage(imageUrl);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !image || !user || !token) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          image,
          tags: selectedTags,
          decade
        }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div>Redirecting...</div>;
  }

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
            <h1 className="text-xl font-semibold text-gray-900">Share a Memory</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Memory Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Memory
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-purple-600 font-medium">
                Do you remember...
              </span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="the satisfaction of rewinding a VHS tape perfectly?"
                required
                rows={4}
                className="w-full pl-32 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                maxLength={1000}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {content.length}/1000 characters
            </p>
          </div>

          {/* Decade Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Which decade?
            </label>
            <div className="flex space-x-4">
              {(['80s', '90s', '2000s'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDecade(d)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    decade === d
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose an image
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {sampleImages.map((imageUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleImageSelect(imageUrl)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                    image === imageUrl
                      ? 'border-purple-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`Option ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image === imageUrl && (
                    <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-purple-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim() || !image}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sharing Memory...' : 'Share Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
