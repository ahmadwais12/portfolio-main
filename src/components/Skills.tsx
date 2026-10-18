import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState, useCallback } from "react";
import { usePortfolio } from "@/lib/store";
import { Code2, Server, Smartphone, BookOpen, Container, Sparkles, Zap, Layers, Gauge, Rocket } from "lucide-react";
import { EmptyState, SectionHeader } from "@/components/SectionHeader";
import { useUiText } from "@/lib/localization";
import SectionViewAll from "@/components/SectionViewAll";

/* ─── Category config ─────────────────────────────────────────── */
const categoryConfig: Record<string, {
  gradient: string; from: string; to: string;
  bg: string; border: string; glow: string;
  icon: React.ReactNode; textColor: string; spotColor: string;
}> = {
  Frontend: {
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    from: "#06b6d4", to: "#6366f1",
    bg: "bg-cyan-500/5", border: "border-cyan-400/20",
    glow: "rgba(6,182,212,0.25)", spotColor: "rgba(6,182,212,0.08)",
    icon: <Code2 className="w-5 h-5" />, textColor: "text-cyan-400",
  },
  Backend: {
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    from: "#8b5cf6", to: "#d946ef",
    bg: "bg-violet-500/5", border: "border-violet-400/20",
    glow: "rgba(139,92,246,0.25)", spotColor: "rgba(139,92,246,0.08)",
    icon: <Server className="w-5 h-5" />, textColor: "text-violet-400",
  },
  Mobile: {
    gradient: "from-emerald-400 via-teal-500 to-green-500",
    from: "#34d399", to: "#10b981",
    bg: "bg-emerald-500/5", border: "border-emerald-400/20",
    glow: "rgba(52,211,153,0.25)", spotColor: "rgba(52,211,153,0.08)",
    icon: <Smartphone className="w-5 h-5" />, textColor: "text-emerald-400",
  },
  Languages: {
    gradient: "from-amber-400 via-orange-500 to-yellow-500",
    from: "#f59e0b", to: "#eab308",
    bg: "bg-amber-500/5", border: "border-amber-400/20",
    glow: "rgba(245,158,11,0.25)", spotColor: "rgba(245,158,11,0.08)",
    icon: <BookOpen className="w-5 h-5" />, textColor: "text-amber-400",
  },
  DevOps: {
    gradient: "from-rose-500 via-red-500 to-pink-500",
    from: "#f43f5e", to: "#ec4899",
    bg: "bg-rose-500/5", border: "border-rose-400/20",
    glow: "rgba(244,63,94,0.25)", spotColor: "rgba(244,63,94,0.08)",
    icon: <Container className="w-5 h-5" />, textColor: "text-rose-400",
  },
};
const fallback = categoryConfig.Frontend;

/* ─── 3D Tilt Card (Aceternity-style) ────────────────────────── */
function TiltCard({ children, className, glowColor, spotColor }: {
  children: React.ReactNode;
  className?: string;
  glowColor: string;
  spotColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness: 300, damping: 30 });
  const scale = useSpring(hovered ? 1.03 : 1, { stiffness: 300, damping: 25 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(x);
    rawY.set(y);
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  }, [rawX, rawY]);

  return (
    <div className="perspective-1000" style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`relative cursor-default ${className}`}
        whileHover={{ boxShadow: `0 25px 60px ${glowColor}, 0 0 0 1px ${glowColor}` }}
        transition={{ duration: 0.2 }}
      >
        {/* Aceternity spotlight */}
        {hovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-10"
            style={{
              background: `radial-gradient(200px circle at ${spotlight.x}px ${spotlight.y}px, ${spotColor}, transparent 70%)`,
            }}
          />
        )}
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-current to-transparent opacity-60 z-20" />
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Animated skill bar ──────────────────────────────────────── */
function SkillBar({ name, level, gradient, delay }: {
  name: string; level: number; gradient: string; delay: number;
}) {
  const value = Math.max(0, Math.min(100, Number(level) || 0));
  return (
    <div className="group/bar">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground/90">{name}</span>
        <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-xs font-bold text-transparent`}>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`relative h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.45),transparent)] bg-[length:200%_100%] animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */
const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { skills: allSkills, about } = usePortfolio();
  const t = useUiText();
  const categories = Array.from(new Set(allSkills.map(s => s.category)));
  const avgLevel = allSkills.length ? Math.round(allSkills.reduce((sum, s) => sum + (Number(s.level) || 0), 0) / allSkills.length) : 0;

  const stats = [
    { label: t("skills.title", "Skills"), value: allSkills.length ? `${allSkills.length}` : "", icon: Zap },
    { label: t("skills.categories", "Categories"), value: categories.length ? `${categories.length}` : "", icon: Layers },
    { label: t("skills.averageProficiency", "Avg. proficiency"), value: avgLevel ? `${avgLevel}%` : "", icon: Gauge },
    { label: t("skills.yearsExperience", "Years experience"), value: about.years_experience, icon: Rocket },
  ].filter(s => s.value.trim());

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-muted/30" ref={ref}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { color: "bg-cyan-500", pos: "-top-40 -left-40", size: "w-[600px] h-[600px]", dur: 8, delay: 0 },
          { color: "bg-violet-500", pos: "-bottom-40 -right-40", size: "w-[700px] h-[700px]", dur: 10, delay: 2 },
          { color: "bg-emerald-500", pos: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", size: "w-[500px] h-[500px]", dur: 12, delay: 4 },
        ].map((b, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.07, 0.03] }}
            transition={{ duration: b.dur, repeat: Infinity, delay: b.delay }}
            className={`absolute ${b.pos} ${b.size} ${b.color} rounded-full blur-[120px]`}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">

        <SectionHeader
          eyebrow={t("skills.eyebrow", "Technical arsenal")}
          icon={Sparkles}
          title={t("skills.my", "My")}
          highlight={t("skills.title", "Skills")}
          description={t("skills.description", "Technologies and tools I use to bring ideas to life.")}
        />

        {/* Stats strip */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-glow">
                  <stat.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xl font-extrabold leading-none text-gradient">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {categories.length === 0 && (
          <EmptyState icon={Code2} title={t("skills.emptyTitle", "No skills yet")} description={t("skills.emptyDescription", "Skills added from the dashboard will appear here.")} />
        )}

        {/* 3D Skill cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categories.map((category, catIndex) => {
            const skills = allSkills.filter(s => s.category === category);
            const cfg = categoryConfig[category] ?? fallback;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: catIndex * 0.1, type: "spring", bounce: 0.3 }}
              >
                <TiltCard
                  glowColor={cfg.glow}
                  spotColor={cfg.spotColor}
                  className={`rounded-2xl p-6 border ${cfg.border} ${cfg.bg} glass-card overflow-hidden`}
                >
                  {/* Glow orb */}
                  <div
                    className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${cfg.gradient}`}
                    style={{ transform: "translateZ(20px)" }}
                  />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-5 relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.15 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg text-white`}
                      >
                        {cfg.icon}
                      </motion.div>
                      <div>
                        <h3 className={`font-bold text-base ${cfg.textColor}`}>{category}</h3>
                        <p className="text-xs text-muted-foreground">{skills.length} technologies</p>
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={isInView ? { scale: 1, rotate: 0 } : {}}
                      transition={{ delay: catIndex * 0.1 + 0.4, type: "spring", bounce: 0.6 }}
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center text-white text-sm font-black shadow-md`}
                    >
                      {skills.length}
                    </motion.div>
                  </div>

                  {/* Divider */}
                  <div className={`h-px bg-gradient-to-r ${cfg.gradient} opacity-25 mb-4 relative z-10`} />

                  {/* Skill bars */}
                  <div className="relative z-10 space-y-4" style={{ transform: "translateZ(20px)" }}>
                    {skills.map((skill, i) => (
                      <SkillBar
                        key={skill.id}
                        name={skill.name}
                        level={skill.level}
                        gradient={cfg.gradient}
                        delay={catIndex * 0.08 + i * 0.06}
                      />
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
        {allSkills.length > 0 && <SectionViewAll to="/skills" />}
      </div>
    </section>
  );
};

export default Skills;
