
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Globe, Sparkles, TrendingUp, Clock, CheckCircle, XCircle, Calendar, DollarSign, Users, Zap, BarChart, FileText, Star, Award, Target } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { requests, loading, submitRequest } = useWebsiteRequests();
  const { toast } = useToast();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const { error } = await submitRequest(formData);
    
    if (error) {
      toast({
        title: "Submission Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      setFormData({ title: '', description: '', requirements: '' });
      setShowRequestForm(false);
      toast({
        title: "Request Submitted",
        description: "Your website request has been submitted successfully.",
      });
    }
    
    setSubmitting(false);
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

  // Calculate completion rate
  const completionRate = requests.length > 0 ? (requests.filter(r => r.status === 'approved').length / requests.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
              <h1 className="text-base lg:text-lg font-semibold truncate">Client Dashboard</h1>
              <Badge variant="outline" className="hidden sm:inline-flex">Premium</Badge>
            </div>
            <Button size="sm" onClick={() => setShowRequestForm(true)} className="hidden sm:flex">
              <Plus className="h-4 w-4 mr-1" />
              New Request
            </Button>
          </header>

          <main className="flex-1 space-y-4 p-3 md:p-4 lg:p-6">
            {/* Welcome Section */}
            <div className="glass-card rounded-lg p-4 lg:p-6 border-border/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold">Welcome back!</h2>
                  <p className="text-sm lg:text-base text-muted-foreground">Manage your website projects and track progress</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Premium Client</span>
                </div>
              </div>
            </div>

            {/* Mobile CTA Button */}
            <Button 
              onClick={() => setShowRequestForm(true)} 
              className="w-full sm:hidden"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Website Request
            </Button>

            {/* Enhanced Stats Grid - Mobile First */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 hover-lift">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl lg:text-2xl font-bold">{requests.length}</div>
                      <p className="text-xs text-muted-foreground truncate">Total Requests</p>
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
                      <div className="text-xl lg:text-2xl font-bold text-green-500">
                        {requests.filter(r => r.status === 'approved').length}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">Approved</p>
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
                      <div className="text-xl lg:text-2xl font-bold text-yellow-500">
                        {requests.filter(r => r.status === 'pending').length}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">Pending</p>
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
                      <div className="text-xl lg:text-2xl font-bold text-blue-500">
                        {completionRate.toFixed(0)}%
                      </div>
                      <p className="text-xs text-muted-foreground truncate">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                  <BarChart className="h-5 w-5" />
                  <span>Project Progress</span>
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg">{requests.filter(r => r.status === 'approved').length}</div>
                    <div className="text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{requests.filter(r => r.status === 'pending').length}</div>
                    <div className="text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center col-span-2 lg:col-span-1">
                    <div className="font-bold text-lg">{requests.filter(r => r.status === 'on-hold').length}</div>
                    <div className="text-muted-foreground">On Hold</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New Request Form */}
            {showRequestForm && (
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>New Website Request</span>
                  </CardTitle>
                  <CardDescription>
                    Provide details about your website requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter project title"
                        required
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe your website project"
                        required
                        className="bg-background/50 border-border/50 min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements</Label>
                      <Textarea
                        id="requirements"
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        placeholder="List your specific requirements"
                        required
                        className="bg-background/50 border-border/50 min-h-[100px]"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button type="submit" disabled={submitting} className="btn-premium">
                        {submitting ? 'Submitting...' : 'Submit Request'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowRequestForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Requests List */}
            <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Your Website Requests</span>
                    </CardTitle>
                    <CardDescription>
                      Track the status of your website requests
                    </CardDescription>
                  </div>
                  {!showRequestForm && (
                    <Button onClick={() => setShowRequestForm(true)} className="btn-premium hidden sm:flex">
                      <Plus className="h-4 w-4 mr-2" />
                      New Request
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No requests yet</h3>
                    <p className="text-sm">Submit your first website request to get started!</p>
                    <Button 
                      onClick={() => setShowRequestForm(true)} 
                      className="mt-4 btn-premium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Request
                    </Button>
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
                                <h4 className="font-medium truncate pr-2">{request.title}</h4>
                                <Badge variant={getStatusColor(request.status)} className="flex items-center space-x-1 shrink-0">
                                  {getStatusIcon(request.status)}
                                  <span className="capitalize">{request.status}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(request.createdAt)}
                                </span>
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
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {requests.map((request) => (
                            <TableRow key={request.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{request.title}</TableCell>
                              <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(request.status)} className="flex items-center space-x-1 w-fit">
                                  {getStatusIcon(request.status)}
                                  <span className="capitalize">{request.status}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{formatDate(request.createdAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
