import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Github, Star, Sparkles, Layers } from "lucide-react";
import { getProjects, type ProjectItem } from "@/lib/store";

/* ─── 3D Tilt Card (Aceternity-style) ────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [spot, setSpot] = useState({ x: 0, y: 0 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });
  const scale   = useSpring(hovered ? 1.03 : 1, { stiffness: 300, damping: 25 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set((e.clientX - r.left) / r.width  - 0.5);
    rawY.set((e.clientY - r.top)  / r.height - 0.5);
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, [rawX, rawY]);

  const onLeave = useCallback(() => {
    rawX.set(0); rawY.set(0); setHovered(false);
  }, [rawX, rawY]);

  return (
    <div style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        className={`relative ${className}`}
      >
        {/* Aceternity spotlight */}
        {hovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(180px circle at ${spot.x}px ${spot.y}px, rgba(6,182,212,0.10), transparent 70%)`,
            }}
          />
        )}
        {/* Top shimmer bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl z-20"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(190,100%,50%), transparent)",
            opacity: hovered ? 0.8 : 0.2,
          }}
          transition={{ duration: 0.3 }}
        />
        {children}
      </motion.div>
    </div>
  );
}

type ProjectCardProps = {
  project: ProjectItem;
  index: number;
  onOpen: (project: ProjectItem) => void;
  isInView: boolean;
};

type ProjectDialogProps = {
  project: ProjectItem | null;
  onClose: () => void;
};

/* ─── Project Card ────────────────────────────────────────────── */
const ProjectCard = ({ project, index, onOpen, isInView }: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.95 }}
    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
    transition={{ duration: 0.6, delay: index * 0.1, type: "spring", bounce: 0.3 }}
  >
    <TiltCard className="h-full">
      <div
        className="glass-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-[0_25px_60px_rgba(6,182,212,0.15)] transition-all duration-500 group cursor-pointer h-full flex flex-col"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-video" style={{ transform: "translateZ(0px)" }}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Featured badge */}
          {project.favorite && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 0.3, type: "spring", bounce: 0.5 }}
              className="absolute top-3 right-3 z-10"
            >
              <Badge className="bg-gradient-to-r from-cyan-500 to-primary text-white border-0 shadow-glow gap-1">
                <Star className="w-3 h-3 fill-current" />
                Featured
              </Badge>
            </motion.div>
          )}

          {/* Hover action buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="bg-primary/90 hover:bg-primary text-white shadow-glow backdrop-blur-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                onClick={() => onOpen(project)}
              >
                View Details
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                className="glass-card hover:bg-primary/10 hover:border-primary/50 backdrop-blur-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                onClick={(e) => { e.stopPropagation(); window.open(project.github, "_blank"); }}
              >
                <Github className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col relative z-10" style={{ transform: "translateZ(20px)" }}>
          {/* Glow orb */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag: string, i: number) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.08 + i * 0.04, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.1, y: -1 }}
              >
                <Badge
                  variant="outline"
                  className="text-xs border-primary/20 text-primary/80 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-default"
                >
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </TiltCard>
  </motion.div>
);

/* ─── Project Dialog ──────────────────────────────────────────── */
const categoryColors: Record<string, string> = {
  web:    "from-cyan-500 to-blue-500",
  mobile: "from-emerald-500 to-teal-500",
  design: "from-violet-500 to-purple-500",
};

const ProjectDialog = ({ project, onClose }: ProjectDialogProps) => {
  if (!project) return null;
  const gradient = categoryColors[project.category] ?? "from-cyan-500 to-primary";

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 overflow-hidden glass-card border-0 rounded-none">
        <div className="h-full overflow-y-auto">
          <div className="min-h-full p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-stretch">
                <div className="relative min-h-[280px] md:min-h-[420px] lg:min-h-[520px] overflow-hidden rounded-3xl border border-primary/20">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.04 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 shadow-lg capitalize px-3 py-1`}>
                      {project.category}
                    </Badge>
                    {project.favorite && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg gap-1 px-3 py-1">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <DialogTitle className={`text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent leading-tight mb-2`}>
                      {project.title}
                    </DialogTitle>
                    <p className="text-white/80 text-sm md:text-base max-w-2xl">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                  {[
                    { label: "Category", value: project.category, icon: "🗂️" },
                    { label: "Tech Stack", value: `${project.tags.length} tools`, icon: "⚙️" },
                    { label: "Status", value: "Completed", icon: "✅" },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="glass-card rounded-2xl p-5 border border-border/50 text-center lg:text-left flex flex-col justify-center min-h-[120px]"
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <p className={`text-base font-bold mt-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent capitalize`}>
                        {s.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </motion.div>
                  ))}

                  <div className="sm:col-span-3 lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    <Button
                      className={`w-full h-12 bg-gradient-to-r ${gradient} hover:opacity-90 text-white shadow-glow gap-2 font-semibold text-base`}
                      onClick={() => window.open(project.demo, "_blank")}
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 glass-card border-primary/30 hover:border-primary/60 hover:bg-primary/8 hover:text-primary gap-2 font-semibold text-base transition-all duration-300"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github className="w-5 h-5" />
                      View Code
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="glass-card rounded-3xl border border-border/50 p-6 md:p-8">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`} />
                    About this project
                  </h4>
                  <DialogDescription className="text-base md:text-lg text-foreground/90 leading-relaxed">
                    {project.longDescription}
                  </DialogDescription>
                </div>

                <div className="glass-card rounded-3xl border border-border/50 p-6 md:p-8">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`} />
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {project.tags.map((tag: string, i: number) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25 + i * 0.04 }}
                      >
                        <Badge
                          variant="outline"
                          className="px-3 py-1.5 text-sm font-semibold border-primary/25 text-primary/90"
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ─── Main Component ──────────────────────────────────────────── */
const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const allProjects = getProjects();

  const favoriteProjects = allProjects.filter(p => p.favorite);
  const webProjects      = allProjects.filter(p => p.category === "web");
  const mobileProjects   = allProjects.filter(p => p.category === "mobile");

  return (
    <section id="projects" className="py-24 bg-background relative overflow-hidden" ref={ref}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 11, repeat: Infinity, delay: 3 }}
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-violet-500 rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 text-primary text-sm font-semibold mb-6"
          >
            <Layers className="w-4 h-4" />
            Portfolio Showcase
            <Sparkles className="w-4 h-4" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Featured{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 via-primary to-violet-500 bg-clip-text text-transparent">
                Projects
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A showcase of my recent work and personal projects
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-12"
          >
            <TabsList className="glass-card border border-border/50 p-1 rounded-2xl gap-1">
              <TabsTrigger
                value="favorites"
                className="rounded-xl px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300 flex items-center gap-2"
              >
                <Star className="w-4 h-4" /> Favorites
              </TabsTrigger>
              <TabsTrigger
                value="web"
                className="rounded-xl px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
              >
                Web
              </TabsTrigger>
              <TabsTrigger
                value="mobile"
                className="rounded-xl px-5 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
              >
                Mobile
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {[
            { value: "favorites", list: favoriteProjects },
            { value: "web",       list: webProjects },
            { value: "mobile",    list: mobileProjects },
          ].map(({ value, list }) => (
            <TabsContent key={value} value={value}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {list.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      onOpen={setSelectedProject}
                      isInView={isInView}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

export default Projects;
