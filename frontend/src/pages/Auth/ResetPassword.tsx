import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/common/GlassCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { resetPassword } from '../../services/auth.service';
import { KeyRound } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!token) {
      setError('Invalid reset link.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000); // Redirect to login after 3s
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('Cannot reach the server. Make sure the backend is running on port 5000.');
      } else {
        setError(err?.response?.data?.message ?? 'Failed to reset password. The link might be expired.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background-light dark:bg-background-dark animate-fade-in relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none dark:bg-primary/10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none dark:bg-indigo-500/10" />

      <GlassCard className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 border-b border-border-light dark:border-border-dark pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.25)]">
            <KeyRound size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-text-primary-light dark:text-text-primary-dark">Set New Password</h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark px-4">
            Please enter your new desired password below.
          </p>
        </div>

        {success ? (
          <div className="text-center animate-fade-in">
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 rounded-md p-4 mb-6">
              <h3 className="font-semibold mb-1">Password Updated</h3>
              <p className="text-sm">Your password has been successfully reset. Redirecting to login...</p>
            </div>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

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
              Reset Password
            </Button>
          </form>
        )}

        {!success && (
          <div className="mt-8 text-center text-sm">
            <Link to="/" className="font-medium text-primary hover:text-primary-hover transition-colors">
              &larr; Back to Login
            </Link>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default ResetPassword;
