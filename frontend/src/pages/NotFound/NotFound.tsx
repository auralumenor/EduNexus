import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', gap: '24px', background: 'var(--bg-color)', color: 'var(--text-primary)',
    fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '24px',
  }}>
    <div style={{ opacity: 0.15 }}><BookOpen size={80} /></div>
    <div>
      <h1 style={{ fontSize: '5rem', fontWeight: 800, lineHeight: 1, margin: 0, color: 'var(--accent-color)' }}>404</h1>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: 8 }}>Page not found</h2>
      <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
    </div>
    <Link
      to="/dashboard"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'var(--accent-color)', color: '#fff',
        padding: '10px 20px', borderRadius: '8px', textDecoration: 'none',
        fontWeight: 500, fontSize: '0.875rem',
        transition: 'background 0.2s',
      }}
    >
      <ArrowLeft size={16} /> Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
