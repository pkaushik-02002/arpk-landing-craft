
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useWebsiteRequests } from '@/hooks/useWebsiteRequests';
import { logout } from '@/lib/auth';
import { Check, X, Clock, LogOut, Shield, Users, Globe, Sparkles } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { requests, loading, updateStatus } = useWebsiteRequests();
  const { toast } = useToast();

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected' | 'on-hold') => {
    const { error } = await updateStatus(requestId, newStatus);
    
    if (error) {
      toast({
        title: "Update Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status Updated",
        description: `Request has been ${newStatus}.`,
      });
    }
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto neon-border"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary neon-text" />
            <h1 className="text-xl font-semibold neon-text">Admin Dashboard</h1>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-xs neon-border">
              Admin
            </Badge>
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="neon-border">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card neon-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold neon-text">{totalRequests}</div>
              </div>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </CardContent>
          </Card>
          <Card className="glass-card neon-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div className="text-2xl font-bold text-yellow-400">{pendingRequests}</div>
              </div>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="glass-card neon-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <div className="text-2xl font-bold text-green-400">{approvedRequests}</div>
              </div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card className="glass-card neon-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-500" />
                <div className="text-2xl font-bold text-red-400">{rejectedRequests}</div>
              </div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Management */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="neon-text">Website Requests Management</span>
            </CardTitle>
            <CardDescription>
              Review and manage all website requests from clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No website requests found.
              </div>
            ) : (
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
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(request.id, 'approved')}
                            disabled={request.status === 'approved'}
                            className="neon-border"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(request.id, 'on-hold')}
                            disabled={request.status === 'on-hold'}
                            className="neon-border"
                          >
                            <Clock className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(request.id, 'rejected')}
                            disabled={request.status === 'rejected'}
                            className="neon-border"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="neon-text">Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.slice(0, 3).map((request, index) => (
                <div key={request.id} className="flex items-center space-x-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    request.status === 'approved' ? 'bg-green-500' :
                    request.status === 'pending' ? 'bg-yellow-500' :
                    request.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <span>Request "{request.title}" is {request.status}</span>
                  <span className="text-muted-foreground">{formatDate(request.createdAt)}</span>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="text-center text-muted-foreground">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
