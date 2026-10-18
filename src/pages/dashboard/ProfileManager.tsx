import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { ProfileManagerSkeleton } from '@/components/Skeletons';
import { User, Save, Sparkles, Mail, Phone, MapPin, Palette, Moon, Sun, Bell, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileUploadField } from '@/components/FileUploadField';
import { saveAbout, usePortfolio } from '@/lib/store';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { LocalizedField } from '@/components/dashboard/LocalizedField';
import { localizedValues, splitLocalizedList, type ContentLanguage } from '@/lib/localization';

const ProfileManager = () => {
  const { about, status } = usePortfolio();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(about);
  const [preferences, setPreferences] = useState({ notifications: true, email_alerts: false, public_profile: true, show_resume: true });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, next: false, confirm: false });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (status === 'ready') setData(about);
  }, [about, status]);

  useEffect(() => {
    let active = true;
    void supabase.from('portfolio_settings').select('notifications,email_alerts,public_profile,show_resume').eq('id', 'main').maybeSingle().then(({ data: saved, error }) => {
      if (error) { toast.error(`Unable to load preferences: ${error.message}`); return; }
      if (active && saved) setPreferences({ notifications: saved.notifications, email_alerts: saved.email_alerts, public_profile: saved.public_profile, show_resume: saved.show_resume });
    });
    return () => { active = false; };
  }, []);

  const set = (field: keyof typeof about, value: string) => setData(prev => ({ ...prev, [field]: value }));
  const setLocalized = (field: string, language: ContentLanguage, value: string) => {
    set(`${field}_${language}` as keyof typeof about, value);
    if (language === 'en') set(field as keyof typeof about, value);
  };
  /** Contact details are not translated — one value shared by every language. */
  const setUniversal = (field: 'email' | 'phone', value: string) => setData(prev => ({
    ...prev,
    [field]: value,
    [`${field}_en`]: value,
  }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAbout(data);
      const { data: current, error: readError } = await supabase.from('portfolio_settings').select('extra').eq('id', 'main').maybeSingle();
      if (readError) throw new Error(readError.message);
      const { error: settingsError } = await supabase.from('portfolio_settings').upsert({ id: 'main', ...preferences, extra: current?.extra ?? {} }, { onConflict: 'id' });
      if (settingsError) throw new Error(settingsError.message);
      toast.success('Profile and preferences saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.next.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (passwords.next !== passwords.confirm) { toast.error('New passwords do not match'); return; }
    setChangingPassword(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.email) throw new Error(userError?.message || 'Unable to identify the signed-in account');
      const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: passwords.current });
      if (verifyError) throw new Error('Current password is incorrect');
      const { error } = await supabase.auth.updateUser({ password: passwords.next });
      if (error) throw new Error(error.message);
      setPasswords({ current: '', next: '', confirm: '' });
      toast.success('Password updated successfully');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update password'); }
    finally { setChangingPassword(false); }
  };

  return (
    <PageLoader skeleton={<ProfileManagerSkeleton />} delay={600}>
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-gradient-primary"><User className="w-5 h-5 text-white" /></div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Profile</h1>
        </div>
        <p className="text-muted-foreground">Manage your personal information and portfolio details.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-primary/10"><Sparkles className="w-4 h-4 text-primary" /></div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <LocalizedField label="Full Name" only={['en']} value={localizedValues(data, 'full_name')} onChange={(_language, value) => setLocalized('full_name', 'en', value)} />
                <LocalizedField
                  label="Professional Titles"
                  only={['en']}
                  value={localizedValues(data, 'title')}
                  onChange={(_language, value) => setLocalized('title', 'en', value)}
                  multiline
                  rows={3}
                  placeholder={'Full-Stack Developer\nFlutter Developer'}
                />
                <p className="-mt-1 text-xs text-muted-foreground">Add several titles — one per line (commas work too). They rotate in the hero section.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocalizedField label="Email" only={['en']} inputType="email" direction="ltr" value={localizedValues(data, 'email')} onChange={(_language, value) => setUniversal('email', value)} />
                <LocalizedField label="Phone" only={['en']} inputType="tel" direction="ltr" value={localizedValues(data, 'phone')} onChange={(_language, value) => setUniversal('phone', value)} />
              </div>
              <div className="space-y-2">
                <LocalizedField label="Location" only={['en']} value={localizedValues(data, 'location')} onChange={(_language, value) => setLocalized('location', 'en', value)} />
              </div>
              <div className="space-y-2">
                <LocalizedField label="Biography" only={['en']} value={localizedValues(data, 'bio')} onChange={(_language, value) => setLocalized('bio', 'en', value)} multiline rows={4} />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <LocalizedField label="Years of Experience" only={['en']} value={localizedValues(data, 'years_experience')} onChange={(_language, value) => setLocalized('years_experience', 'en', value)} />
                <LocalizedField label="Projects Completed" only={['en']} value={localizedValues(data, 'projects_completed')} onChange={(_language, value) => setLocalized('projects_completed', 'en', value)} />
                <LocalizedField label="Technologies" only={['en']} value={localizedValues(data, 'technologies')} onChange={(_language, value) => setLocalized('technologies', 'en', value)} />
              </div>
              <FileUploadField label="Resume (PDF)" value={data.resume_url} onChange={url => set('resume_url', url)} bucket="portfolio-assets" prefix="resume" kind="pdf" />
              <FileUploadField label="Profile Image" value={data.avatar_url} onChange={url => set('avatar_url', url)} bucket="profile-images" prefix="avatar" deletePreviousOnReplace />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-secondary/10"><Sparkles className="w-4 h-4 text-secondary" /></div>
                Profile Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-24 h-24 border-4 border-primary/20 mb-4">
                <AvatarImage src={data.avatar_url} alt={data.full_name} />
                <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                  {data.full_name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{data.full_name}</h3>
              <p className="text-muted-foreground text-sm">{splitLocalizedList(data.title).join(' · ')}</p>
              <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{data.location}
              </p>
            </CardContent>
          </Card>

        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="glass-card border-0">
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-4 w-4 text-primary" />Appearance</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
            <div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2">{isDark ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}</div><div><Label>{isDark ? 'Dark Mode' : 'Light Mode'}</Label><p className="text-sm text-muted-foreground">Switch the dashboard theme</p></div></div>
            <Switch checked={isDark} onCheckedChange={checked => setTheme(checked ? 'dark' : 'light')} />
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4 text-secondary" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {([
              { key: 'notifications', label: 'Enable Notifications', desc: 'Receive dashboard notifications' },
              { key: 'email_alerts', label: 'Email Alerts', desc: 'Get email notifications for important updates' },
            ] as const).map(item => <div key={item.key} className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 p-3"><div><Label>{item.label}</Label><p className="text-sm text-muted-foreground">{item.desc}</p></div><Switch checked={preferences[item.key]} onCheckedChange={checked => setPreferences(current => ({ ...current, [item.key]: checked }))} /></div>)}
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Privacy</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {([
              { key: 'public_profile', label: 'Public Profile', desc: 'Make your portfolio visible to everyone' },
              { key: 'show_resume', label: 'Show Resume', desc: 'Display the resume download button' },
            ] as const).map(item => <div key={item.key} className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 p-3"><div><Label>{item.label}</Label><p className="text-sm text-muted-foreground">{item.desc}</p></div><Switch checked={preferences[item.key]} onCheckedChange={checked => setPreferences(current => ({ ...current, [item.key]: checked }))} /></div>)}
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" />Change Password</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {([
              { key: 'current', label: 'Current Password' },
              { key: 'next', label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ] as const).map(item => <div key={item.key} className="space-y-2"><Label>{item.label}</Label><div className="relative"><Input type={showPasswords[item.key] ? 'text' : 'password'} value={passwords[item.key]} onChange={event => setPasswords(current => ({ ...current, [item.key]: event.target.value }))} autoComplete={item.key === 'current' ? 'current-password' : 'new-password'} className="pr-10" /><button type="button" aria-label={showPasswords[item.key] ? 'Hide password' : 'Show password'} onClick={() => setShowPasswords(current => ({ ...current, [item.key]: !current[item.key] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPasswords[item.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>)}
            <Button onClick={() => void handleChangePassword()} disabled={changingPassword || !passwords.current || !passwords.next || !passwords.confirm} className="w-full gap-2"><Lock className="h-4 w-4" />{changingPassword ? 'Updating…' : 'Update Password'}</Button>
          </CardContent>
        </Card>
      </div>

      <motion.div className="flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Button onClick={() => void handleSave()} disabled={saving} className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </motion.div>
    </div>
    </PageLoader>
  );
};

export default ProfileManager;
