import { useState } from 'react';
import { motion } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { TestimonialsManagerSkeleton } from '@/components/Skeletons';
import { Plus, Search, Edit2, Trash2, Star, Quote, MessageSquare, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { supabase, type Testimonial } from '@/lib/supabase';
import { toast } from 'sonner';

// Dummy data
const dummyTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechCorp',
    content: 'Amazing work! The project was delivered on time and exceeded all expectations. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'InnovateLabs',
    content: 'Professional, skilled, and great communication throughout the project. Will definitely work together again.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'CTO',
    company: 'StartupXYZ',
    content: 'Excellent technical skills and attention to detail. The final product was exactly what we needed.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    rating: 4,
  },
];

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(dummyTestimonials);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    company: '',
    content: '',
    image: '',
    rating: 5,
  });

  const handleSave = () => {
    if (selectedTestimonial?.id) {
      setTestimonials(testimonials.map(t => t.id === selectedTestimonial.id ? { ...t, ...formData } as Testimonial : t));
      toast.success('Testimonial updated successfully');
    } else {
      const newTestimonial: Testimonial = {
        ...formData as Testimonial,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setTestimonials([newTestimonial, ...testimonials]);
      toast.success('Testimonial created successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (!selectedTestimonial?.id) return;
    setTestimonials(testimonials.filter(t => t.id !== selectedTestimonial.id));
    toast.success('Testimonial deleted successfully');
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setFormData(testimonial);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedTestimonial(null);
    setFormData({
      name: '',
      role: '',
      company: '',
      content: '',
      image: '',
      rating: 5,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLoader skeleton={<TestimonialsManagerSkeleton />} delay={600}>
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Testimonials
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage client testimonials and reviews
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={openCreateDialog}
            className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
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
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-0"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-12">Loading...</div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            No testimonials found. Add your first testimonial to get started.
          </div>
        ) : (
          filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group glass-card border-0 hover:shadow-glow transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 border-2 border-primary/20">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold group-hover:text-primary transition-colors">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role} at {testimonial.company}
                          </p>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 relative">
                        <Quote className="w-6 h-6 text-primary/20 absolute -top-2 -left-2" />
                        <p className="text-muted-foreground text-sm pl-4 italic">
                          {testimonial.content}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                          onClick={() => openEditDialog(testimonial)}
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-200"
                          onClick={() => openDeleteDialog(testimonial)}
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
        <DialogContent className="max-w-lg glass-card border-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {selectedTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Client name"
                  className="glass-card border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="glass-card border-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Role</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., CEO"
                  className="glass-card border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Company</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                  className="glass-card border-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Rating</Label>
              <div className="flex gap-2 p-3 rounded-lg bg-muted/30">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (formData.rating || 0)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Testimonial Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the testimonial here..."
                rows={4}
                className="glass-card border-0 resize-none"
              />
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
              {selectedTestimonial ? 'Save Changes' : 'Add Testimonial'}
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
              Delete Testimonial?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the testimonial from{' '}
              <span className="font-semibold text-foreground">{selectedTestimonial?.name}</span>?
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

export default TestimonialsManager;
