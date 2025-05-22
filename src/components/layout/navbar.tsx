import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, Menu, Settings, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BrilliantLogo } from '@/components/common/brilliant-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const routes = [
  { name: 'Partner Profile', path: '/' },
  { name: 'Loan Opportunities', path: '/opportunities' },
  { name: 'Portfolio Management', path: '/portfolio' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-6">
          <BrilliantLogo className="h-8" />
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {routes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) => cn(
                  "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-muted-foreground"
                )}
              >
                {route.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-medium">ABC Lending</span>
                <span className="text-xs text-muted-foreground">Partner</span>
              </div>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-1">
            {routes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) => cn(
                  "block px-3 py-2 text-base font-medium rounded-md",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:bg-muted/50"
                )}
                onClick={() => setIsOpen(false)}
              >
                {route.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}