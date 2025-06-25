
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/auth';
import { Check, X, Clock, LogOut, Shield, Users, Globe } from 'lucide-react';

interface WebsiteRequest {
  id: string;
  title: string;
  description: string;
  requirements: string;
  status: 'pending' | 'approved' | 'rejected' | 'on-hold';
  createdAt: string;
  clientEmail: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data - replace with actual data from Supabase
  const [requests, setRequests] = useState<WebsiteRequest[]>([
    {
      id: '1',
      title: 'E-commerce Website',
      description: 'Online store for selling handmade crafts',
      requirements: 'Payment integration, inventory management, responsive design',
      status: 'approved',
      createdAt: '2024-01-15',
      clientEmail: 'client1@example.com'
    },
    {
      id: '2',
      title: 'Portfolio Website',
      description: 'Personal portfolio for photography',
      requirements: 'Gallery, contact form, blog section',
      status: 'pending',
      createdAt: '2024-01-20',
      clientEmail: 'client2@example.com'
    },
    {
      id: '3',
      title: 'Restaurant Website',
      description: 'Website for a local restaurant with online ordering',
      requirements: 'Menu display, online ordering, reservation system',
      status: 'on-hold',
      createdAt: '2024-01-18',
      clientEmail: 'client3@example.com'
    }
  ]);

  const handleStatusChange = (requestId: string, newStatus: 'approved' | 'rejected' | 'on-hold') => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: newStatus }
          : req
      )
    );

    toast({
      title: "Status Updated",
      description: `Request has been ${newStatus}.`,
    });
  };

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      toast({
        title: "Logout Failed",
        description: error,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'on-hold': return 'secondary';
      default: return 'outline';
    }
  };

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{totalRequests}</div>
              </div>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
              </div>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
              </div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-500" />
                <div className="text-2xl font-bold text-red-600">{rejectedRequests}</div>
              </div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Website Requests Management</span>
            </CardTitle>
            <CardDescription>
              Review and manage all website requests from clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.clientEmail}</TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{request.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(request.id, 'approved')}
                          disabled={request.status === 'approved'}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(request.id, 'on-hold')}
                          disabled={request.status === 'on-hold'}
                        >
                          <Clock className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(request.id, 'rejected')}
                          disabled={request.status === 'rejected'}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Approved request from client1@example.com</span>
                <span className="text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>New request submitted by client2@example.com</span>
                <span className="text-muted-foreground">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Put request on hold for client3@example.com</span>
                <span className="text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
