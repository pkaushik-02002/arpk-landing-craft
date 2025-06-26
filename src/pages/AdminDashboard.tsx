
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useWebsiteRequests } from '@/hooks/useWebsiteRequests';
import { Check, X, Clock, Users, Globe, BarChart3, Activity, CheckCircle, XCircle } from 'lucide-react';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'on-hold': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'on-hold': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-secondary/20">
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-2 flex-1">
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              <Badge variant="secondary" className="text-xs">Admin</Badge>
            </div>
          </header>

          <main className="flex-1 space-y-4 p-4 md:p-6">
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalRequests}</div>
                      <p className="text-xs text-muted-foreground">Total Requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-500">{pendingRequests}</div>
                      <p className="text-xs text-muted-foreground">Pending Review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-500">{approvedRequests}</div>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <XCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">{rejectedRequests}</div>
                      <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Requests Management */}
            <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
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
                {requests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No website requests found</h3>
                    <p className="text-sm">Requests will appear here when clients submit them.</p>
                  </div>
                ) : (
                  <div className="rounded-md border border-border/50">
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
                              <Badge variant={getStatusColor(request.status)} className="flex items-center space-x-1 w-fit">
                                {getStatusIcon(request.status)}
                                <span>{request.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{formatDate(request.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(request.id, 'approved')}
                                  disabled={request.status === 'approved'}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(request.id, 'on-hold')}
                                  disabled={request.status === 'on-hold'}
                                  className="h-8 w-8 p-0"
                                >
                                  <Clock className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(request.id, 'rejected')}
                                  disabled={request.status === 'rejected'}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center space-x-3 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        request.status === 'approved' ? 'bg-green-500' :
                        request.status === 'pending' ? 'bg-yellow-500' :
                        request.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="flex-1">Request "{request.title}" is {request.status}</span>
                      <span className="text-muted-foreground text-xs">{formatDate(request.createdAt)}</span>
                    </div>
                  ))}
                  {requests.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
