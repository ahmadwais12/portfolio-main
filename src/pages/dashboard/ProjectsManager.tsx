import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLoader from '@/components/PageLoader';
import { ProjectsManagerSkeleton } from '@/components/Skeletons';
import {
  Plus, Search, Edit2, Trash2, Star, ExternalLink,
  Github, Grid3X3, List, FolderGit2, Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase, type Project } from '@/lib/supabase';
import { toast } from 'sonner';

// Dummy data for preview
const dummyProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React, Node.js, and MongoDB',
    long_description: 'A comprehensive e-commerce platform featuring user authentication, product management, shopping cart functionality, payment integration with Stripe, and an admin dashboard.',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'web',
    favorite: true,
    github_url: 'https://github.com',
    demo_url: 'https://demo.com',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management tool built with MERN stack',
    long_description: 'Real-time collaborative task management application with team workspaces, real-time updates using Socket.io, and progress tracking.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    tags: ['React', 'Express', 'MongoDB', 'Socket.io'],
    category: 'web',
    favorite: false,
    github_url: 'https://github.com',
    demo_url: 'https://demo.com',
    created_at: '2024-02-20',
  },
  {
    id: '3',
    title: 'Fitness Tracking Mobile App',
    description: 'Flutter-based fitness tracker with workout plans and progress monitoring',
    long_description: 'Cross-platform mobile fitness application with customizable workout plans, exercise tracking, and progress visualization.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
    tags: ['Flutter', 'Dart', 'Firebase'],
    category: 'mobile',
    favorite: true,
    github_url: 'https://github.com',
    demo_url: 'https://demo.com',
    created_at: '2024-03-10',
  },
  {
    id: '4',
    title: 'Weather Forecast App',
    description: 'Mobile weather app with real-time forecasts and beautiful UI',
    long_description: 'Beautiful weather forecast application featuring real-time weather data, 7-day forecasts, and location-based weather.',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop',
    tags: ['Flutter', 'OpenWeather API', 'Animations'],
    category: 'mobile',
    favorite: false,
    github_url: 'https://github.com',
    demo_url: 'https://demo.com',
    created_at: '2024-03-25',
  },
];

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>(dummyProjects);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    long_description: '',
    image: '',
    tags: [],
    category: 'web',
    favorite: false,
    github_url: '',
    demo_url: '',
  });

  const handleSave = () => {
    if (selectedProject?.id) {
      setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...formData } as Project : p));
      toast.success('Project updated successfully');
    } else {
      const newProject: Project = {
        ...formData as Project,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setProjects([newProject, ...projects]);
      toast.success('Project created successfully');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (!selectedProject?.id) return;
    setProjects(projects.filter(p => p.id !== selectedProject.id));
    toast.success('Project deleted successfully');
    setIsDeleteDialogOpen(false);
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormData(project);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedProject(null);
    setFormData({
      title: '',
      description: '',
      long_description: '',
      image: '',
      tags: [],
      category: 'web',
      favorite: false,
      github_url: '',
      demo_url: '',
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const allCategories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projects.filter(
    (p) =>
      (activeCategory === 'all' || p.category === activeCategory) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <PageLoader skeleton={<ProjectsManagerSkeleton />} delay={600}>
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <FolderGit2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Projects
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage and showcase your portfolio projects
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={openCreateDialog}
            className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </motion.div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="glass-card border-0">
            {allCategories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="capitalize data-[state=active]:bg-gradient-primary data-[state=active]:text-white">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Search and View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-0"
          />
        </div>
        <div className="flex items-center gap-2 glass-card rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-gradient-primary text-white' : ''}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-gradient-primary text-white' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Card className="group relative overflow-hidden glass-card border-0 hover:shadow-glow transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="aspect-video relative overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <AnimatePresence>
                      {project.favorite && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          className="absolute top-3 right-3"
                        >
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-3 left-3 right-3 flex gap-2"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 bg-white/90 backdrop-blur-sm"
                        onClick={() => window.open(project.github_url, '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 bg-white/90 backdrop-blur-sm"
                        onClick={() => window.open(project.demo_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </Button>
                    </motion.div>
                  </div>
                  <CardContent className="relative z-10 p-5">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs glass-card">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                        onClick={() => openEditDialog(project)}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-200"
                        onClick={() => openDeleteDialog(project)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="glass-card border-0 overflow-hidden">
              <div className="divide-y divide-border/50">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      {project.favorite && (
                        <div className="absolute top-1 right-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {project.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm truncate">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(project.github_url, '_blank')}
                      >
                        <Github className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(project.demo_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(project)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => openDeleteDialog(project)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {selectedProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Project title"
                  className="glass-card border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'web' | 'mobile' | 'design') =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="glass-card border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Short Description *</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
                className="glass-card border-0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Long Description</Label>
              <Textarea
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                placeholder="Detailed project description"
                rows={4}
                className="glass-card border-0 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Image URL *</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="glass-card border-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">GitHub URL</Label>
                <Input
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="glass-card border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Demo URL</Label>
                <Input
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  placeholder="https://..."
                  className="glass-card border-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground">Tags (comma-separated)</Label>
              <Input
                value={formData.tags?.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="React, TypeScript, Node.js"
                className="glass-card border-0"
              />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Switch
                checked={formData.favorite}
                onCheckedChange={(checked) => setFormData({ ...formData, favorite: checked })}
              />
              <Label className="cursor-pointer">
                <span className="font-medium">Featured Project</span>
                <p className="text-sm text-muted-foreground">Show this project on the featured section</p>
              </Label>
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
              {selectedProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass-card border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              Delete Project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">{selectedProject?.title}</span>?
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

export default ProjectsManager;
