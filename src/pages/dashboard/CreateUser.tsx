import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Sparkles, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const CreateUser = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('The passwords do not match.');
      return;
    }
    if (password.length < 8) {
      toast.error('Use a password with at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      // A database trigger on auth.users creates the matching public.users row.
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) {
        toast.error(error.message || 'Unable to create the account.');
        return;
      }

      // Supabase hides existing emails by returning a user without identities.
      if (data.user && data.user.identities?.length === 0) {
        toast.error('An account with this email already exists. Please sign in.');
        navigate('/admin', { replace: true });
        return;
      }

      if (!data.session) {
        toast.success('Account created. Check your email to confirm it, then sign in.');
        navigate('/admin', { replace: true });
        return;
      }

      const { data: isAdmin } = await supabase.rpc('is_analytics_admin');
      if (isAdmin) {
        toast.success('Account created. Welcome to your dashboard!');
        window.location.href = '/dashboard';
        return;
      }

      await supabase.auth.signOut();
      toast.success('Account created. A Super Admin must grant access before you can sign in.');
      navigate('/admin', { replace: true });
    } catch {
      toast.error('Unable to create the account. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-secondary/10 via-transparent to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="glass-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
              <UserRound className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Create User</h1>
            <p className="text-sm text-muted-foreground">Create a Supabase account for this portfolio</p>
          </CardHeader>

          <CardContent className="space-y-5 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-user-name"><UserRound className="mr-2 inline h-4 w-4" />Full name</Label>
                <Input id="create-user-name" autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} required className="glass-card border-0 h-12" placeholder="Your name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-user-email"><Mail className="mr-2 inline h-4 w-4" />Email</Label>
                <Input id="create-user-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="glass-card border-0 h-12" placeholder="you@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-user-password"><Lock className="mr-2 inline h-4 w-4" />Password</Label>
                <div className="relative">
                  <Input id="create-user-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} required className="glass-card border-0 h-12 pr-12" placeholder="At least 8 characters" />
                  <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-user-confirm"><Lock className="mr-2 inline h-4 w-4" />Confirm password</Label>
                <Input id="create-user-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="glass-card border-0 h-12" placeholder="Re-enter your password" />
              </div>

              <Button type="submit" disabled={isLoading} className="h-12 w-full gap-2 bg-gradient-primary font-semibold text-white shadow-glow hover:opacity-90">
                {isLoading ? <Sparkles className="h-5 w-5 animate-spin" /> : <>Create Account <UserRound className="h-4 w-4" /></>}
              </Button>
            </form>

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              The first account becomes the Super Admin. Later accounts need a Super Admin to grant access.
            </p>
            <Link to="/admin" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateUser;
