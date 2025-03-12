import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, LogOut } from 'lucide-react';

export function AuthButtons() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const email = prompt('Enter your email');
    const password = prompt('Enter your password');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
      return;
    }

    if (data) window.location.reload();
  };

  const handleSignup = async () => {
    setError(null);
    const email = prompt('Enter your email');
    const password = prompt('Enter your password');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    alert('Check your email to confirm your account');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <div className="text-sm text-red-600 mb-2 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors duration-200"
        >
          <LogIn size={18} strokeWidth={1.5} />
          <span className="font-medium">Login</span>
        </button>
        <button
          onClick={handleSignup}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <UserPlus size={18} strokeWidth={1.5} />
          <span className="font-medium">Sign Up</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}