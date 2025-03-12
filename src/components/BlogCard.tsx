import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  id: number;
  title: string;
  excerpt: string;
  created_at: string;
  views: number;
}

export function BlogCard({ id, title, excerpt, created_at, views }: BlogCardProps) {
  return (
    <Link to={`/blog/${id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <time dateTime={created_at}>{format(new Date(created_at), 'MMMM d, yyyy')}</time>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Eye size={14} strokeWidth={1.5} />
            <span>{views} views</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-serif text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h2>
        
        <p className="text-gray-600 leading-relaxed mb-4">{excerpt}</p>
        
        <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all duration-200">
          Read More
          <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
}