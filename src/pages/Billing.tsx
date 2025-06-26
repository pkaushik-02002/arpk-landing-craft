
import { useState, useEffect } from 'react';
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
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { Plus, CreditCard, Clock, CheckCircle, XCircle, Calendar, DollarSign } from 'lucide-react';

interface PaymentRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: any;
  clientEmail: string;
  clientId: string;
}

const Billing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: 0
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchPaymentRequests();
    }
  }, [user]);

  const fetchPaymentRequests = async () => {
    if (!user?.email) return;

    try {
      const requestsQuery = query(
        collection(db, 'paymentRequests'),
        where('clientEmail', '==', user.email),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(requestsQuery);
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentRequest[];
      setPaymentRequests(requestsData);
    } catch (error) {
      console.error('Error fetching payment requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !user?.uid) return;

    setSubmitting(true);

    try {
      await addDoc(collection(db, 'paymentRequests'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        clientEmail: user.email,
        clientId: user.uid
      });

      toast({
        title: "Payment Request Created",
        description: "Your payment request has been submitted for review",
      });

      setFormData({
        title: '',
        description: '',
        amount: 0
      });
      setShowRequestForm(false);
      fetchPaymentRequests();
    } catch (error) {
      console.error('Error creating payment request:', error);
      toast({
        title: "Error",
        description: "Failed to create payment request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'paid': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
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
          <p className="text-muted-foreground">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-secondary/20">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 lg:h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-2 flex-1">
              <h1 className="text-base lg:text-lg font-semibold truncate">Billing & Payments</h1>
            </div>
            <Button size="sm" onClick={() => setShowRequestForm(true)} className="hidden sm:flex">
              <Plus className="h-4 w-4 mr-1" />
              New Request
            </Button>
          </header>

          <main className="flex-1 space-y-4 p-3 md:p-4 lg:p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{paymentRequests.length}</div>
                      <p className="text-xs text-muted-foreground">Total Requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-yellow-500">
                        {paymentRequests.filter(r => r.status === 'pending').length}
                      </div>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-500">
                        {paymentRequests.filter(r => r.status === 'approved' || r.status === 'paid').length}
                      </div>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-500">
                        ${paymentRequests.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile CTA Button */}
            <Button 
              onClick={() => setShowRequestForm(true)} 
              className="w-full sm:hidden"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Payment Request
            </Button>

            {/* Create Payment Request Form */}
            {showRequestForm && (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>New Payment Request</span>
                  </CardTitle>
                  <CardDescription>
                    Create a payment request for your project or service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Request Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter payment request title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe what this payment is for"
                        required
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create Payment Request'}
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

            {/* Payment Requests List */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Your Payment Requests</CardTitle>
                <CardDescription>Track the status of your payment requests</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentRequests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No payment requests yet</h3>
                    <p className="text-sm">Create your first payment request to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4 lg:space-y-0">
                    {/* Mobile Card View */}
                    <div className="space-y-4 lg:hidden">
                      {paymentRequests.map((request) => (
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
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">${request.amount.toLocaleString()}</span>
                                <span className="text-muted-foreground flex items-center">
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
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paymentRequests.map((request) => (
                            <TableRow key={request.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{request.title}</TableCell>
                              <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                              <TableCell className="font-medium">${request.amount.toLocaleString()}</TableCell>
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

export default Billing;
