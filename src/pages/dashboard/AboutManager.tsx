import { useState } from 'react';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { AboutManagerSkeleton } from '@/components/Skeletons';
import { User, Save, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUploadField } from '@/components/FileUploadField';
import { getAbout, saveAbout, type AboutData } from '@/lib/store';
import { toast } from 'sonner';
import { LocalizedField } from '@/components/dashboard/LocalizedField';
import { localizedValues, type ContentLanguage } from '@/lib/localization';

const AboutManager = () => {
  const [data, setData] = useState<AboutData>(getAbout());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAbout(data);
      toast.success('About info saved!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unable to save about info');
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof AboutData, value: string) => setData(prev => ({ ...prev, [field]: value }));
  const setUniversal = (field: 'email' | 'phone', value: string) => setData(prev => ({
    ...prev,
    [field]: value,
    [`${field}_en`]: value,
  }));
  const setLocalized = (field: string, language: ContentLanguage, value: string) => {
    set(`${field}_${language}` as keyof AboutData, value);
    if (language === 'en') set(field as keyof AboutData, value);
  };

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
              <LocalizedField label="Full Name" value={localizedValues(data, 'full_name')} onChange={(language, value) => setLocalized('full_name', language, value)} />
              <LocalizedField label="Professional Titles" value={localizedValues(data, 'title')} onChange={(language, value) => setLocalized('title', language, value)} multiline rows={3} placeholder={'Full-Stack Developer\nFlutter Developer'} />
              <p className="-mt-1 text-xs text-muted-foreground">Add several titles — one per line (commas work too). They rotate in the hero section.</p>
              <LocalizedField label="Bio" value={localizedValues(data, 'bio')} onChange={(language, value) => setLocalized('bio', language, value)} multiline rows={5} placeholder="Write your bio here." />
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email</Label>
                <Input type="email" dir="ltr" value={data.email_en || data.email} onChange={e => setUniversal('email', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Phone</Label>
                <Input type="tel" dir="ltr" value={data.phone_en || data.phone} onChange={e => setUniversal('phone', e.target.value)} />
              </div>
              <LocalizedField label="Location" value={localizedValues(data, 'location')} onChange={(language, value) => setLocalized('location', language, value)} />
              <FileUploadField label="Resume (PDF)" value={data.resume_url} onChange={url => set('resume_url', url)} bucket="portfolio-assets" prefix="resume" kind="pdf" />
              <FileUploadField label="Profile Image" value={data.avatar_url} onChange={url => set('avatar_url', url)} bucket="profile-images" prefix="avatar" deletePreviousOnReplace />
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
              <CardContent className="space-y-4">
                {[
                  { label: 'Years Experience', field: 'years_experience' },
                  { label: 'Projects Completed', field: 'projects_completed' },
                  { label: 'Technologies', field: 'technologies' },
                ].map(({ label, field }) => (
                  <LocalizedField key={field} label={label} value={localizedValues(data, field)} onChange={(language, value) => setLocalized(field, language, value)} />
                ))}
              </CardContent>
            </Card>
          </motion.div>

        </div>
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

export default AboutManager;
