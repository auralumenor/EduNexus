import React, { useEffect, useState } from 'react';
import { BookOpen, Users, ArrowLeftRight, TrendingUp, AlertCircle } from 'lucide-react';
import { getBooks } from '../../services/book.service';
import { getMembers } from '../../services/user.service';
import { getTransactions } from '../../services/transaction.service';
import { Book, Member, Transaction } from '../../types';

const Dashboard: React.FC = () => {
  const [books, setBooks]               = useState<Book[]>([]);
  const [members, setMembers]           = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([getBooks(), getMembers(), getTransactions()])
      .then(([b, m, t]) => {
        setBooks(b.data.data);
        setMembers(m.data.data);
        setTransactions(t.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalBooks       = books.length;
  const availableBooks   = books.reduce((s, b) => s + b.availableCopies, 0);
  const activeMembers    = members.filter(m => m.status === 'active').length;
  const activeBorrows    = transactions.filter(t => t.status === 'borrowed').length;
  const overdueItems     = transactions.filter(t => t.status === 'overdue').length;
  const recentTx         = [...transactions].slice(0, 8);

  const statCards = [
    { label: 'Total Books',      value: totalBooks,     icon: BookOpen,       colorClass: 'text-blue-500 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-400/10' },
    { label: 'Available Copies', value: availableBooks, icon: TrendingUp,     colorClass: 'text-green-500 bg-green-500/10 dark:text-green-400 dark:bg-green-400/10' },
    { label: 'Active Members',   value: activeMembers,  icon: Users,          colorClass: 'text-purple-500 bg-purple-500/10 dark:text-purple-400 dark:bg-purple-400/10' },
    { label: 'Books Borrowed',   value: activeBorrows,  icon: ArrowLeftRight, colorClass: 'text-amber-500 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-400/10' },
    { label: 'Overdue Items',    value: overdueItems,   icon: AlertCircle,    colorClass: 'text-red-500 bg-red-500/10 dark:text-red-400 dark:bg-red-400/10' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1 text-text-primary-light dark:text-text-primary-dark">Dashboard Overview</h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Welcome back — here's what's happening in your library today.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200 dark:bg-card-dark animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map(({ label, value, icon: Icon, colorClass }) => (
            <div className="glass-card flex items-center gap-4 !p-5 hover:-translate-y-1 transition-transform duration-200" key={label}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold leading-none mb-1 text-text-primary-light dark:text-text-primary-dark">{value}</span>
                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium uppercase tracking-wide">{label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Transactions */}
        <div className="glass-card flex flex-col">
          <h2 className="text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">Recent Transactions</h2>
          {recentTx.length === 0 && !loading ? (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark py-4 text-center">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-8 px-8 sm:mx-0 sm:px-0">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase border-b border-border-light dark:border-border-dark">
                  <tr>
                    <th className="pb-3 font-semibold">Book</th>
                    <th className="pb-3 font-semibold">Member</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {recentTx.map(tx => (
                    <tr key={tx._id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 font-medium text-text-primary-light dark:text-text-primary-dark whitespace-nowrap">{tx.book?.title ?? '—'}</td>
                      <td className="py-3 text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap">{tx.member?.name ?? '—'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                          ${tx.status === 'borrowed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : ''}
                          ${tx.status === 'returned' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                          ${tx.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : ''}
                        `}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap">
                        {new Date(tx.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Members */}
        <div className="glass-card flex flex-col">
          <h2 className="text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">Recent Members</h2>
          {members.slice(0, 6).length === 0 && !loading ? (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark py-4 text-center">No members yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {members.slice(0, 6).map(m => (
                <div className="flex items-center gap-3 py-2 border-b border-border-light dark:border-border-dark last:border-0" key={m._id}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark truncate">{m.name}</span>
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-mono truncate">{m.membershipId}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize shrink-0
                    ${m.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                    ${m.status === 'suspended' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : ''}
                    ${m.status === 'expired' ? 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400' : ''}
                  `}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
