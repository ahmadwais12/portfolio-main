import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Github, Star, Layers, FolderGit2, ArrowUpRight } from "lucide-react";
import { EmptyState, SectionHeader } from "@/components/SectionHeader";
import { usePortfolio, type ProjectItem } from "@/lib/store";
import { trackAnalyticsEvent } from "@/analytics/tracker";
import { useUiText } from "@/lib/localization";
import SectionViewAll from "@/components/SectionViewAll";

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
const ProjectCard = ({ project, index, onOpen, isInView }: ProjectCardProps) => {
  const t = useUiText();
  return (
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
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
              <FolderGit2 className="h-12 w-12 text-primary/50" />
            </div>
          )}
          <Badge variant="outline" className="absolute left-3 top-3 z-10 border-white/20 bg-background/70 capitalize backdrop-blur-md">
            {project.category}
          </Badge>
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
                {t("projects.featured", "Featured")}
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
                {t("projects.viewDetails", "View Details")}
              </Button>
            </motion.div>
            {project.github_url && <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                aria-label={t("projects.viewSourceOnGithub", "View source on GitHub")}
                className="glass-card hover:bg-primary/10 hover:border-primary/50 backdrop-blur-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                onClick={(e) => { e.stopPropagation(); void trackAnalyticsEvent("project_github_click", { project_id: project.id }); window.open(project.github_url, "_blank"); }}
              >
                <Github className="w-4 h-4" />
              </Button>
            </motion.div>}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col relative z-10" style={{ transform: "translateZ(20px)" }}>
          {/* Glow orb */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <h3 className="mb-2 flex items-start justify-between gap-2 text-xl font-bold transition-colors duration-300 group-hover:text-primary">
            {project.title}
            <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </h3>
          <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 5).map((tag: string, i: number) => (
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
            {project.tags.length > 5 && (
              <Badge variant="outline" className="text-xs border-border/60 text-muted-foreground">+{project.tags.length - 5}</Badge>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  </motion.div>
  );
};

/* ─── Project Dialog ──────────────────────────────────────────── */
const categoryColors: Record<string, string> = {
  web:    "from-cyan-500 to-blue-500",
  mobile: "from-emerald-500 to-teal-500",
  design: "from-violet-500 to-purple-500",
};

const ProjectDialog = ({ project, onClose }: ProjectDialogProps) => {
  const t = useUiText();
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
                  {project.image ? (
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ scale: 1.04 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-background to-secondary/25" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 shadow-lg capitalize px-3 py-1`}>
                      {project.category}
                    </Badge>
                    {project.favorite && (
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg gap-1 px-3 py-1">
                        <Star className="w-3 h-3 fill-current" /> {t("projects.featured", "Featured")}
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
                    { label: t("projects.category", "Category"), value: project.category, icon: "🗂️" },
                    { label: t("projects.techStack", "Tech Stack"), value: t("projects.toolsCount", "{count} tools").replace("{count}", String(project.tags.length)), icon: "⚙️" },
                    { label: t("projects.status", "Status"), value: t("projects.completed", "Completed"), icon: "✅" },
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
                      disabled={!project.demo_url}
                      className={`w-full h-12 bg-gradient-to-r ${gradient} hover:opacity-90 text-white shadow-glow gap-2 font-semibold text-base`}
                      onClick={() => { void trackAnalyticsEvent("project_demo_click", { project_id: project.id }); window.open(project.demo_url, "_blank"); }}
                    >
                      <ExternalLink className="w-5 h-5" />
                      Live Demo
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!project.github_url}
                      className="w-full h-12 glass-card border-primary/30 hover:border-primary/60 hover:bg-primary/8 hover:text-primary gap-2 font-semibold text-base transition-all duration-300"
                      onClick={() => { void trackAnalyticsEvent("project_github_click", { project_id: project.id }); window.open(project.github_url, "_blank"); }}
                    >
                      <Github className="w-5 h-5" />
                      {t("projects.viewCode", "View Code")}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="glass-card rounded-3xl border border-border/50 p-6 md:p-8">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`} />
                    {t("projects.aboutProject", "About this project")}
                  </h4>
                  <DialogDescription className="text-base md:text-lg text-foreground/90 leading-relaxed">
                    {project.long_description}
                  </DialogDescription>
                </div>

                <div className="glass-card rounded-3xl border border-border/50 p-6 md:p-8">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`} />
                    {t("projects.techStack", "Tech Stack")}
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
  const t = useUiText();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const { projects: allProjects } = usePortfolio();

  const favoriteProjects = allProjects.filter(p => p.favorite);
  const categories = Array.from(new Set(allProjects.map(p => p.category).filter(Boolean)));
  const tabs = [
    ...(favoriteProjects.length ? [{ value: "favorites", label: t("projects.featured", "Featured"), list: favoriteProjects }] : []),
    { value: "all", label: t("projects.all", "All"), list: allProjects },
    ...categories.map(c => ({ value: c, label: c, list: allProjects.filter(p => p.category === c) })),
  ];

  return (
    <section id="projects" className="py-24 bg-muted/30 relative overflow-hidden" ref={ref}>

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

        <SectionHeader
          eyebrow={t("projects.eyebrow", "Portfolio showcase")}
          icon={Layers}
          title={t("projects.titlePrefix", "Featured")}
          highlight={t("projects.title", "Projects")}
          description={t("projects.description", "A selection of recent work and personal projects.")}
        />

        {allProjects.length === 0 ? (
          <EmptyState icon={FolderGit2} title={t("projects.emptyTitle", "No projects yet")} description={t("projects.emptyDescription", "Projects added from the dashboard will appear here.")} />
        ) : (
        <Tabs defaultValue={tabs[0].value} className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 flex justify-center"
          >
            <TabsList className="h-auto flex-wrap justify-center gap-1 rounded-3xl border border-border/60 bg-background/60 p-1 backdrop-blur-md sm:rounded-full">
              {tabs.map(t => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="gap-2 rounded-full px-5 py-2 capitalize transition-all duration-300 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow"
                >
                  {t.value === "favorites" && <Star className="h-4 w-4" />}
                  {t.label}
                  <span className="rounded-full bg-foreground/10 px-1.5 text-[10px] font-bold">{t.list.length}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          {tabs.map(({ value, list }) => (
            <TabsContent key={value} value={value}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 justify-center gap-8 sm:grid-cols-[repeat(auto-fit,minmax(18rem,24rem))]"
                >
                  {list.map((project, index) => (
                    <div key={project.id} className={index >= 2 ? "hidden sm:block" : undefined}>
                    <ProjectCard
                      project={project}
                      index={index}
                      onOpen={(project) => { setSelectedProject(project); void trackAnalyticsEvent("project_detail_open", { project_id: project.id }); }}
                      isInView={isInView}
                    />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
        )}
        {allProjects.length > 0 && <SectionViewAll to="/projects" />}
      </div>

      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

export default Projects;
