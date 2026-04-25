import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { getMembers, createMember, updateMember, deleteMember } from '../../services/user.service';
import { Member } from '../../types';
import { Users as UsersIcon, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Tooltip } from '../../components/common/Tooltip';

const Users: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { addToast } = useToast();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMember(editingId, form);
      } else {
        await createMember(form);
      }
      setForm({ name: '', email: '', phone: '' });
      setEditingId(null);
      fetchMembers();
      addToast(editingId ? 'Member updated successfully!' : 'Member added successfully!', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Error processing member.', 'error');
      console.error('Error saving member', err);
    }
  };

  const handleEdit = (m: Member) => {
    setForm({ name: m.name, email: m.email, phone: m.phone || '' });
    setEditingId(m._id);
  };

  const executeDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteMember(userToDelete);
      fetchMembers();
      addToast('Member permanently deleted.', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Error deleting member', 'error');
      console.error('Error deleting member', err);
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-text-primary-light dark:text-text-primary-dark">Members</h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Manage library patrons and memberships</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-6">
            <h2 className="text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">
              {editingId ? 'Edit Member' : 'Add New Member'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Phone (Optional)"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1">
                  {editingId ? 'Update' : 'Add'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ name: '', email: '', phone: '' });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className="!p-0 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
              <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Directory</h2>
              <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 py-1 px-3 rounded-full text-xs font-semibold">
                {members.length} Total
              </span>
            </div>
            
            {loading ? (
              <p className="p-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">Loading members...</p>
            ) : members.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon size={48} className="mx-auto text-border-light dark:text-border-dark mb-4" />
                <p className="text-text-secondary-light dark:text-text-secondary-dark">No members found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase bg-black/[0.02] dark:bg-white/[0.02]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Member</th>
                      <th className="px-6 py-4 font-semibold">Contact</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {members.map(m => (
                      <tr key={m._id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                              {m.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-text-primary-light dark:text-text-primary-dark">{m.name}</span>
                              <span className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">{m.membershipId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap">
                          <div className="flex flex-col">
                            <span>{m.email}</span>
                            {m.phone && <span className="text-xs">{m.phone}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                            ${m.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                            ${m.status === 'suspended' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : ''}
                            ${m.status === 'expired' ? 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400' : ''}
                          `}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip content="Edit Member" delay={4000} position="top">
                              <button onClick={() => handleEdit(m)} className="p-2 text-text-secondary-light hover:text-primary dark:text-text-secondary-dark transition-colors" title="Edit">
                                <Edit2 size={16} />
                              </button>
                            </Tooltip>
                            <Tooltip content="Delete Member" delay={4000} position="top">
                              <button onClick={() => setUserToDelete(m._id)} className="p-2 text-text-secondary-light hover:text-red-500 dark:text-text-secondary-dark transition-colors" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      <Modal isOpen={!!userToDelete} onClose={() => setUserToDelete(null)} title="Delete Member">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Are you sure you want to delete this member? All records associated with them will be orphaned.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setUserToDelete(null)}>Cancel</Button>
            <Button variant="primary" onClick={executeDelete} className="!bg-red-500 hover:!bg-red-600 focus:!ring-red-500/20">
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Users;
