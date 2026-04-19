import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const overdueItems     = transactions.filter(t => t.status === 'overdue').length;
  const recentTx         = [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  // Dynamic Circulation Flux Calculation (Last 12 days)
  const fluxData = [...Array(12)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (11 - i));
    const dateStr = d.toISOString().split('T')[0];
    // Count transactions that happened on this day
    return transactions.filter(t => (t.borrowedDate || t.createdAt).startsWith(dateStr)).length;
  });
  const maxFlux = Math.max(...fluxData, 1);
  const availableBooksPercent = totalBooks ? Math.round((availableBooks / totalBooks) * 100) : 0;
  
  // Spotlight book (the most recently updated volume)
  const featuredBook = books.length > 0 ? [...books].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] : null;

  if (loading) {
    return (
      <div className="flex flex-col gap-10 animate-pulse">
        <div className="h-24 bg-surface-container-low rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-surface-container-low rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 relative">
      
      {/* Hero Metric */}
      <section className="col-span-12 lg:col-span-8 bg-surface-container-low dark:bg-slate-900/40 rounded-xl p-8 flex flex-col gap-8 relative overflow-hidden border border-transparent custom-shadow-hover transition-all duration-300">
        <div className="flex justify-between items-start z-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-outline font-black mb-2">Circulation Flux</p>
            <h3 className="text-5xl font-black text-[#1A365D] dark:text-white font-headline tracking-tighter">{totalBooks} <span className="text-base font-bold text-tertiary-fixed-dim tracking-normal ml-2">Total Managed</span></h3>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-1.5 bg-primary/10 dark:bg-primary-fixed/10 border border-primary/20 rounded-full text-[11px] font-bold text-primary dark:text-primary-fixed uppercase tracking-wider">{availableBooksPercent}% Available</span>
          </div>
        </div>
        <div className="h-48 w-full mt-auto flex items-end gap-1.5 relative z-10">
          {fluxData.map((val, i) => {
             const height = Math.max(10, Math.round((val / maxFlux) * 100));
             const isLast = i === fluxData.length - 1;
             return (
               <div 
                 key={i} 
                 className={`flex-1 rounded-t-sm transition-all duration-500 hover:brightness-110 shadow-sm
                   ${isLast 
                     ? 'bg-gradient-to-t from-primary/80 to-primary-container shadow-lg brightness-110 h-[92%]' 
                     : 'bg-primary/20 hover:bg-primary/40'
                   }`}
                 style={{ height: isLast ? undefined : `${height}%` }}
               ></div>
             );
          })}
        </div>
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      {/* Quick Action Bento */}
      <section className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
        <Link to="/books" className="col-span-2 bg-gradient-to-br from-tertiary via-tertiary-dim to-[#004a74] p-6 rounded-xl text-white flex flex-col justify-between aspect-[16/7] group transition-all duration-300 hover:shadow-xl active:scale-[0.98]">
          <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-300">add_circle</span>
          <div className="text-left">
            <p className="text-xs opacity-70 font-semibold tracking-wide uppercase">New Volume</p>
            <h4 className="text-2xl font-black font-headline tracking-tight">Ingest Archive</h4>
          </div>
        </Link>
        <Link to="/members" className="bg-surface-container-low dark:bg-slate-900/40 p-6 rounded-xl flex flex-col justify-between aspect-square border border-transparent hover:border-primary/20 custom-shadow-hover transition-all group active:scale-[0.98]">
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">group</span>
          <p className="text-[11px] font-black text-on-surface dark:text-white uppercase tracking-widest">{activeMembers} Active Users</p>
        </Link>
        <Link to="/transactions" className="bg-surface-container-low dark:bg-slate-900/40 p-6 rounded-xl flex flex-col justify-between aspect-square border border-transparent hover:border-error/20 custom-shadow-hover transition-all group active:scale-[0.98]">
          <span className="material-symbols-outlined text-error group-hover:scale-110 transition-transform">report_problem</span>
          <p className="text-[11px] font-black text-on-surface dark:text-white uppercase tracking-widest">{overdueItems} Alerts</p>
        </Link>
      </section>

      {/* Activity List */}
      <section className="col-span-12 lg:col-span-7 bg-surface-container-low dark:bg-slate-900/40 rounded-xl p-8 border border-transparent custom-shadow-hover transition-all duration-300">
        <div className="flex justify-between items-center mb-10 border-b border-outline/5 dark:border-white/10 pb-6">
          <h3 className="text-2xl font-black font-headline text-on-surface dark:text-white">Live Operations</h3>
          <Link to="/transactions" className="text-[11px] font-black text-primary dark:text-primary-container uppercase tracking-[0.15em] hover:underline decoration-2 underline-offset-4">View Master Log</Link>
        </div>
        
        <div className="space-y-6">
          {recentTx.length === 0 ? (
            <div className="text-sm text-outline p-4 bg-surface-container rounded text-center">No recent activity.</div>
          ) : (
            recentTx.slice(0, 4).map(tx => (
              <div key={tx._id} className="flex items-center gap-6 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border
                  ${tx.status === 'borrowed' ? 'bg-tertiary/10 border-tertiary/10' : ''}
                  ${tx.status === 'returned' ? 'bg-primary/10 border-primary/10 dark:bg-primary-fixed/5' : ''}
                  ${tx.status === 'overdue' ? 'bg-error/10 border-error/10' : ''}
                `}>
                  <span className={`material-symbols-outlined transition-transform group-hover:scale-110
                    ${tx.status === 'borrowed' ? 'text-tertiary' : ''}
                    ${tx.status === 'returned' ? 'text-primary dark:text-primary-container' : ''}
                    ${tx.status === 'overdue' ? 'text-error' : ''}
                  `}>
                    {tx.status === 'borrowed' ? 'swap_horiz' : tx.status === 'returned' ? 'assignment_turned_in' : 'priority_high'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black text-on-surface dark:text-white tracking-tight">{tx.book?.title ?? 'Unknown Book'}</p>
                    <span className="text-[10px] text-outline font-black uppercase tracking-widest bg-surface-container-highest px-2 py-0.5 rounded">
                      {new Date(tx.borrowedDate || tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                    </span>
                  </div>
                  <p className="text-[13px] text-on-surface-variant font-medium mt-1">
                    {tx.member?.name ?? 'Unknown'} • <span className="uppercase font-bold tracking-wider">{tx.status}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Featured Collection Spotlight */}
      <section className="col-span-12 lg:col-span-5 bg-surface-container-low dark:bg-slate-900/40 rounded-xl p-8 flex flex-col border border-transparent custom-shadow-hover transition-all duration-300">
        <h3 className="text-2xl font-black font-headline text-on-surface dark:text-white mb-6">Volume Focus</h3>
        {featuredBook ? (
          <Link to="/books" className="bg-black/5 dark:bg-slate-950/40 rounded-xl p-6 border border-outline/10 dark:border-white/10 flex gap-6 shadow-inner group">
            <div className="w-28 h-40 bg-slate-800 rounded shadow-2xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 group-hover:scale-105 transition-transform flex items-center justify-center">
               {featuredBook.coverImage ? (
                 <img src={featuredBook.coverImage} alt={featuredBook.title} className="w-full h-full object-cover" />
               ) : (
                 <span className="material-symbols-outlined text-4xl text-white/50 group-hover:scale-110 transition-transform">menu_book</span>
               )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-tertiary dark:text-tertiary-fixed font-black mb-2">Recently Managed</span>
              <h4 className="text-lg font-black text-on-surface dark:text-white font-headline leading-tight line-clamp-2">{featuredBook.title}</h4>
              <p className="text-[12px] text-outline font-bold mt-2 line-clamp-1">{featuredBook.author || 'Catalogued Volume'}</p>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-black text-outline uppercase">Stock Status</span>
                  <span className="text-[11px] font-black text-primary">{Math.round((featuredBook.availableCopies / featuredBook.totalCopies) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary shadow-sm transition-all duration-1000" 
                    style={{ width: `${(featuredBook.availableCopies / featuredBook.totalCopies) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-black/5 dark:bg-slate-950/40 rounded-xl p-10 border border-outline/10 border-dashed text-center">
            <p className="text-sm font-bold text-outline">No volume in spotlight.</p>
          </div>
        )}

        <div className="mt-auto pt-8 border-t border-outline/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] text-outline font-black uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <p className="text-xl font-black text-on-surface dark:text-white">Active</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-outline font-black uppercase tracking-widest mb-1">System Load</p>
              <p className="text-xl font-black text-on-surface dark:text-white">Normal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual FAB */}
      <Link to="/books" className="fixed bottom-8 right-8 w-16 h-16 bg-primary hover:bg-primary-dim text-on-primary rounded-full shadow-[0_20px_50px_rgba(86,94,116,0.3)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 group">
        <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </Link>

    </div>
  );
};

export default Dashboard;
