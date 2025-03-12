import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CommentSection } from '../components/CommentSection';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Eye, ArrowLeft } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  views: number;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_email: string;
}

export function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      await supabase.rpc('increment_views', { blog_id: parseInt(id!) });

      const { data: blogData } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (blogData) setBlog(blogData);

      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('blog_id', id)
        .order('created_at', { ascending: false });

      if (commentsData) setComments(commentsData);
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-8"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
          <span className="font-medium">Back to Home</span>
        </Link>

        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <time dateTime={blog.created_at}>
              {format(new Date(blog.created_at), 'MMMM d, yyyy')}
            </time>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Eye size={14} strokeWidth={1.5} />
              <span>{blog.views} views</span>
            </div>
          </div>

          <h1 className="text-4xl font-serif text-gray-900 mb-8">{blog.title}</h1>

          <div className="prose max-w-none">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-600 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

      </main>
    </div>
  );
}