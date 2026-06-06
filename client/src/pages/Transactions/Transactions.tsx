import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { getTransactions, returnBook } from '../../services/transaction.service';
import { Transaction } from '../../types';
import { ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app we'd have search params for the backend, doing simple client filter here
  const [filter, setFilter] = useState<'all' | 'borrowed' | 'overdue' | 'returned'>('all');
  const { addToast } = useToast();
  const [returnId, setReturnId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const executeReturn = async () => {
    if (!returnId) return;
    try {
      await returnBook(returnId);
      fetchTransactions();
      addToast('Book returned successfully!', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Error returning book', 'error');
      console.error('Error returning book', err);
    } finally {
      setReturnId(null);
    }
  };

  const filteredTx = transactions.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-text-primary-light dark:text-text-primary-dark">Transactions</h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Track borrowed books and manage returns</p>
        </div>

        {/* Filters */}
        <div className="flex bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
          {['all', 'borrowed', 'overdue', 'returned'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex-1 sm:flex-none capitalize text-sm font-medium px-4 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filter === f 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-secondary-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:text-text-primary-dark hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="!p-0 overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">Loading transactions...</p>
        ) : filteredTx.length === 0 ? (
          <div className="text-center py-12">
            <ArrowLeftRight size={48} className="mx-auto text-border-light dark:text-border-dark mb-4" />
            <p className="text-text-secondary-light dark:text-text-secondary-dark">No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase bg-black/[0.02] dark:bg-white/[0.02] border-b border-border-light dark:border-border-dark">
                <tr>
                  <th className="px-6 py-4 font-semibold">Transaction ID</th>
                  <th className="px-6 py-4 font-semibold">Book</th>
                  <th className="px-6 py-4 font-semibold">Member</th>
                  <th className="px-6 py-4 font-semibold">Borrow Date</th>
                  <th className="px-6 py-4 font-semibold">Due Date</th>
                  <th className="px-6 py-4 font-semibold">Fine</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {filteredTx.map(tx => (
                  <tr key={tx._id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-text-secondary-light dark:text-text-secondary-dark">{tx._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium text-text-primary-light dark:text-text-primary-dark">
                      {tx.book?.title ?? <span className="text-red-500 text-xs italic">Deleted Book</span>}
                    </td>
                    <td className="px-6 py-4">
                      {tx.member?.name ?? <span className="text-red-500 text-xs italic">Deleted Member</span>}
                    </td>
                    <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                      {new Date(tx.borrowedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">
                      {new Date(tx.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {tx.fine > 0 
                        ? <span className="text-red-600 dark:text-red-400">${tx.fine.toFixed(2)}</span>
                        : <span className="text-green-600 dark:text-green-400">$0.00</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize
                        ${tx.status === 'borrowed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' : ''}
                        ${tx.status === 'returned' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}
                        ${tx.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : ''}
                      `}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.status !== 'returned' ? (
                        <Button 
                          variant="primary" 
                          onClick={() => setReturnId(tx._id)}
                          className="!py-1.5 !px-3 !bg-green-500 hover:!bg-green-600 focus:!ring-green-500/20 shadow-sm"
                        >
                          <CheckCircle2 size={16} /> Return
                        </Button>
                      ) : (
                        <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      <Modal isOpen={!!returnId} onClose={() => setReturnId(null)} title="Confirm Book Return">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Are you sure you want to mark this transaction as completed? Ensure the physical book has been returned to the library in good condition.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setReturnId(null)}>Cancel</Button>
            <Button variant="primary" onClick={executeReturn} className="!bg-green-500 hover:!bg-green-600 focus:!ring-green-500/20">
              Confirm Return
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Transactions;
