
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useWebsiteRequests } from '@/hooks/useWebsiteRequests';
import { logout } from '@/lib/auth';
import { Plus, LogOut, Globe, Sparkles } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto neon-border"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
            <Globe className="h-6 w-6 text-primary neon-text" />
            <h1 className="text-xl font-semibold neon-text">Client Dashboard</h1>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="neon-border">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card neon-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold neon-text">{requests.length}</div>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </CardContent>
          </Card>
          <Card className="glass-card neon-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-400">
                {requests.filter(r => r.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card className="glass-card neon-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-400">
                {requests.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="glass-card neon-border">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-400">
                {requests.filter(r => r.status === 'rejected').length}
              </div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* New Request Form */}
        {showRequestForm && (
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="neon-text">New Website Request</CardTitle>
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
                    className="bg-background/50"
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
                    className="bg-background/50"
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
                    className="bg-background/50"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={submitting} className="neon-border">
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowRequestForm(false)}
                    className="neon-border"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Requests List */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="neon-text">Your Website Requests</CardTitle>
                <CardDescription>
                  Track the status of your website requests
                </CardDescription>
              </div>
              {!showRequestForm && (
                <Button onClick={() => setShowRequestForm(true)} className="neon-border">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No requests yet. Submit your first website request!
              </div>
            ) : (
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
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClientDashboard;
