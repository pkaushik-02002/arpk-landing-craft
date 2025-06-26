import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GoogleIcon from '@/components/GoogleIcon';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSuccessfulRegistration = async (user: any) => {
    try {
      // Get user role from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let role: 'client' | 'admin' = 'client'; // default role
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        role = userData.role || 'client';
      }
      
      // Redirect based on role
      const redirectPath = role === 'admin' ? '/dashboard/admin' : '/dashboard/client';
      console.log('Redirecting new user with role:', role, 'to:', redirectPath);
      navigate(redirectPath);
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Fallback to client dashboard if there's an error
      navigate('/dashboard/client');
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { user, error } = await signUpWithEmail(email, password);
    
    if (error) {
      toast({
        title: "Registration Failed",
        description: error,
        variant: "destructive",
      });
    } else if (user) {
      toast({
        title: "Registration Successful",
        description: "Welcome to ARPK!",
      });
      await handleSuccessfulRegistration(user);
    }
    
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);

    const { user, error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: "Registration Failed",
        description: error,
        variant: "destructive",
      });
    } else if (user) {
      toast({
        title: "Registration Successful",
        description: "Welcome to ARPK!",
      });
      await handleSuccessfulRegistration(user);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Sign up with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
