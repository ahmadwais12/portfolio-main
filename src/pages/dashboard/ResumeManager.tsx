import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { ResumeManagerSkeleton } from '@/components/Skeletons';
import { Plus, Edit2, Trash2, Briefcase, GraduationCap, Award, Sparkles, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getResume, saveResume, type ResumeItem } from '@/lib/store';
import { toast } from 'sonner';
import { LocalizedField } from '@/components/dashboard/LocalizedField';
import { localizedValues, type ContentLanguage } from '@/lib/localization';

const iconMap = { work: Briefcase, education: GraduationCap, certification: Award };
const colorMap = { work: 'from-cyan-500 to-blue-500', education: 'from-purple-500 to-violet-500', certification: 'from-yellow-500 to-orange-500' };
const badgeColor = { work: 'bg-cyan-500/10 text-cyan-500', education: 'bg-purple-500/10 text-purple-500', certification: 'bg-yellow-500/10 text-yellow-500' };

const empty: Omit<ResumeItem, 'id'> = { type: 'work', title: '', organization: '', period: '', description: '' };

const ResumeManager = () => {
  const [items, setItems] = useState<ResumeItem[]>(getResume());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ResumeItem | null>(null);
  const [form, setForm] = useState<Omit<ResumeItem, 'id'>>(empty);
  const setLocalized = (field: string, language: ContentLanguage, value: string, syncBase = true) => setForm(current => ({
    ...current,
    [`${field}_${language}`]: value,
    ...(language === 'en' && syncBase ? { [field]: value } : {}),
  }));

  const [saving, setSaving] = useState(false);
  const persist = async (updated: ResumeItem[], message: string) => {
    setSaving(true);
    try {
      await saveResume(updated);
      setItems(updated);
      toast.success(message);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unable to save resume');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.organization) { toast.error('Title and organization are required'); return; }
    const saved = selected
      ? await persist(items.map(i => i.id === selected.id ? { ...i, ...form } : i), 'Updated successfully')
      : await persist([...items, { ...form, id: crypto.randomUUID() }], 'Added successfully');
    if (saved) setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (await persist(items.filter(i => i.id !== selected.id), 'Deleted')) setIsDeleteOpen(false);
  };

  const openEdit = (item: ResumeItem) => { setSelected(item); setForm(item); setIsDialogOpen(true); };
  const openCreate = () => { setSelected(null); setForm(empty); setIsDialogOpen(true); };
  const openDelete = (item: ResumeItem) => { setSelected(item); setIsDeleteOpen(true); };

  return (
    <PageLoader skeleton={<ResumeManagerSkeleton />} delay={600}>
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-gradient-primary"><FileText className="w-5 h-5 text-white" /></div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Resume & Experience</h1>
          </div>
          <p className="text-muted-foreground">Manage your work, education and certifications</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
          <Plus className="w-4 h-4" /> Add Entry
        </Button>
      </motion.div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary" />
        <div className="space-y-6">
          <AnimatePresence>
            {items.map((item, index) => {
              const Icon = iconMap[item.type];
              const gradient = colorMap[item.type];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-20"
                >
                  <div className={`absolute left-4 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-glow`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Card className="glass-card border-0 hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <Badge className={`text-xs ${badgeColor[item.type]} border-0 capitalize`}>{item.type}</Badge>
                          </div>
                          <p className={`text-sm font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-1`}>{item.organization}</p>
                          <p className="text-xs text-muted-foreground mb-2">{item.period}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => openEdit(item)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => openDelete(item)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-0 max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-gradient-primary"><Sparkles className="w-4 h-4 text-white" /></div>
              {selected ? 'Edit Entry' : 'Add New Entry'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Type</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as ResumeItem['type'] })}>
                <SelectTrigger className="glass-card border-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <LocalizedField label="Type Display Text" value={{ en: form.type_label_en || form.type }} onChange={(language, value) => setLocalized('type_label', language, value, false)} />
            <LocalizedField label="Title" required value={localizedValues(form, 'title')} onChange={(language, value) => setLocalized('title', language, value)} />
            <LocalizedField label="Organization" required value={localizedValues(form, 'organization')} onChange={(language, value) => setLocalized('organization', language, value)} />
            <LocalizedField label="Period" value={localizedValues(form, 'period')} onChange={(language, value) => setLocalized('period', language, value)} placeholder="e.g. 2020 - Present" />
            <LocalizedField label="Description" value={localizedValues(form, 'description')} onChange={(language, value) => setLocalized('description', language, value)} multiline rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void handleSave()} disabled={saving} className="bg-gradient-primary hover:opacity-90 shadow-glow">
              {saving ? 'Saving...' : selected ? 'Save Changes' : 'Add Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="glass-card border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/20"><Trash2 className="w-4 h-4 text-red-500" /></div>
              Delete Entry?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{selected?.title}</span>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); void handleDelete(); }} disabled={saving} className="bg-red-500 hover:bg-red-600 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </PageLoader>
  );
};

export default ResumeManager;
