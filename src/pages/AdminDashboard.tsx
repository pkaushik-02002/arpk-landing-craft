
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useWebsiteRequests } from '@/hooks/useWebsiteRequests';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Check, X, Clock, Users, Globe, BarChart3, Activity, CheckCircle, XCircle, TrendingUp, Calendar, Shield, Star, Award, Target, FileText, DollarSign } from 'lucide-react';

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
  const onHoldRequests = requests.filter(r => r.status === 'on-hold').length;
  const completionRate = totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0;

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
          {/* Mobile-first Header */}
          <header className="flex h-14 lg:h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-2 flex-1">
              <h1 className="text-base lg:text-lg font-semibold truncate">Admin Dashboard</h1>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="hidden md:flex">
                <Star className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
          </header>

          <main className="flex-1 space-y-4 p-3 md:p-4 lg:p-6">
            {/* Admin Welcome Section */}
            <div className="glass-card rounded-lg p-4 lg:p-6 border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Admin Control Center
                  </h2>
                  <p className="text-sm lg:text-base text-muted-foreground">Manage all website requests and monitor system performance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">System Administrator</span>
                </div>
              </div>
            </div>

            {/* Enhanced Overview Stats - Mobile First */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 hover-lift">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl lg:text-2xl font-bold">{totalRequests}</div>
                      <p className="text-xs text-muted-foreground truncate">Total Requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 hover-lift">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl lg:text-2xl font-bold text-yellow-500">{pendingRequests}</div>
                      <p className="text-xs text-muted-foreground truncate">Pending Review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 hover-lift">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl lg:text-2xl font-bold text-green-500">{approvedRequests}</div>
                      <p className="text-xs text-muted-foreground truncate">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 hover-lift">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Target className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl lg:text-2xl font-bold text-blue-500">{completionRate.toFixed(0)}%</div>
                      <p className="text-xs text-muted-foreground truncate">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* System Performance */}
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                    <BarChart3 className="h-5 w-5" />
                    <span>System Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">{completionRate.toFixed(0)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg text-green-500">{approvedRequests}</div>
                      <div className="text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg text-yellow-500">{pendingRequests}</div>
                      <div className="text-muted-foreground">Pending</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                    <TrendingUp className="h-5 w-5" />
                    <span>Quick Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground">On Hold</div>
                      <div className="text-2xl font-bold text-blue-500">{onHoldRequests}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-muted-foreground">Rejected</div>
                      <div className="text-2xl font-bold text-red-500">{rejectedRequests}</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-lg font-bold">{totalRequests > 0 ? ((approvedRequests + onHoldRequests) / totalRequests * 100).toFixed(0) : 0}%</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
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
                  <div className="space-y-4 lg:space-y-0">
                    {/* Mobile Card View */}
                    <div className="space-y-4 lg:hidden">
                      {requests.map((request) => (
                        <Card key={request.id} className="border-border/30">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1 pr-2">
                                  <h4 className="font-medium truncate">{request.title}</h4>
                                  <p className="text-sm text-muted-foreground truncate">{request.clientEmail}</p>
                                </div>
                                <Badge variant={getStatusColor(request.status)} className="flex items-center space-x-1 shrink-0">
                                  {getStatusIcon(request.status)}
                                  <span className="capitalize">{request.status}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(request.createdAt)}
                                </span>
                                <div className="flex space-x-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(request.id, 'approved')}
                                    disabled={request.status === 'approved'}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(request.id, 'on-hold')}
                                    disabled={request.status === 'on-hold'}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Clock className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusChange(request.id, 'rejected')}
                                    disabled={request.status === 'rejected'}
                                    className="h-7 w-7 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block rounded-md border border-border/50">
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
                            <TableRow key={request.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{request.clientEmail}</TableCell>
                              <TableCell>{request.title}</TableCell>
                              <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(request.status)} className="flex items-center space-x-1 w-fit">
                                  {getStatusIcon(request.status)}
                                  <span className="capitalize">{request.status}</span>
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
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        request.status === 'approved' ? 'bg-green-500' :
                        request.status === 'pending' ? 'bg-yellow-500' :
                        request.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="flex-1 truncate">Request "{request.title}" is {request.status}</span>
                      <span className="text-muted-foreground text-xs shrink-0">{formatDate(request.createdAt)}</span>
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
