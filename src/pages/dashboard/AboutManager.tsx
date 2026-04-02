import { useState } from 'react';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { AboutManagerSkeleton } from '@/components/Skeletons';
import { User, Save, Mail, Phone, MapPin, Sparkles, Github, Linkedin, Twitter, MessageCircle, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getAbout, saveAbout, type AboutData } from '@/lib/store';
import { toast } from 'sonner';

const AboutManager = () => {
  const [data, setData] = useState<AboutData>(getAbout());
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    saveAbout(data);
    setTimeout(() => { toast.success('About info saved!'); setSaving(false); }, 600);
  };

  const set = (field: keyof AboutData, value: string) => setData(prev => ({ ...prev, [field]: value }));
  const setSocial = (field: string, value: string) => setData(prev => ({ ...prev, social_links: { ...prev.social_links, [field]: value } }));

  return (
    <PageLoader skeleton={<AboutManagerSkeleton />} delay={600}>
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-gradient-primary"><User className="w-5 h-5 text-white" /></div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">About Me</h1>
        </div>
        <p className="text-muted-foreground">Manage your personal info shown on the portfolio</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-primary/10"><Sparkles className="w-4 h-4 text-primary" /></div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Full Name</Label>
                  <Input value={data.full_name} onChange={e => set('full_name', e.target.value)} className="glass-card border-0" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Title</Label>
                  <Input value={data.title} onChange={e => set('title', e.target.value)} className="glass-card border-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Bio</Label>
                <Textarea value={data.bio} onChange={e => set('bio', e.target.value)} rows={6} placeholder="Write your bio here. Add a blank line between paragraphs." className="glass-card border-0 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> Email</Label>
                  <Input value={data.email} onChange={e => set('email', e.target.value)} className="glass-card border-0" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</Label>
                  <Input value={data.phone} onChange={e => set('phone', e.target.value)} className="glass-card border-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</Label>
                <Input value={data.location} onChange={e => set('location', e.target.value)} className="glass-card border-0" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Resume URL</Label>
                <Input value={data.resume_url} onChange={e => set('resume_url', e.target.value)} placeholder="https://..." className="glass-card border-0" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          {/* Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 rounded-lg bg-secondary/10"><Sparkles className="w-4 h-4 text-secondary" /></div>
                  Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Years Experience', field: 'years_experience' as keyof AboutData },
                  { label: 'Projects Completed', field: 'projects_completed' as keyof AboutData },
                  { label: 'Technologies', field: 'technologies' as keyof AboutData },
                ].map(({ label, field }) => (
                  <div key={field} className="space-y-2">
                    <Label className="text-muted-foreground text-xs">{label}</Label>
                    <Input value={data[field] as string} onChange={e => set(field, e.target.value)} className="glass-card border-0 text-center font-bold" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Links */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
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
                    <Input value={data.social_links[field as keyof typeof data.social_links]} onChange={e => setSocial(field, e.target.value)} placeholder={`https://...`} className="glass-card border-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
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

export default AboutManager;
