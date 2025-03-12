import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  blogId: number;
  comments: Comment[];
}

export function CommentSection({ blogId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert([{ blog_id: blogId, content: newComment }]);

    if (!error) {
      setNewComment('');
      window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare size={24} className="text-blue-600" strokeWidth={1.5} />
        <h3 className="text-2xl font-serif text-gray-900">Comments</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
          placeholder="Share your thoughts..."
          rows={4}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Post Comment
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <div className="flex justify-between items-center mb-3">
              <time className="text-sm text-gray-500">
                {format(new Date(comment.created_at), 'MMM d, yyyy')}
              </time>
            </div>
            <p className="text-gray-600 leading-relaxed">{comment.content}</p>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}