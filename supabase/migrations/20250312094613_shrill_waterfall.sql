/*
  # Blog Website Schema

  1. New Tables
    - `blogs`
      - `id` (serial, primary key)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamptz)
      - `views` (integer)
    - `comments`
      - `id` (serial, primary key)
      - `blog_id` (integer, foreign key)
      - `user_id` (uuid, foreign key)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Functions
    - `increment_views`: Increments the view count for a blog post

  3. Security
    - Enable RLS on all tables
    - Public can read blogs and comments
    - Only authenticated users can create comments
*/

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  views integer DEFAULT 0
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id serial PRIMARY KEY,
  blog_id integer REFERENCES blogs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_views(blog_id integer)
RETURNS void AS $$
BEGIN
  UPDATE blogs
  SET views = views + 1
  WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to blogs"
  ON blogs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample blog posts
INSERT INTO blogs (title, content) VALUES
('Welcome to Our Blog!', 'This is our first blog post. We are excited to share our thoughts and ideas with you.

In this blog, we will be discussing various topics related to technology, programming, and web development. Stay tuned for more interesting content!

We hope you enjoy reading our posts and find them helpful. Feel free to leave comments and share your thoughts with us.'),
('Getting Started with React', 'React is a popular JavaScript library for building user interfaces. It was developed by Facebook and has gained widespread adoption in the web development community.

In this post, we will cover the basics of React and how to get started with it. We will discuss components, props, state, and other fundamental concepts.

By the end of this post, you will have a good understanding of React and be ready to start building your own applications.');