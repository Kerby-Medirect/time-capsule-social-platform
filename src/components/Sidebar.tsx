'use client';

import React from 'react';
import { Filter, X } from 'lucide-react';

interface SidebarProps {
  selectedTag: string | null;
  selectedDecade: string | null;
  onTagChange: (tag: string | null) => void;
  onDecadeChange: (decade: string | null) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedTag,
  selectedDecade,
  onTagChange,
  onDecadeChange,
  isMobile = false,
  isOpen = true,
  onClose
}) => {
  const tags = [
    'Cartoons', 'Music', 'Toys', 'Movies', 'TV Shows', 
    'Fashion', 'Gadgets', 'Games', 'Places'
  ];
  
  const decades = ['80s', '90s', '2000s'];

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Clear Filters */}
      {(selectedTag || selectedDecade) && (
        <button
          onClick={() => {
            onTagChange(null);
            onDecadeChange(null);
          }}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Clear all filters
        </button>
      )}

      {/* Decades Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Decades</h3>
        <div className="space-y-2">
          {decades.map((decade) => (
            <button
              key={decade}
              onClick={() => onDecadeChange(selectedDecade === decade ? null : decade)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedDecade === decade
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {decade}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange(selectedTag === tag ? null : tag)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedTag === tag
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'text-gray-700 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Trending</h3>
        <div className="flex flex-wrap gap-2">
          {['Nintendo', 'Blockbuster', 'Tamagotchi', 'MTV'].map((trending) => (
            <span
              key={trending}
              className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium"
            >
              #{trending}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Community Stats</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Total Memories</span>
            <span className="font-medium">1,247</span>
          </div>
          <div className="flex justify-between">
            <span>Active Members</span>
            <span className="font-medium">542</span>
          </div>
          <div className="flex justify-between">
            <span>This Week</span>
            <span className="font-medium">89 new</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl overflow-y-auto p-6">
              {sidebarContent}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="hidden lg:block w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24 h-fit">
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
