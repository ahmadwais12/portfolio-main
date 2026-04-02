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
import { supabase, type Service } from '@/lib/supabase';
import { toast } from 'sonner';

// Dummy data
const dummyServices: Service[] = [
  {
    id: '1',
    title: 'Web Development',
    description: 'Full-stack web development using modern technologies like React, Node.js, and more.',
    icon: 'Code',
    features: ['Responsive Design', 'API Integration', 'Database Setup', 'Deployment'],
    created_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Mobile Apps',
    description: 'Cross-platform mobile application development with Flutter and React Native.',
    icon: 'Smartphone',
    features: ['iOS & Android', 'Native Features', 'Push Notifications', 'App Store Publish'],
    created_at: '2024-02-20',
  },
  {
    id: '3',
    title: 'UI/UX Design',
    description: 'Beautiful and intuitive user interface design for web and mobile applications.',
    icon: 'Palette',
    features: ['Wireframing', 'Prototyping', 'User Research', 'Design Systems'],
    created_at: '2024-03-10',
  },
];

const iconMap: Record<string, React.ElementType> = {
  Code,
  Globe,
  Zap,
  Sparkles,
  Briefcase,
};

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>(dummyServices);
  const [loading, setLoading] = useState(false);
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
  const [featureInput, setFeatureInput] = useState('');

  const handleSave = () => {
    if (selectedService?.id) {
      setServices(services.map(s => s.id === selectedService.id ? { ...s, ...formData } as Service : s));
      toast.success('Service updated successfully');
    } else {
      const newService: Service = {
        ...formData as Service,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setServices([...services, newService]);
      toast.success('Service created successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (!selectedService?.id) return;
    setServices(services.filter(s => s.id !== selectedService.id));
    toast.success('Service deleted successfully');
    setIsDeleteDialogOpen(false);
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
    setFeatureInput('');
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index) || [],
    });
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
        {loading ? (
          <div className="col-span-3 text-center py-12">Loading...</div>
        ) : filteredServices.length === 0 ? (
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
            <div className="space-y-2">
              <Label className="text-muted-foreground">Service Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Web Development"
                className="glass-card border-0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service..."
                rows={3}
                className="glass-card border-0 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Features</Label>
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a feature..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  className="glass-card border-0"
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features?.map((feature, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 glass-card"
                    onClick={() => removeFeature(idx)}
                  >
                    {feature} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              {selectedService ? 'Save Changes' : 'Add Service'}
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
              onClick={handleDelete}
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
