import { useState } from 'react';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { ProfileManagerSkeleton } from '@/components/Skeletons';
import { User, Save, Github, Linkedin, Twitter, Globe, Sparkles, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAbout, saveAbout } from '@/lib/store';
import { toast } from 'sonner';

const ProfileManager = () => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(getAbout());

  const set = (field: string, value: string) => setData(prev => ({ ...prev, [field]: value }));
  const setSocial = (field: string, value: string) => setData(prev => ({ ...prev, social_links: { ...prev.social_links, [field]: value } }));

  const handleSave = () => {
    setSaving(true);
    saveAbout(data);
    setTimeout(() => { toast.success('Profile saved successfully'); setSaving(false); }, 600);
  };

  return (
    <PageLoader skeleton={<ProfileManagerSkeleton />} delay={600}>
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-gradient-primary"><User className="w-5 h-5 text-white" /></div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Profile</h1>
        </div>
        <p className="text-muted-foreground">Manage your personal information and social links</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4" />Full Name</Label>
                  <Input value={data.full_name} onChange={e => set('full_name', e.target.value)} className="glass-card border-0" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Professional Title</Label>
                  <Input value={data.title} onChange={e => set('title', e.target.value)} className="glass-card border-0" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><Mail className="w-4 h-4" />Email</Label>
                  <Input type="email" value={data.email} onChange={e => set('email', e.target.value)} className="glass-card border-0" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><Phone className="w-4 h-4" />Phone</Label>
                  <Input value={data.phone} onChange={e => set('phone', e.target.value)} className="glass-card border-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" />Location</Label>
                <Input value={data.location} onChange={e => set('location', e.target.value)} className="glass-card border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Resume URL</Label>
                <Input value={data.resume_url} onChange={e => set('resume_url', e.target.value)} placeholder="https://..." className="glass-card border-0" />
              </div>
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
                <AvatarImage src="/profile.jpg" alt={data.full_name} />
                <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                  {data.full_name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{data.full_name}</h3>
              <p className="text-muted-foreground text-sm">{data.title}</p>
              <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />{data.location}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-primary/10"><Globe className="w-4 h-4 text-primary" /></div>
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: Github, label: 'GitHub', field: 'github' },
                { icon: Linkedin, label: 'LinkedIn', field: 'linkedin' },
                { icon: Twitter, label: 'Twitter', field: 'twitter' },
                { icon: MessageCircle, label: 'WhatsApp', field: 'whatsapp' },
              ].map(({ icon: Icon, label, field }) => (
                <div key={field} className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2"><Icon className="w-4 h-4" />{label}</Label>
                  <Input value={data.social_links[field as keyof typeof data.social_links]} onChange={e => setSocial(field, e.target.value)} placeholder="https://..." className="glass-card border-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div className="flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </motion.div>
    </div>
    </PageLoader>
  );
};

export default ProfileManager;
