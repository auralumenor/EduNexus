import React from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { Info, Target, Cpu, BookOpen, Quote } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-white dark:to-indigo-300">
          EduNexus
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark max-w-2xl leading-relaxed">
          The next-generation editorial platform for modern learning environments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main About Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GlassCard className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-bold">About Our LMS</h2>
            </div>
            
            <p className="text-lg leading-relaxed text-text-primary-light dark:text-text-primary-dark mb-6">
              Our Learning Management System (LMS) is designed to make education accessible, engaging, and resource‑rich. 
              It provides a modern, user‑friendly platform where learners and educators can connect, share knowledge, 
              and access diverse learning materials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border-light dark:border-border-dark">
                <h3 className="font-bold flex items-center gap-2 mb-2 text-primary">
                  <Target size={18} /> Personalized Learning
                </h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Learners can track progress, access courses, and manage assignments with ease.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border-light dark:border-border-dark">
                <h3 className="font-bold flex items-center gap-2 mb-2 text-primary">
                  <BookOpen size={18} /> Extensive Resources
                </h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Integrated with Open Library, giving access to millions of books and references.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border-light dark:border-border-dark">
                <h3 className="font-bold flex items-center gap-2 mb-2 text-primary">
                  <Cpu size={18} /> Educator Tools
                </h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Course creation, grading, and analytics to support effective teaching.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-border-light dark:border-border-dark">
                <h3 className="font-bold flex items-center gap-2 mb-2 text-primary">
                  <Info size={18} /> Accessible Anywhere
                </h3>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Designed for both online and blended learning, available anytime.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-l-4 border-l-primary">
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
               <Quote size={20} className="text-primary" /> Behind the Scenes
             </h3>
             <p className="leading-relaxed text-text-secondary-light dark:text-text-secondary-dark italic">
               This platform’s architecture and design system layout was co‑authored seamlessly by with the help of, 
               an agentic AI model. This ensures responsive integration, real‑time styling conversions with Tailwind, 
               and robust external API interactions — making the LMS not only learner‑friendly but also technically advanced.
             </p>
          </GlassCard>
        </div>

        {/* Sidebar acknowledgments */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-6 bg-gradient-to-br from-indigo-500/10 to-primary/10 border-primary/20">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-primary" /> Core Integration
            </h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              We proudly acknowledge <strong>Open Library</strong> for providing open access to educational resources that enhance the learning experience.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-bold mb-4">Collaboration Features</h3>
            <ul className="flex flex-col gap-3 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Discussion Forums for peer-to-peer knowledge sharing.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Direct messaging between instructors and students.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Group activities and shared collaborative projects.</span>
              </li>
            </ul>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default About;
