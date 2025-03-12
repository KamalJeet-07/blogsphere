import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  views: number;
}

export function AdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newBlog, setNewBlog] = useState({ title: '', content: '' });
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const fetchBlogs = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setBlogs(data);
    };

    fetchBlogs();
  }, []);

  const handleCreate = async () => {
    if (!newBlog.title || !newBlog.content) return;

    const { data, error } = await supabase
      .from('blogs')
      .insert([newBlog])
      .select()
      .single();

    if (error) {
      alert('Error creating blog post');
      return;
    }

    setBlogs([data, ...blogs]);
    setIsCreating(false);
    setNewBlog({ title: '', content: '' });
  };

  const handleUpdate = async (id: number) => {
    const blogToUpdate = blogs.find(blog => blog.id === id);
    if (!blogToUpdate) return;

    const { error } = await supabase
      .from('blogs')
      .update(blogToUpdate)
      .eq('id', id);

    if (error) {
      alert('Error updating blog post');
      return;
    }

    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting blog post');
      return;
    }

    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus size={20} />
            New Blog Post
          </button>
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">New Blog Post</h2>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              placeholder="Blog Title"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <textarea
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              placeholder="Blog Content"
              rows={6}
              className="w-full p-2 border rounded-lg mb-4"
            />
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Save size={20} />
              Create Post
            </button>
          </div>
        )}

        <div className="space-y-6">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-lg shadow-md p-6">
              {editingId === blog.id ? (
                <>
                  <input
                    type="text"
                    value={blog.title}
                    onChange={(e) => setBlogs(blogs.map(b => 
                      b.id === blog.id ? { ...b, title: e.target.value } : b
                    ))}
                    className="w-full p-2 border rounded-lg mb-4"
                  />
                  <textarea
                    value={blog.content}
                    onChange={(e) => setBlogs(blogs.map(b => 
                      b.id === blog.id ? { ...b, content: e.target.value } : b
                    ))}
                    rows={6}
                    className="w-full p-2 border rounded-lg mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(blog.id)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Save size={20} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{blog.title}</h2>
                      <div className="text-sm text-gray-500">
                        Posted on {format(new Date(blog.created_at), 'PPP')} • {blog.views} views
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(blog.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{blog.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}