import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto mt-4 px-4 pb-12 animate-fade-in relative z-10">
      
      {/* Header Profile Layer */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center gap-6 p-8 bg-surface-container-lowest dark:bg-slate-900 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        <div className="w-16 h-16 rounded-2xl bg-primary-container text-primary flex items-center justify-center border border-primary/10 shadow-inner shrink-0 rotate-3 z-10">
          <span className="material-symbols-outlined text-4xl">menu_book</span>
        </div>
        <div className="z-10">
          <h1 className="text-3xl font-black font-headline text-on-surface dark:text-white tracking-tight">System Documentation</h1>
          <p className="text-sm font-medium text-outline mt-1 max-w-xl">
            Complete API reference and architecture guides for the EduNexus unified enterprise library system.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Intro */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl p-6 border border-outline-variant/20 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-lg font-bold font-headline text-on-surface dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">architecture</span> Arc Logic
            </h3>
            <p className="text-sm text-on-surface-variant dark:text-gray-300 leading-relaxed mb-4">
              The EduNexus system is built on an event-driven microservices core optimized for high-throughput transactional states. The client utilizes an asymmetric React architecture utilizing the "Stitch" design system, specifically implementing the Unified Enterprise Library System UI principles (No-Line Rule, Tonal Surfaces).
            </p>
            <div className="mt-4 bg-surface px-4 py-3 rounded-lg border border-outline-variant/10">
               <code className="text-xs font-mono text-primary-fixed dark:text-primary">npm run dev</code>
               <p className="text-[10px] uppercase font-bold text-outline mt-2 tracking-wider">Starts the Local Development Container</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl p-6 border border-outline-variant/20 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-lg font-bold font-headline text-on-surface dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">hub</span> Routing Modules
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><span className="material-symbols-outlined text-[14px]">arrow_right_alt</span></span>
                <div>
                   <p className="text-sm font-bold text-on-surface dark:text-white">/books</p>
                   <p className="text-xs text-outline font-medium">Bento grid based visual catalog indexing the master volume tree.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><span className="material-symbols-outlined text-[14px]">arrow_right_alt</span></span>
                <div>
                   <p className="text-sm font-bold text-on-surface dark:text-white">/members</p>
                   <p className="text-xs text-outline font-medium">Authentication controlled access mapping representing active system actors.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5"><span className="material-symbols-outlined text-[14px]">arrow_right_alt</span></span>
                <div>
                   <p className="text-sm font-bold text-on-surface dark:text-white">/transactions</p>
                   <p className="text-xs text-outline font-medium">The immutable log layer of active check-outs and structural returns.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface-container-low dark:bg-slate-800 rounded-2xl p-6 border border-outline-variant/10 shadow-inner">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-outline mb-4">Quick Navigation</h3>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm font-medium text-primary hover:underline hover:text-primary-dim transition-colors flex items-center gap-2">
                 <span className="material-symbols-outlined text-[18px]">data_object</span> API Endpoints
              </a>
              <a href="#" className="text-sm font-medium text-primary hover:underline hover:text-primary-dim transition-colors flex items-center gap-2">
                 <span className="material-symbols-outlined text-[18px]">verified_user</span> Auth Schemas
              </a>
              <a href="#" className="text-sm font-medium text-primary hover:underline hover:text-primary-dim transition-colors flex items-center gap-2">
                 <span className="material-symbols-outlined text-[18px]">palette</span> Design System
              </a>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary to-primary-dim rounded-2xl p-6 text-white shadow-md relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500 pointer-events-none">
               <span className="material-symbols-outlined text-9xl">forum</span>
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-primary-container mb-2 relative z-10">Community Hub</h3>
            <p className="text-sm font-medium mb-4 relative z-10 leading-relaxed">Join the developer Slack channel for real-time architectural discussions and bug triage.</p>
            <button className="bg-white text-primary text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:shadow active:scale-95 transition-all relative z-10 w-full">Join the Conversation</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Documentation;
