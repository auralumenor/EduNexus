import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlassCard } from '../../components/common/GlassCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../services/auth.service';
import { UserPlus, BookOpen } from 'lucide-react';

const Register: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'librarian' as 'admin' | 'librarian',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      login(res.data.data.user, res.data.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('Cannot reach the server. Make sure the backend is running on port 5000.');
      } else {
        setError(err?.response?.data?.message ?? 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
      {/* Visual / Branding Side */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-12 bg-gradient-to-br from-indigo-50 to-white dark:from-[#0b0f19] dark:via-[#111827] dark:to-[#1a1f35] relative">
        <div className="max-w-md z-10 animate-fade-in relative">
          <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-br from-primary to-indigo-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.35)]">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-indigo-600 dark:from-white dark:to-indigo-300">
            Join the Platform
          </h1>
          <p className="text-lg text-center text-text-secondary-light dark:text-text-secondary-dark mb-10">
            Create your Digital Curator account and start managing your library today.
          </p>

          <div className="flex flex-col gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
              Manage thousands of books &amp; members
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
              Real-time borrow &amp; return tracking
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
              Automated overdue fine calculation
            </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 py-10 overflow-y-auto animate-fade-in">
        <GlassCard className="w-full max-w-lg mt-8 mb-8">
          <div className="flex items-center gap-4 mb-7 border-b border-border-light dark:border-border-dark pb-5">
            <div className="w-11 h-11 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
              <UserPlus size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Create Account</h2>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Fill in your details to request access
              </p>
            </div>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Jane Doe"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@library.edu"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Select
                label="Account Role"
                value={form.role}
                onChange={(val) => setForm(f => ({ ...f, role: val as 'admin' | 'librarian' }))}
                options={[
                  { label: 'Librarian', value: 'librarian' },
                  { label: 'Administrator', value: 'admin' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 6 characters"
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Re-enter password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Already have an account?{' '}
            <Link to="/" className="font-medium text-primary hover:text-primary-hover transition-colors">
              Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Register;
