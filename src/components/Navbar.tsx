
import { useState } from 'react';
import { Menu, X, Home, User, Briefcase, Mail, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NavBar } from '@/components/ui/tubelight-navbar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      toast({
        title: "Logout Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
  };

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email: string) => {
    return email.split('@')[0];
  };

  const navItems = [
    { name: "Home", url: "#hero", icon: Home },
    { name: "Services", url: "#services", icon: Briefcase },
    { name: "About", url: "#about", icon: User },
    { name: "Contact", url: "#contact", icon: Mail },
    // Add Admin link only for admin users
    ...(user?.role === 'admin' ? [{ name: "Admin", url: "/dashboard/admin", icon: Shield }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary">ARPK</div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex justify-center flex-1">
            <NavBar items={navItems} />
          </div>

          {/* Desktop Auth/Profile Section - Right */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email ? getUserInitials(user.email) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user.email ? getUserDisplayName(user.email) : 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role || 'client'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/client')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {loading ? (
                <div className="px-3 py-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : user ? (
                <div className="pt-2 space-y-2">
                  <div className="px-3 py-2 border-t border-border">
                    <p className="text-sm font-medium">
                      {user.email ? getUserDisplayName(user.email) : 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role || 'client'}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/client');
                      setIsOpen(false);
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="w-full justify-start">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
