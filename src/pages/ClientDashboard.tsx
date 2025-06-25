
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Globe, Clock, CheckCircle, XCircle } from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    requirements: '',
    budget: '',
    deadline: ''
  });

  // Mock data - in real app, this would come from Supabase
  const mockRequests = [
    {
      id: 1,
      projectName: 'E-commerce Website',
      status: 'pending',
      submittedAt: '2024-01-15',
      budget: '$5000'
    },
    {
      id: 2,
      projectName: 'Portfolio Site',
      status: 'approved',
      submittedAt: '2024-01-10',
      budget: '$2000'
    }
  ];

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

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call - in real app, this would save to Supabase
    setTimeout(() => {
      toast({
        title: "Request Submitted",
        description: "Your website request has been submitted for review.",
      });
      setFormData({
        projectName: '',
        description: '',
        requirements: '',
        budget: '',
        deadline: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Client Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request New Website */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Request New Website
              </CardTitle>
              <CardDescription>
                Submit a new website development request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your website requirements"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="$5,000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Preferred Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                My Requests
              </CardTitle>
              <CardDescription>
                Track your website development requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{request.projectName}</h3>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        <span className="text-sm capitalize">{request.status}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Budget: {request.budget}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {request.submittedAt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
