import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';



export default function AuthLobby({ onGoBack, onGuest }) { // <-- Add onGuest here 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // The Engine for Email/Password
  const handleEmailAuth = async (e, isSignUp) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // This is the magic Supabase call!
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage(isSignUp ? '✅ Check your email to confirm!' : '✅ Welcome back!');
    }
    setLoading(false);
  };

  // The Engine for Google (It really is just one line!)
  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setMessage(`❌ ${error.message}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800">FinShot</h1>
          <p className="text-slate-500 font-medium mt-2">
            Create a free account to securely encrypt and save your financial snapshots to the cloud.
          </p>
        </div>

        {/* The Google Button */}
        <button 
          onClick={handleGoogleAuth}
          className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl mb-6 hover:bg-slate-50 hover:border-indigo-300 transition flex justify-center items-center gap-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or email</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* The Email Form */}
        <form className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          
          <div className="flex gap-3 mt-2">
            <button 
              onClick={(e) => handleEmailAuth(e, false)} 
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? '...' : 'Log In'}
            </button>
            <button 
              onClick={(e) => handleEmailAuth(e, true)} 
              disabled={loading}
              className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition disabled:opacity-50"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Status Message */}
        {message && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg text-center text-sm font-bold text-slate-700">
            {message}
          </div>
        )}
        {/* THE GUEST MODE BUTTON (Moved OUTSIDE the message block!) */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 mb-3">Just want to test the app?</p>
          <button 
            onClick={onGuest}
            className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
          >
            🕵️‍♂️ Continue as Guest (Sandbox Mode)
          </button>
        </div>

      </div>
    </div>
  );
}