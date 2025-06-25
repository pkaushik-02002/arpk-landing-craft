
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Globe, CheckCircle, XCircle, Clock, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from Supabase
  const [requests, setRequests] = useState([
    {
      id: 1,
      projectName: 'E-commerce Website',
      clientEmail: 'client1@example.com',
      description: 'Online store for handmade crafts',
      budget: '$5000',
      deadline: '2024-02-15',
      status: 'pending',
      submittedAt: '2024-01-15'
    },
    {
      id: 2,
      projectName: 'Portfolio Site',
      clientEmail: 'client2@example.com',
      description: 'Personal portfolio for a photographer',
      budget: '$2000',
      deadline: '2024-02-01',
      status: 'approved',
      submittedAt: '2024-01-10'
    },
    {
      id: 3,
      projectName: 'Restaurant Website',
      clientEmail: 'client3@example.com',
      description: 'Website with online ordering system',
      budget: '$7500',
      deadline: '2024-03-01',
      status: 'on_hold',
      submittedAt: '2024-01-12'
    }
  ]);

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

  const updateRequestStatus = (requestId: number, newStatus: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Request has been ${newStatus}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary', icon: Clock },
      approved: { variant: 'default', icon: CheckCircle },
      rejected: { variant: 'destructive', icon: XCircle },
      on_hold: { variant: 'outline', icon: Pause }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage website requests</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Website Requests
            </CardTitle>
            <CardDescription>
              Review and manage all website development requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="p-6 border rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{request.projectName}</h3>
                      <p className="text-sm text-muted-foreground">Client: {request.clientEmail}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <p className="text-sm mb-4">{request.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium">Budget:</span> {request.budget}
                    </div>
                    <div>
                      <span className="font-medium">Deadline:</span> {request.deadline}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {request.submittedAt}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      onClick={() => updateRequestStatus(request.id, 'approved')}
                      disabled={request.status === 'approved'}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => updateRequestStatus(request.id, 'rejected')}
                      disabled={request.status === 'rejected'}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateRequestStatus(request.id, 'on_hold')}
                      disabled={request.status === 'on_hold'}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Hold
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
