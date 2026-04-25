import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlassCard } from '../../components/common/GlassCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/auth.service';
import { BookOpen } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail]       = useState('admin@library.edu');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginUser({ email, password });
      login(response.data.data.user, response.data.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('Cannot reach the server. Make sure the backend is running on port 5000.');
      } else {
        setError(err?.response?.data?.message ?? 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface transition-colors duration-300">
      {/* Visual / Branding Side */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-12 bg-surface-container-low dark:bg-slate-900/60 relative border-r border-outline-variant/10">
        <div className="max-w-md z-10 text-center animate-fade-in relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dim rounded flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-500">
            <BookOpen size={32} className="text-on-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4 text-on-surface font-headline italic">
            EduNexus
          </h1>
          <p className="text-lg text-outline font-medium tracking-wide">
            Enterprise Library Management Platform
          </p>
        </div>
        {/* Decorative elements to add depth without layout shifts */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 animate-fade-in relative z-10 bg-surface">
        <GlassCard className="w-full max-w-md border-outline-variant/20">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black mb-2 font-headline tracking-tight">Welcome Back</h2>
            <p className="text-sm text-outline font-medium">
              Access your library administration panel
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@library.edu"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 text-error rounded-xl p-4 text-xs font-bold flex items-start gap-3 animate-shake">
                <span className="material-symbols-outlined text-sm pt-0.5">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-black text-primary hover:text-primary-dim uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">
                Recovery Protocol?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-2 !py-3 font-black uppercase tracking-widest"
            >
              Secure Sign In
            </Button>
          </form>

          <div className="mt-10 text-center text-xs font-bold text-outline">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dim uppercase tracking-widest ml-1 hover:underline decoration-2 underline-offset-4 transition-all">
              Request Access
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
