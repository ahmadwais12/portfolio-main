import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { SkillsManagerSkeleton } from '@/components/Skeletons';
import { Plus, Search, Edit2, Trash2, Wrench, Sparkles, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { getSkills, saveSkills, type SkillItem } from '@/lib/store';
import { toast } from 'sonner';

const categories = ['Frontend', 'Backend', 'Mobile', 'Languages', 'DevOps', 'Design', 'Other'];

const categoryColors: Record<string, string> = {
  Frontend: 'from-cyan-500 to-blue-500',
  Backend: 'from-purple-500 to-violet-500',
  Mobile: 'from-green-500 to-emerald-500',
  Languages: 'from-yellow-500 to-orange-500',
  DevOps: 'from-red-500 to-pink-500',
  Design: 'from-pink-500 to-rose-500',
  Other: 'from-gray-500 to-slate-500',
};

const SkillsManager = () => {
  const [skills, setSkills] = useState<SkillItem[]>(getSkills());
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<SkillItem | null>(null);
  const [form, setForm] = useState<Omit<SkillItem, 'id'>>({ name: '', category: 'Frontend', level: 80 });

  const persist = (updated: SkillItem[]) => { setSkills(updated); saveSkills(updated); };

  const handleSave = () => {
    if (!form.name) { toast.error('Skill name is required'); return; }
    if (selected) {
      persist(skills.map(s => s.id === selected.id ? { ...s, ...form } : s));
      toast.success('Skill updated');
    } else {
      persist([...skills, { ...form, id: Date.now().toString() }]);
      toast.success('Skill added');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    persist(skills.filter(s => s.id !== selected.id));
    toast.success('Skill deleted');
    setIsDeleteOpen(false);
  };

  const openEdit = (s: SkillItem) => { setSelected(s); setForm(s); setIsDialogOpen(true); };
  const openCreate = () => { setSelected(null); setForm({ name: '', category: 'Frontend', level: 80 }); setIsDialogOpen(true); };
  const openDelete = (s: SkillItem) => { setSelected(s); setIsDeleteOpen(true); };

  const filtered = skills.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = filtered.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, SkillItem[]>);

  const avgLevel = skills.length ? Math.round(skills.reduce((s, k) => s + k.level, 0) / skills.length) : 0;
  const expertCount = skills.filter(s => s.level >= 90).length;

  return (
    <PageLoader skeleton={<SkillsManagerSkeleton />} delay={600}>
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-gradient-primary"><Wrench className="w-5 h-5 text-white" /></div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Skills</h1>
          </div>
          <p className="text-muted-foreground">Manage your skills and expertise</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Skills', value: skills.length, icon: Wrench, color: 'from-cyan-500 to-blue-500' },
          { label: 'Avg. Level', value: `${avgLevel}%`, icon: BarChart2, color: 'from-purple-500 to-violet-500' },
          { label: 'Expert (90%+)', value: expertCount, icon: Sparkles, color: 'from-green-500 to-emerald-500' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card border-0">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} shadow-lg`}><Icon className="w-5 h-5 text-white" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search skills..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 glass-card border-0" />
      </div>

      {/* Grouped Skills */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([category, catSkills], catIndex) => {
          const gradient = categoryColors[category] || 'from-cyan-500 to-blue-500';
          return (
            <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: catIndex * 0.1 }}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`} />
                <h3 className={`text-lg font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{category}</h3>
                <Badge variant="secondary" className="text-xs">{catSkills.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {catSkills.map((skill, i) => (
                    <motion.div key={skill.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                      <Card className="group glass-card border-0 hover:shadow-glow transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold group-hover:text-primary transition-colors">{skill.name}</h4>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary/10 hover:text-primary" onClick={() => openEdit(skill)}>
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-500/10" onClick={() => openDelete(skill)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-muted-foreground">Proficiency</span>
                            <span className={`font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.8, delay: i * 0.05 }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-gradient-primary"><Sparkles className="w-4 h-4 text-white" /></div>
              {selected ? 'Edit Skill' : 'Add New Skill'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Skill Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., React.js" className="glass-card border-0" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger className="glass-card border-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-muted-foreground">Proficiency: <span className="font-bold text-foreground">{form.level}%</span></Label>
              <Slider value={[form.level]} onValueChange={([v]) => setForm({ ...form, level: v })} min={0} max={100} step={5} className="py-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Beginner</span><span>Intermediate</span><span>Expert</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90 shadow-glow">
              {selected ? 'Save Changes' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="glass-card border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-500/20"><Trash2 className="w-4 h-4 text-red-500" /></div>
              Delete Skill?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Delete <span className="font-semibold text-foreground">{selected?.name}</span>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </PageLoader>
  );
};

export default SkillsManager;
