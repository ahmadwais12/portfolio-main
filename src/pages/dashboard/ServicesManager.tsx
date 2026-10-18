import { useState } from 'react';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { ServicesManagerSkeleton } from '@/components/Skeletons';
import { Plus, Search, Edit2, Trash2, Briefcase, Sparkles, Zap, Code, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getServices, saveServices, type ServiceItem as Service } from '@/lib/store';
import { toast } from 'sonner';
import { LocalizedField } from '@/components/dashboard/LocalizedField';
import { localizedValues, splitLocalizedList, type ContentLanguage } from '@/lib/localization';

const iconMap: Record<string, React.ElementType> = {
  Code,
  Globe,
  Zap,
  Sparkles,
  Briefcase,
};

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>(getServices());
  const [saving, setSaving] = useState(false);
  const persistServices = async (updated: Service[], message: string) => {
    setSaving(true);
    try {
      await saveServices(updated);
      setServices(updated);
      toast.success(message);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unable to save services');
      return false;
    } finally {
      setSaving(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon: 'Code',
    features: [],
  });
  const setLocalized = (field: string, language: ContentLanguage, value: string) => setFormData(current => ({
    ...current,
    [`${field}_${language}`]: field === 'features' ? splitLocalizedList(value) : value,
    ...(language === 'en' ? { [field]: field === 'features' ? splitLocalizedList(value) : value } : {}),
  }));

  const handleSave = async () => {
    if (!formData.title?.trim()) { toast.error('Title is required'); return; }
    const saved = selectedService?.id
      ? await persistServices(services.map(s => s.id === selectedService.id ? { ...s, ...formData } as Service : s), 'Service updated successfully')
      : await persistServices([...services, { ...formData as Service, features: formData.features ?? [], id: crypto.randomUUID() }], 'Service created successfully');
    if (saved) setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedService?.id) return;
    if (await persistServices(services.filter(s => s.id !== selectedService.id), 'Service deleted successfully')) setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setFormData(service);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Code',
      features: [],
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLoader skeleton={<ServicesManagerSkeleton />} delay={600}>
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Services
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your services and offerings
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={openCreateDialog}
            className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-0"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            No services found. Add your first service to get started.
          </div>
        ) : (
          filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group glass-card border-0 hover:shadow-glow transition-all duration-500 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs glass-card">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {feature}
                          </Badge>
                        ))}
                        {service.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{service.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                          onClick={() => openEditDialog(service)}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-200"
                          onClick={() => openDeleteDialog(service)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto glass-card border-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {selectedService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <LocalizedField label="Service Title" required value={localizedValues(formData, 'title')} onChange={(language, value) => setLocalized('title', language, value)} placeholder="e.g., Web Development" />
            <LocalizedField label="Description" required value={localizedValues(formData, 'description')} onChange={(language, value) => setLocalized('description', language, value)} multiline rows={3} placeholder="Describe your service..." />
            <LocalizedField label="Features (one per line or comma-separated)" value={localizedValues(formData, 'features')} onChange={(language, value) => setLocalized('features', language, value)} multiline rows={4} placeholder="Responsive design&#10;Accessible layouts" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleSave()}
              disabled={saving}
              className="bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              {saving ? 'Saving...' : selectedService ? 'Save Changes' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass-card border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              Delete Service?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{selectedService?.title}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); void handleDelete(); }}
              disabled={saving}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </PageLoader>
  );
};

export default ServicesManager;
