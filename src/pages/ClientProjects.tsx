
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { FolderOpen, Calendar, DollarSign, CheckCircle, Clock, Pause } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  budget: number;
  status: 'active' | 'completed' | 'on-hold';
  createdAt: any;
}

const ClientProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user?.email) return;

    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('assignedTo', '==', user.email),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(projectsQuery);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'on-hold': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'on-hold': return <Pause className="h-4 w-4" />;
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
          <p className="text-muted-foreground">Loading your projects...</p>
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
              <h1 className="text-base lg:text-lg font-semibold truncate">My Projects</h1>
            </div>
          </header>

          <main className="flex-1 space-y-4 p-3 md:p-4 lg:p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FolderOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xl font-bold">{projects.length}</div>
                      <p className="text-xs text-muted-foreground">Total Projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Clock className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-500">
                        {projects.filter(p => p.status === 'active').length}
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
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-500">
                        {projects.filter(p => p.status === 'completed').length}
                      </div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <DollarSign className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-yellow-500">
                        ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects List */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle>Your Assigned Projects</CardTitle>
                <CardDescription>Projects assigned to you by the admin</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No projects assigned yet</h3>
                    <p className="text-sm">Projects will appear here when assigned by admin</p>
                  </div>
                ) : (
                  <div className="space-y-4 lg:space-y-0">
                    {/* Mobile Card View */}
                    <div className="space-y-4 lg:hidden">
                      {projects.map((project) => (
                        <Card key={project.id} className="border-border/30">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium truncate pr-2">{project.title}</h4>
                                <Badge variant={getStatusColor(project.status)} className="flex items-center space-x-1 shrink-0">
                                  {getStatusIcon(project.status)}
                                  <span className="capitalize">{project.status}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">${project.budget.toLocaleString()}</span>
                                <span className="text-muted-foreground flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(project.createdAt)}
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
                            <TableHead>Project Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projects.map((project) => (
                            <TableRow key={project.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{project.title}</TableCell>
                              <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                              <TableCell className="font-medium">${project.budget.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusColor(project.status)} className="flex items-center space-x-1 w-fit">
                                  {getStatusIcon(project.status)}
                                  <span className="capitalize">{project.status}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{formatDate(project.createdAt)}</TableCell>
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

export default ClientProjects;
