import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Redirect if already logged in as admin
  if (!isLoading && user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const validateForm = () => {
    setValidationError('');
    
    if (!email.trim()) {
      setValidationError('Email address is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setValidationError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting login with email:', email);
      const { error } = await signIn(email, password);

      if (error) {
        console.error('Login error:', error);
        // Provide specific error messages
        let errorMsg = 'Invalid email or password. Please try again.';
        if (error.message?.includes('Invalid login credentials')) {
          errorMsg = 'Invalid email or password. Please verify your credentials.';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMsg = 'Email not confirmed. Please check your email to confirm your account.';
        } else if (error.message?.includes('User not found')) {
          errorMsg = 'User account not found. Please contact the administrator.';
        }
        setValidationError(errorMsg);
        toast.error('Login failed: ' + (error.message || 'Unknown error'));
        return;
      }

      console.log('Login successful, checking admin role...');
      // Check if user is admin after login
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Unexpected error:', error);
      setValidationError('An error occurred during login. Please try again.');
      toast.error('An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl font-semibold text-white mb-2">
            Prosperous Autos
          </h1>
          <p className="text-gold text-sm uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-charcoal p-8 rounded-sm border border-charcoal-light">
          <div className="flex items-center justify-center w-14 h-14 mx-auto mb-8 rounded-full border-2 border-gold">
            <Lock className="h-6 w-6 text-gold" />
          </div>

          <h2 className="text-xl font-semibold text-white text-center mb-6">
            Sign in to Dashboard
          </h2>

          {validationError && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500 ml-2">
                {validationError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-platinum">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="bg-obsidian border-charcoal-light text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-platinum">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-obsidian border-charcoal-light text-white placeholder:text-muted-foreground pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gold"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Contact the administrator if you need access.
          </p>
        </div>

        {/* Back to site */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-platinum/50 hover:text-gold text-sm transition-colors"
          >
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
