import React, { useEffect, useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { supabase } from '../lib/supabase';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  views: number;
}

export function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setBlogs(data);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookOpen className="h-10 w-10 text-blue-600" strokeWidth={1.5} />
              <div>
                <h1 className="text-3xl font-serif text-gray-900">Blogosphere</h1>
                <p className="text-sm text-gray-500 mt-0.5">Share your thoughts with the world</p>
              </div>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif text-gray-900 mb-8">Latest Articles</h2>
        <div className="grid gap-8">
          {blogs.map(blog => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              title={blog.title}
              excerpt={blog.content.substring(0, 200) + '...'}
              created_at={blog.created_at}
              views={blog.views}
            />
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Blogosphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}