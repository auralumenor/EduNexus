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
    <div className="min-h-screen flex flex-col md:flex-row bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
      {/* Visual / Branding Side */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-12 bg-gradient-to-br from-indigo-50 to-white dark:from-[#0b0f19] dark:via-[#111827] dark:to-[#1a1f35] relative">
        <div className="max-w-md z-10 text-center animate-fade-in relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-indigo-500 rounded flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/30">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-300">
            EduNexus
          </h1>
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark">
            Enterprise Library Management Platform
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 animate-fade-in">
        <GlassCard className="w-full max-w-md">
          <div className="mb-8 border-b border-border-light dark:border-border-dark pb-6">
            <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Access your library administration panel
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
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

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-hover transition-colors">
              Request Access
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
