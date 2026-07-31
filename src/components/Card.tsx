import type { PropsWithChildren } from 'react';

interface CardProps {
  title?: string;
  className?: string;
}

export function Card({ title, className = '', children }: PropsWithChildren<CardProps>) {
  return (
    <div className={`rounded-xl bg-slate-800/80 border border-slate-700 p-4 shadow ${className}`}>
      {title && <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>}
      {children}
    </div>
  );
}
