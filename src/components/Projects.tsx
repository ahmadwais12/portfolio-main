import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const allProjects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React, Node.js, and MongoDB",
      image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "web",
      favorite: true,
      github: "https://github.com",
      demo: "https://demo.com",
      longDescription: "A comprehensive e-commerce platform featuring user authentication, product management, shopping cart functionality, payment integration with Stripe, and an admin dashboard for managing orders and inventory.",
    },
    {
      title: "Task Management App",
      description: "Collaborative task management tool built with MERN stack",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
      tags: ["React", "Express", "MongoDB", "Socket.io"],
      category: "web",
      favorite: false,
      github: "https://github.com",
      demo: "https://demo.com",
      longDescription: "Real-time collaborative task management application with features like team workspaces, real-time updates using Socket.io, task assignments, progress tracking, and deadline reminders.",
    },
    {
      title: "Fitness Tracking Mobile App",
      description: "Flutter-based fitness tracker with workout plans and progress monitoring",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
      tags: ["Flutter", "Dart", "Firebase", "Material Design"],
      category: "mobile",
      favorite: true,
      github: "https://github.com",
      demo: "https://demo.com",
      longDescription: "Cross-platform mobile fitness application with customizable workout plans, exercise tracking, nutrition logging, progress visualization with charts, and social features for sharing achievements.",
    },
    {
      title: "Real Estate Portal",
      description: "Property listing platform with advanced search and filters",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      tags: ["Next.js", "PostgreSQL", "Tailwind", "Google Maps API"],
      category: "web",
      favorite: false,
      github: "https://github.com",
      demo: "https://demo.com",
      longDescription: "Modern real estate platform featuring property listings with image galleries, advanced search filters, interactive maps, virtual tours, contact forms, and agent dashboards for property management.",
    },
    {
      title: "Social Media Dashboard",
      description: "Analytics dashboard for social media management and insights",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      tags: ["React", "D3.js", "Node.js", "REST APIs"],
      category: "web",
      favorite: true,
      github: "https://github.com",
      demo: "https://demo.com",
      longDescription: "Comprehensive social media analytics dashboard with data visualization, engagement metrics, scheduling features, multi-platform integration, and automated reporting capabilities.",
    },
    {
      title: "Weather Forecast App",
      description: "Mobile weather app with real-time forecasts and beautiful UI",
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
      tags: ["Flutter", "OpenWeather API", "BLoC", "Animations"],
      category: "mobile",
      favorite: false,
      github: "https://github.com",
      demo: "https://demo.com",
      longDescription: "Beautiful weather forecast application featuring real-time weather data, 7-day forecasts, location-based weather, severe weather alerts, and smooth animations with an intuitive user interface.",
    },
    {
      title: "Food Delivery App",
      description: "Full-featured mobile food ordering and delivery application",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
      tags: ["Flutter", "Firebase", "Google Maps", "Stripe"],
      category: "mobile",
      favorite: true,
      github: "https://github.com",
      demo: "https://demo.com",
      longDescription: "Comprehensive food delivery application with restaurant browsing, menu viewing, cart management, real-time order tracking, payment integration, and rider assignment system.",
    },
  ];

  const favoriteProjects = allProjects.filter(p => p.favorite);
  const webProjects = allProjects.filter(p => p.category === "web");
  const mobileProjects = allProjects.filter(p => p.category === "mobile");

  return (
    <section id="projects" className="py-20 bg-background relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A showcase of my recent work and personal projects
          </p>
        </motion.div>

        <Tabs defaultValue="favorites" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoriteProjects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} onOpen={setSelectedProject} isInView={isInView} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="web">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {webProjects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} onOpen={setSelectedProject} isInView={isInView} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mobile">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mobileProjects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} onOpen={setSelectedProject} isInView={isInView} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

const ProjectCard = ({ project, index, onOpen, isInView }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    whileHover={{ y: -8 }}
  >
    <Card className="overflow-hidden glass-card hover:border-primary/50 hover:shadow-glow-lg transition-all duration-500 group cursor-pointer h-full flex flex-col relative">
      {/* Decorative corner gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500" />
      
      <div className="relative overflow-hidden aspect-video">
        {project.favorite && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring", bounce: 0.5 }}
            className="absolute top-3 right-3 z-10"
          >
            <Badge className="bg-gradient-primary text-primary-foreground shadow-glow">
              <Star className="w-3 h-3 mr-1 fill-current animate-pulse" />
              Featured
            </Badge>
          </motion.div>
        )}
        
        {/* Image with overlay */}
        <div className="relative w-full h-full">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        {/* Hover action buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            className="bg-gradient-primary hover:opacity-90 shadow-glow-lg backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            onClick={() => onOpen(project)}
          >
            View Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="glass-card backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
            onClick={() => window.open(project.github, "_blank")}
          >
            <Github className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col relative z-10">
        <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-all duration-300">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag: string, i: number) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + i * 0.05 }}
            >
              <Badge variant="secondary" className="text-xs glass-card group-hover:border-primary/30 transition-colors">
                {tag}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  </motion.div>
);

const ProjectDialog = ({ project, onClose }: any) => {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DialogTitle className="text-3xl font-bold text-gradient mb-2">
              {project.title}
            </DialogTitle>
          </motion.div>
        </DialogHeader>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-glow-lg">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            {project.favorite && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-primary text-primary-foreground shadow-glow">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Featured
                </Badge>
              </div>
            )}
          </div>

          <DialogDescription className="text-base text-foreground leading-relaxed">
            {project.longDescription}
          </DialogDescription>

          <div>
            <h4 className="font-semibold mb-4 text-lg text-gradient">Technologies Used:</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string, i: number) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <Badge variant="secondary" className="glass-card text-sm px-3 py-1">
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 pt-4"
          >
            <Button
              className="flex-1 bg-gradient-primary hover:opacity-90 shadow-glow-lg group relative overflow-hidden"
              onClick={() => window.open(project.demo, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">Live Demo</span>
              <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 glass-card group relative overflow-hidden"
              onClick={() => window.open(project.github, "_blank")}
            >
              <Github className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">View Code</span>
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default Projects;
