
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import {
  Globe,
  Plus,
  FileText,
  Settings,
  LogOut,
  User,
  Shield,
  BarChart3,
  Users,
  CreditCard,
  ChevronUp,
} from 'lucide-react';

export function AppSidebar() {
  const { user } = useAuth();
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

  const clientMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard/client",
      icon: BarChart3,
    },
    {
      title: "New Request",
      url: "#new-request",
      icon: Plus,
    },
    {
      title: "My Projects",
      url: "#projects",
      icon: FileText,
    },
    {
      title: "Billing",
      url: "#billing",
      icon: CreditCard,
    },
  ];

  const adminMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: BarChart3,
    },
    {
      title: "All Requests",
      url: "#requests",
      icon: FileText,
    },
    {
      title: "Clients",
      url: "#clients",
      icon: Users,
    },
    {
      title: "Settings",
      url: "#settings",
      icon: Settings,
    },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : clientMenuItems;

  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">WebStudio</h1>
          {user?.role === 'admin' && (
            <Shield className="h-4 w-4 text-primary" />
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.email ? getUserInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">
                    {user?.email ? getUserDisplayName(user.email) : 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role || 'client'}
                  </p>
                </div>
                <ChevronUp className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="top">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
