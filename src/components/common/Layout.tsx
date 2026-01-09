import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      <main className="max-w-lg mx-auto px-6 py-12 md:py-16">
        {children}
      </main>
    </div>
  );
}
