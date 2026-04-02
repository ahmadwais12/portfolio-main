import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, useState, useCallback } from "react";
import { getSkills, getAbout } from "@/lib/store";
import { Code2, Server, Smartphone, BookOpen, Container, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

/* ─── Animated skill chip ─────────────────────────────────────── */
function SkillChip({ name, gradient, border, textColor, delay }: {
  name: string; gradient: string; border: string; textColor: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay, type: "spring", bounce: 0.45 }}
      whileHover={{ scale: 1.1, y: -3, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.95 }}
      className="relative group/chip"
    >
      <Badge
        variant="outline"
        className={`relative overflow-hidden px-3 py-1.5 text-xs font-semibold ${border} ${textColor} bg-transparent cursor-default select-none transition-all duration-200`}
      >
        <span className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover/chip:opacity-10 transition-opacity duration-200`} />
        <motion.span
          className={`inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient} mr-1.5 flex-shrink-0`}
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: delay * 0.5 }}
        />
        <span className="relative z-10">{name}</span>
      </Badge>
    </motion.div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */
const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const allSkills = getSkills();
  const about = getAbout();
  const categories = Array.from(new Set(allSkills.map(s => s.category)));

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-background" ref={ref}>

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
            <Sparkles className="w-4 h-4" />
            Technical Arsenal
            <Zap className="w-4 h-4" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            My{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 via-primary to-violet-500 bg-clip-text text-transparent">
                Skills
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-14"
        >
          {[
            { label: "Skills Mastered", value: `${allSkills.length}+`, icon: "⚡" },
            { label: "Categories", value: `${categories.length}`, icon: "🎯" },
            { label: "Years Experience", value: about.years_experience, icon: "🚀" },
            { label: "Projects Built", value: about.projects_completed, icon: "🏗️" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              whileHover={{ scale: 1.06, y: -3 }}
              className="flex items-center gap-3 px-5 py-3 glass-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-xl">{stat.icon}</span>
              <div>
                <p className="text-xl font-black bg-gradient-primary bg-clip-text text-transparent leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

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

                  {/* Skill chips */}
                  <div className="flex flex-wrap gap-2 relative z-10" style={{ transform: "translateZ(20px)" }}>
                    {skills.map((skill, i) => (
                      <SkillChip
                        key={skill.id}
                        name={skill.name}
                        gradient={cfg.gradient}
                        border={cfg.border}
                        textColor={cfg.textColor}
                        delay={catIndex * 0.08 + i * 0.05}
                      />
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
