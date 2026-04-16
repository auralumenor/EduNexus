import React from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Laptop, ShieldCheck, Mail, Globe, Code, Cpu } from 'lucide-react';
import { Tooltip } from '../../components/common/Tooltip';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-3xl pb-12">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-text-primary-light dark:text-text-primary-dark">Settings</h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Manage your app appearance and view system information</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Appearance Settings */}
        <GlassCard>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-4">
            <Sun size={20} className="text-primary" />
            Appearance
          </h2>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Customize the interface theme. Select system to sync with your OS preferences.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Tooltip content="Forces the interface into Light Mode" delay={4000} position="top">
                <button 
                  onClick={() => setTheme('light')}
                  className={`w-full flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-light dark:border-border-dark hover:border-primary/50'}`}
                >
                  <Sun size={24} className={theme === 'light' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'} />
                  <span className={`text-sm font-medium ${theme === 'light' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>Light Mode</span>
                </button>
              </Tooltip>

              <Tooltip content="Forces the interface into Dark Mode" delay={4000} position="top">
                <button 
                  onClick={() => setTheme('dark')}
                  className={`w-full flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-light dark:border-border-dark hover:border-primary/50'}`}
                >
                  <Moon size={24} className={theme === 'dark' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'} />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>Dark Mode</span>
                </button>
              </Tooltip>

              <Tooltip content="Syncs automatically with your OS settings" delay={4000} position="top">
                <button 
                  onClick={() => setTheme('system')}
                  className={`w-full flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border-light dark:border-border-dark hover:border-primary/50'}`}
                >
                  <Laptop size={24} className={theme === 'system' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'} />
                  <span className={`text-sm font-medium ${theme === 'system' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>System Sync</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </GlassCard>

        {/* About App */}
        <GlassCard>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark border-b border-border-light dark:border-border-dark pb-4">
            <ShieldCheck size={20} className="text-green-500" />
            About EduNexus
          </h2>
          <div className="flex flex-col gap-6">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark border-l-4 border-indigo-500 pl-4 py-1 italic">
              "This platform's architecture and design system layout was co-authored seamlessly by Antigravity—a highly capable agentic AI model by Google DeepMind—ensuring responsive integration, real-time styling conversions with Tailwind, and complex external API interactions."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm pt-2">
              <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                <Cpu size={16} className="text-primary shrink-0" />
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark min-w-[100px]">Architect</span>
                <span className="font-semibold text-indigo-500">Antigravity (Google DeepMind)</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                <Code size={16} className="text-primary shrink-0" />
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark min-w-[100px]">Version</span>
                <span>1.0.0-enterprise</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                <Code size={16} className="text-primary shrink-0" />
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark min-w-[100px]">Frontend</span>
                <span>React + Vite (Tailwind)</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                <Code size={16} className="text-primary shrink-0" />
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark min-w-[100px]">Backend</span>
                <span>Node.js + Express</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
                <Code size={16} className="text-primary shrink-0" />
                <span className="font-medium text-text-primary-light dark:text-text-primary-dark min-w-[100px]">Database</span>
                <span>MongoDB (Mongoose)</span>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border-light dark:border-border-dark text-xs text-text-secondary-light dark:text-text-secondary-dark flex flex-col gap-1">
              <span className="flex items-center gap-2"><Globe size={14} /> Open Source Reference Implementation 2026.</span>
              <span className="flex items-center gap-2"><Mail size={14} /> Contact system administrator for any internal database migrations or SMTP issues.</span>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Settings;
