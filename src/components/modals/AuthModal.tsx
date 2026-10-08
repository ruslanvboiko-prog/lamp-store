import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export default function AuthModal() {
  const isAuthModalOpen = useAuthStore(s => s.isAuthModalOpen);
  const setAuthModalOpen = useAuthStore(s => s.setAuthModalOpen);
  const login = useAuthStore(s => s.login);
  
  const [email, setEmail] = useState('');

  if (!isAuthModalOpen) return null;

  // Imitation of a login process (in a real app, you would call an API)
  const handleFakeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Imitation of extracting username from email (e.g., admin@mail.com -> admin)
      const name = email.split('@')[0];
      login(name);
    }
  };

  // Imitation of a Google login process
  const handleGoogleLogin = () => {
    login('Google User');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#14151C] rounded-2xl border border-neutral-800 p-6 relative shadow-2xl">
        {/* Кнопка закриття */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-space font-bold text-white mb-6">Welcome back</h2>

        {/* Imitation of a login form */}
        <form onSubmit={handleFakeLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#0B0C10] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#0B0C10] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>
          
          <button type="submit" className="w-full py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-neutral-200 transition-colors">
            Sign In
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-neutral-800"></div>
          <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">or</span>
          <div className="flex-1 h-px bg-neutral-800"></div>
        </div>

        {/* Google Button (with original SVG logo) */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 bg-[#0B0C10] text-white border border-neutral-800 font-bold text-sm rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}