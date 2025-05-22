import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className={cn("flex-1 container mx-auto py-6 px-4", className)}>
        {children}
      </main>
      <footer className="border-t py-4 bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Brilliant Financial. All rights reserved.
        </div>
      </footer>
    </div>
  );
}