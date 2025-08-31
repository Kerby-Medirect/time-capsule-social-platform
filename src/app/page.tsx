'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Feed from '@/components/Feed';
import Sidebar from '@/components/Sidebar';

import { Menu } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRandomMemory = async () => {
    try {
      const response = await fetch('/api/posts/random');
      const data = await response.json();
      
      if (response.ok && data.post) {
        // Scroll to top and highlight the random post
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // You could implement a modal or highlight effect here
        alert(`Random memory from ${data.post.decade}: ${data.post.content.substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('Error fetching random memory:', error);
    }
  };

  const handleCreatePost = () => {
    // Redirect to create post page (to be implemented)
    window.location.href = '/create';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onSearch={handleSearch}
        onRandomMemory={handleRandomMemory}
        onCreatePost={handleCreatePost}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden fixed bottom-4 right-4 z-30 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Sidebar */}
          <Sidebar
            selectedTag={selectedTag}
            selectedDecade={selectedDecade}
            onTagChange={setSelectedTag}
            onDecadeChange={setSelectedDecade}
          />

          {/* Mobile Sidebar */}
          <Sidebar
            selectedTag={selectedTag}
            selectedDecade={selectedDecade}
            onTagChange={setSelectedTag}
            onDecadeChange={setSelectedDecade}
            isMobile={true}
            isOpen={showMobileSidebar}
            onClose={() => setShowMobileSidebar(false)}
          />

          {/* Main Feed */}
          <div className="flex-1 min-w-0">
            <Feed
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              selectedDecade={selectedDecade}
            />
          </div>
        </div>
      </div>
    </div>
  );
}