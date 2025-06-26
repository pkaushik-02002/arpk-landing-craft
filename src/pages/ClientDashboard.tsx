
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
import { Plus, Globe, Sparkles, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

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
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-2 flex-1">
              <h1 className="text-lg font-semibold">Client Dashboard</h1>
            </div>
          </header>

          <main className="flex-1 space-y-4 p-4 md:p-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{requests.length}</div>
                      <p className="text-xs text-muted-foreground">Total Requests</p>
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
                      <div className="text-2xl font-bold text-green-500">
                        {requests.filter(r => r.status === 'approved').length}
                      </div>
                      <p className="text-xs text-muted-foreground">Approved</p>
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
                      <div className="text-2xl font-bold text-yellow-500">
                        {requests.filter(r => r.status === 'pending').length}
                      </div>
                      <p className="text-xs text-muted-foreground">Pending</p>
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
                      <div className="text-2xl font-bold text-red-500">
                        {requests.filter(r => r.status === 'rejected').length}
                      </div>
                      <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                        className="bg-background/50 border-border/50"
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
                        className="bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={submitting}>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Your Website Requests</span>
                    </CardTitle>
                    <CardDescription>
                      Track the status of your website requests
                    </CardDescription>
                  </div>
                  {!showRequestForm && (
                    <Button onClick={() => setShowRequestForm(true)} className="space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>New Request</span>
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
                  </div>
                ) : (
                  <div className="rounded-md border border-border/50">
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
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.title}</TableCell>
                            <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusColor(request.status)} className="flex items-center space-x-1 w-fit">
                                {getStatusIcon(request.status)}
                                <span>{request.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{formatDate(request.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
