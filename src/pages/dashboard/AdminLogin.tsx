import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageLoader from '@/components/PageLoader';
import { AdminLoginSkeleton } from '@/components/Skeletons';
import { Lock, Mail, Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface AdminLoginProps {
  onLogin: () => void;
}

/** Translate Supabase auth errors into messages that are safe and useful to show. */
const friendlyAuthError = (message?: string) => {
  const msg = (message ?? '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Incorrect email or password.';
  if (msg.includes('email not confirmed')) return 'Please confirm your email before signing in.';
  if (msg.includes('rate limit') || msg.includes('too many') || msg.includes('security purposes'))
    return 'Too many attempts. Please wait a moment and try again.';
  if (msg.includes('failed to fetch') || msg.includes('network'))
    return 'Could not reach the sign-in service. Check your connection and try again.';
  return message || 'Unable to sign in. Please try again.';
};

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // True while an existing Supabase session is being restored on mount.
  const [isRestoring, setIsRestoring] = useState(true);

  const onLoginRef = useRef(onLogin);
  onLoginRef.current = onLogin;

  // Restore an existing session: signed-in admins skip the form entirely,
  // any other stored session is cleared so the page stays a clean login form.
  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session) {
        setIsRestoring(false);
        return;
      }

      const { data: isAdmin, error: accessError } = await supabase.rpc('is_analytics_admin');
      if (cancelled) return;
      if (!accessError && isAdmin) {
        onLoginRef.current();
        return;
      }

      await supabase.auth.signOut();
      if (!cancelled) setIsRestoring(false);
    };

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        toast.error(friendlyAuthError(error?.message));
        return;
      }

      const { data: isAdmin, error: accessError } = await supabase.rpc('is_analytics_admin');
      if (accessError || !isAdmin) {
        await supabase.auth.signOut();
        toast.error(
          accessError
            ? 'Could not verify admin access. Please try again in a moment.'
            : 'This account is not authorized for the admin dashboard.'
        );
        return;
      }

      toast.success('Welcome back!');
      onLogin();
    } catch {
      toast.error('Unable to sign in. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, isLoading, onLogin]);

  return (
    <PageLoader skeleton={<AdminLoginSkeleton />} delay={500}>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-secondary/10 via-transparent to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow"
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
            >
              Admin Login
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm"
            >
              Sign in to access your dashboard
            </motion.p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-card border-0 h-12"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-card border-0 h-12 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading || isRestoring}
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 shadow-glow text-white font-semibold gap-2"
                >
                  {isLoading || isRestoring ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                {isRestoring && (
                  <p className="text-center text-xs text-muted-foreground">
                    Checking your session…
                  </p>
                )}
              </motion.div>
            </form>
            <p className="pt-2 text-center text-sm text-muted-foreground">
              Need an account?{' '}
              <Link to="/admin/create-user" className="font-medium text-primary hover:underline">Create user</Link>
            </p>

          </CardContent>
        </Card>
      </motion.div>
    </div>
    </PageLoader>
  );
};

export default AdminLogin;
