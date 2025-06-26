
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
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Plus, Percent, Users, Globe, Calendar, Settings, Edit, Trash2 } from 'lucide-react';

interface Discount {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  isPublic: boolean;
  specificUser?: string;
  isActive: boolean;
  expiryDate?: any;
  usageCount: number;
  maxUsage?: number;
  createdAt: any;
  createdBy: string;
}

const Discounts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage' as const,
    value: 0,
    isPublic: true,
    specificUser: '',
    expiryDate: '',
    maxUsage: 0
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const discountsQuery = query(collection(db, 'discounts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(discountsQuery);
      const discountsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Discount[];
      setDiscounts(discountsData);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch discounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const discountData = {
        ...formData,
        code: formData.code.toUpperCase(),
        isActive: true,
        usageCount: 0,
        createdAt: serverTimestamp(),
        createdBy: user?.email || '',
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        maxUsage: formData.maxUsage || null,
        specificUser: formData.isPublic ? null : formData.specificUser
      };

      await addDoc(collection(db, 'discounts'), discountData);

      toast({
        title: "Discount Created",
        description: "Discount code has been created successfully",
      });

      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: 0,
        isPublic: true,
        specificUser: '',
        expiryDate: '',
        maxUsage: 0
      });
      setShowCreateForm(false);
      fetchDiscounts();
    } catch (error) {
      console.error('Error creating discount:', error);
      toast({
        title: "Error",
        description: "Failed to create discount",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDiscountStatus = async (discountId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'discounts', discountId), {
        isActive: !currentStatus
      });
      
      toast({
        title: "Status Updated",
        description: `Discount ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
      
      fetchDiscounts();
    } catch (error) {
      console.error('Error updating discount status:', error);
      toast({
        title: "Error",
        description: "Failed to update discount status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const isExpired = (expiryDate: any) => {
    if (!expiryDate) return false;
    const expiry = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
    return expiry < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading discounts...</p>
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
              <h1 className="text-base lg:text-lg font-semibold truncate">Discount Management</h1>
            </div>
            <Button size="sm" onClick={() => setShowCreateForm(true)} className="hidden sm:flex">
              <Plus className="h-4 w-4 mr-1" />
              New Discount
            </Button>
          </header>

          <main className="flex-1 space-y-4 p-3 md:p-4 lg:p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Percent className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{discounts.length}</div>
                      <p className="text-xs text-muted-foreground">Total Discounts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Settings className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-500">
                        {discounts.filter(d => d.isActive).length}
                      </div>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Globe className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-500">
                        {discounts.filter(d => d.isPublic).length}
                      </div>
                      <p className="text-xs text-muted-foreground">Public</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Users className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-yellow-500">
                        {discounts.filter(d => !d.isPublic).length}
                      </div>
                      <p className="text-xs text-muted-foreground">User Specific</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile CTA Button */}
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="w-full sm:hidden"
              size="lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Discount
            </Button>

            {/* Create Discount Form */}
            {showCreateForm && (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Create New Discount</span>
                  </CardTitle>
                  <CardDescription>
                    Create a new discount code for users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateDiscount} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="code">Discount Code</Label>
                        <Input
                          id="code"
                          value={formData.code}
                          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                          placeholder="SAVE20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Discount Type</Label>
                        <select
                          id="type"
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Describe the discount"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="value">
                          {formData.type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount ($)'}
                        </Label>
                        <Input
                          id="value"
                          type="number"
                          value={formData.value}
                          onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                          placeholder={formData.type === 'percentage' ? '20' : '50'}
                          min="0"
                          max={formData.type === 'percentage' ? 100 : undefined}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxUsage">Max Usage (Optional)</Label>
                        <Input
                          id="maxUsage"
                          type="number"
                          value={formData.maxUsage}
                          onChange={(e) => setFormData({...formData, maxUsage: Number(e.target.value)})}
                          placeholder="Unlimited"
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isPublic"
                          checked={formData.isPublic}
                          onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                          className="rounded border border-input"
                        />
                        <Label htmlFor="isPublic">Make this discount public</Label>
                      </div>
                      {!formData.isPublic && (
                        <div className="space-y-2">
                          <Label htmlFor="specificUser">Specific User Email</Label>
                          <Input
                            id="specificUser"
                            type="email"
                            value={formData.specificUser}
                            onChange={(e) => setFormData({...formData, specificUser: e.target.value})}
                            placeholder="user@example.com"
                            required={!formData.isPublic}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button type="submit" disabled={submitting}>
                        {submitting ? 'Creating...' : 'Create Discount'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCreateForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Discounts List */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>All Discount Codes</CardTitle>
                <CardDescription>Manage and track all discount codes</CardDescription>
              </CardHeader>
              <CardContent>
                {discounts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Percent className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No discounts yet</h3>
                    <p className="text-sm">Create your first discount code to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4 lg:space-y-0">
                    {/* Mobile Card View */}
                    <div className="space-y-4 lg:hidden">
                      {discounts.map((discount) => (
                        <Card key={discount.id} className="border-border/30">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{discount.code}</h4>
                                  <p className="text-sm text-muted-foreground">{discount.description}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Badge variant={discount.isActive && !isExpired(discount.expiryDate) ? 'default' : 'secondary'}>
                                    {discount.isActive && !isExpired(discount.expiryDate) ? 'Active' : 'Inactive'}
                                  </Badge>
                                  <Badge variant={discount.isPublic ? 'outline' : 'secondary'} className="text-xs">
                                    {discount.isPublic ? 'Public' : 'Private'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">
                                  {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`} off
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleDiscountStatus(discount.id, discount.isActive)}
                                >
                                  {discount.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
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
                            <TableHead>Code</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {discounts.map((discount) => (
                            <TableRow key={discount.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{discount.code}</TableCell>
                              <TableCell className="max-w-xs truncate">{discount.description}</TableCell>
                              <TableCell>
                                {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                              </TableCell>
                              <TableCell>
                                <Badge variant={discount.isPublic ? 'outline' : 'secondary'}>
                                  {discount.isPublic ? 'Public' : 'Private'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {discount.usageCount}{discount.maxUsage ? `/${discount.maxUsage}` : ''}
                              </TableCell>
                              <TableCell>
                                <Badge variant={discount.isActive && !isExpired(discount.expiryDate) ? 'default' : 'secondary'}>
                                  {discount.isActive && !isExpired(discount.expiryDate) ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleDiscountStatus(discount.id, discount.isActive)}
                                  className="h-8"
                                >
                                  {discount.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Discounts;
