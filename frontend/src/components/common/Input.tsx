import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[0.85rem] font-medium text-text-secondary-light tracking-wide dark:text-text-secondary-dark">
        {label}
      </label>
      <input className="input-field" {...props} />
    </div>
  );
};
