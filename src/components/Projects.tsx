import { motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Github, Star, Layers, FolderGit2, ArrowUpRight } from "lucide-react";
import { EmptyState, SectionHeader } from "@/components/SectionHeader";
import { usePortfolio, type ProjectItem } from "@/lib/store";
import { trackAnalyticsEvent } from "@/analytics/tracker";
import { useUiText } from "@/lib/localization";
import SectionViewAll from "@/components/SectionViewAll";

type ProjectCardProps = {
  project: ProjectItem;
  index: number;
  onOpen: (project: ProjectItem) => void;
};

/* ─── Project Card ────────────────────────────────────────────── */
const ProjectCard = ({ project, index, onOpen }: ProjectCardProps) => {
  const t = useUiText();

  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(project)}
      className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-sm transition-colors ${
        project.favorite ? "border-gold/40 hover:border-gold/70" : "border-border/70 hover:border-gold/50"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/40">
            <FolderGit2 className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {project.favorite && (
          <Badge className="absolute right-3 top-3 gap-1 border-0 bg-gold text-gold-foreground">
            <Star className="h-3 w-3 fill-current" />
            {t("projects.featured", "Featured")}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          <span>{project.category}</span>
          <span aria-hidden="true">•</span>
          <span className="flex items-center gap-1 normal-case tracking-normal">
            <Layers className="h-3 w-3" />
            {t("projects.toolsCount", "{count} tools").replace("{count}", String(project.tags.length))}
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-gold">
          {project.title}
        </h3>
        <p className="mb-5 mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
          {project.description || project.long_description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4 text-sm font-semibold text-gold/80 transition-colors group-hover:text-gold">
          {t("projects.viewProject", "View Project")}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </motion.article>
  );
};

/* ─── Project Dialog ──────────────────────────────────────────── */
const ProjectDialog = ({ project, onClose }: { project: ProjectItem | null; onClose: () => void }) => {
  const t = useUiText();
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="h-screen w-screen max-h-none max-w-none overflow-hidden rounded-none border-0 bg-background p-0">
        <div className="h-full overflow-y-auto">
          <div className="min-h-full p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border/70 md:min-h-[420px] lg:min-h-[520px]">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-muted/50" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute left-4 top-4 flex gap-2">
                    <Badge className="border-0 bg-black/60 capitalize text-white backdrop-blur">
                      {project.category}
                    </Badge>
                    {project.favorite && (
                      <Badge className="gap-1 border-0 bg-gold text-gold-foreground">
                        <Star className="h-3 w-3 fill-current" /> {t("projects.featured", "Featured")}
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <DialogTitle className="mb-2 text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
                      {project.title}
                    </DialogTitle>
                    <p className="max-w-2xl text-sm text-white/75 md:text-base">{project.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    { label: t("projects.category", "Category"), value: project.category },
                    { label: t("projects.techStack", "Tech Stack"), value: t("projects.toolsCount", "{count} tools").replace("{count}", String(project.tags.length)) },
                    { label: t("projects.status", "Status"), value: t("projects.completed", "Completed") },
                  ].map(stat => (
                    <div key={stat.label} className="flex min-h-[110px] flex-col justify-center rounded-2xl border border-border/70 bg-card/60 p-5">
                      <p className="text-lg font-bold capitalize text-gold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 gap-3 sm:col-span-3 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
                    <Button
                      disabled={!project.demo_url}
                      className="h-12 w-full gap-2 bg-gold font-semibold text-gold-foreground hover:bg-gold/90"
                      onClick={() => { void trackAnalyticsEvent("project_demo_click", { project_id: project.id }); window.open(project.demo_url, "_blank"); }}
                    >
                      <ExternalLink className="h-5 w-5" />
                      Live Demo
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!project.github_url}
                      className="h-12 w-full gap-2 border-border/70 font-semibold hover:border-gold/50 hover:text-gold"
                      onClick={() => { void trackAnalyticsEvent("project_github_click", { project_id: project.id }); window.open(project.github_url, "_blank"); }}
                    >
                      <Github className="h-5 w-5" />
                      {t("projects.viewCode", "View Code")}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="rounded-2xl border border-border/70 bg-card/60 p-6 md:p-8">
                  <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <span className="inline-block h-2 w-2 rounded-full bg-gold" />
                    {t("projects.aboutProject", "About this project")}
                  </h4>
                  <DialogDescription className="text-base leading-relaxed text-foreground/90 md:text-lg">
                    {project.long_description || project.description}
                  </DialogDescription>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card/60 p-6 md:p-8">
                  <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <span className="inline-block h-2 w-2 rounded-full bg-gold" />
                    {t("projects.techStack", "Tech Stack")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="border-border/70 px-3 py-1.5 text-sm font-semibold">
                        {tag}
                      </Badge>
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
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const { projects } = usePortfolio();
  const visible = [...projects].sort((a, b) => Number(b.favorite) - Number(a.favorite)).slice(0, 6);

  return (
    <section id="projects" className="relative overflow-hidden py-20 sm:py-24">
      <div className="container relative mx-auto px-4">
        <SectionHeader
          eyebrow={t("projects.eyebrow", "Latest Projects")}
          icon={Layers}
          title={t("projects.featuredTitle", "Featured")}
          highlight={t("projects.workTitle", "Work")}
          description={t("projects.workDescription", "A selection of recent projects focused on clean design, modern technologies, and great user experiences.")}
        />

        {projects.length === 0 ? (
          <EmptyState icon={FolderGit2} title={t("projects.emptyTitle", "No projects yet")} description={t("projects.emptyDescription", "Projects added from the dashboard will appear here.")} />
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={(item) => { setSelectedProject(item); void trackAnalyticsEvent("project_detail_open", { project_id: item.id }); }}
              />
            ))}
          </div>
        )}

        {projects.length > 0 && <SectionViewAll to="/projects" />}
      </div>

      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

export default Projects;
