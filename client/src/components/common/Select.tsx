import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ label, value, options, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`flex flex-col gap-1.5 relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-[0.85rem] font-medium text-text-secondary-light tracking-wide dark:text-text-secondary-dark">
          {label}
        </label>
      )}
      <div 
        className="input-field cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown size={16} className={`text-text-secondary-light dark:text-text-secondary-dark transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 w-full bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-xl overflow-hidden animate-fade-in custom-scrollbar max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${value === opt.value ? 'bg-primary/5 text-primary font-medium' : 'text-text-primary-light dark:text-text-primary-dark'}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check size={14} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
