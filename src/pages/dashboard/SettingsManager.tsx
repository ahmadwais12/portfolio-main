import { useState } from 'react';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { SettingsManagerSkeleton } from '@/components/Skeletons';
import { Settings, Moon, Sun, Bell, Shield, Palette, Sparkles, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'wais@admin@1234';

const SettingsManager = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    publicProfile: true,
    showResume: true,
  });

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPass: false, confirm: false });

  const handleChangePassword = () => {
    if (passwords.current !== ADMIN_PASSWORD) {
      toast.error('Current password is incorrect');
      return;
    }
    if (passwords.newPass.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password updated successfully');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const handleSave = () => toast.success('Settings saved successfully');

  return (
    <PageLoader skeleton={<SettingsManagerSkeleton />} delay={600}>
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Settings</h1>
        </div>
        <p className="text-muted-foreground">Manage your dashboard preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-primary/10"><Palette className="w-4 h-4 text-primary" /></div>
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {isDark ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
                  </div>
                  <div>
                    <Label className="font-medium">{isDark ? 'Dark Mode' : 'Light Mode'}</Label>
                    <p className="text-sm text-muted-foreground">Toggle between dark and light theme</p>
                  </div>
                </div>
                <Switch
                  checked={isDark}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-secondary/10"><Bell className="w-4 h-4 text-secondary" /></div>
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'notifications', label: 'Enable Notifications', desc: 'Receive dashboard notifications' },
                { key: 'emailAlerts', label: 'Email Alerts', desc: 'Get email notifications for important updates' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <Label className="font-medium">{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={settings[key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => setSettings({ ...settings, [key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-primary/10"><Shield className="w-4 h-4 text-primary" /></div>
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'publicProfile', label: 'Public Profile', desc: 'Make your portfolio visible to everyone' },
                { key: 'showResume', label: 'Show Resume', desc: 'Display resume download button on your portfolio' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <Label className="font-medium">{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={settings[key as keyof typeof settings] as boolean}
                    onCheckedChange={(checked) => setSettings({ ...settings, [key]: checked })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card border-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-primary/10"><Lock className="w-4 h-4 text-primary" /></div>
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {([
                { key: 'current', label: 'Current Password' },
                { key: 'newPass', label: 'New Password' },
                { key: 'confirm', label: 'Confirm New Password' },
              ] as const).map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-muted-foreground">{label}</Label>
                  <div className="relative">
                    <Input
                      type={showPw[key] ? 'text' : 'password'}
                      value={passwords[key]}
                      onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                      placeholder="••••••••"
                      className="glass-card border-0 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <Button onClick={handleChangePassword} className="w-full bg-gradient-primary hover:opacity-90 shadow-glow gap-2">
                <Lock className="w-4 h-4" /> Update Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div className="flex justify-end" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Button onClick={handleSave} className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
          <Sparkles className="w-4 h-4" /> Save Settings
        </Button>
      </motion.div>
    </div>
    </PageLoader>
  );
};

export default SettingsManager;
