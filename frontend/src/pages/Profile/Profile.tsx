import React, { useState } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateMe, updatePassword, deleteAccount } from '../../services/auth.service';
import { User, Lock, Trash2 } from 'lucide-react';
import { Tooltip } from '../../components/common/Tooltip';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { addToast } = useToast();

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateMe(profileForm);
      updateUser(profileForm);
      addToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    setIsUpdatingPass(true);
    try {
      await updatePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      addToast('Password updated securely!', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Failed to change password.', 'error');
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      addToast('Account wiped permanently. Goodbye!', 'info');
      logout();
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Failed to delete account.', 'error');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-3xl pb-12">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-text-primary-light dark:text-text-primary-dark">My Profile</h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Manage your personal settings, security, and credentials</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Profile Settings */}
        <GlassCard>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-4">
            <User size={20} className="text-primary" />
            Profile Information
          </h2>
          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="Full Name" 
                value={profileForm.name} 
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                required 
              />
              <Input 
                label="Email Address" 
                type="email" 
                value={profileForm.email} 
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} 
                required 
              />
            </div>
            <div className="flex justify-end mt-2">
              <Button type="submit" variant="primary" isLoading={isUpdatingProfile}>Save Changes</Button>
            </div>
          </form>
        </GlassCard>

        {/* Password Reset */}
        <GlassCard>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-4">
            <Lock size={20} className="text-primary" />
            Security
          </h2>
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <Input 
              label="Current Password" 
              type="password" 
              value={passForm.currentPassword} 
              onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })} 
              required 
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="New Password" 
                type="password" 
                value={passForm.newPassword} 
                onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })} 
                required 
              />
              <Input 
                label="Confirm New Password" 
                type="password" 
                value={passForm.confirmPassword} 
                onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })} 
                required 
              />
            </div>
            <div className="flex justify-end mt-2">
              <Button type="submit" variant="primary" className="!bg-indigo-600 hover:!bg-indigo-700 focus:!ring-indigo-600/20" isLoading={isUpdatingPass}>Change Password</Button>
            </div>
          </form>
        </GlassCard>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1">
                <Trash2 size={20} />
                Danger Zone
              </h2>
              <p className="text-sm text-red-600/80 dark:text-red-400/80">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Tooltip content="Warning: This action will permanently wipe your account." delay={4000} position="top">
              <Button variant="secondary" onClick={() => setShowDeleteModal(true)} className="!bg-red-100 !text-red-700 hover:!bg-red-200 !border-red-300 dark:!bg-red-500/10 dark:!text-red-400 dark:!border-red-500/30 dark:hover:!bg-red-500/20">
                Delete Account
              </Button>
            </Tooltip>
          </div>
        </div>

      </div>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Account Deletion">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Are you absolutely sure you want to delete your account? All of your personal configurations will be permanently wiped from the database.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleDeleteAccount} 
              isLoading={isDeleting}
              className="!bg-red-500 hover:!bg-red-600 focus:!ring-red-500/20"
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Profile;
