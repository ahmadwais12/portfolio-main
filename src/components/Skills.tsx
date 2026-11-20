import { motion } from "framer-motion";
import { useState } from "react";
import { Code2 } from "lucide-react";
import { usePortfolio } from "@/lib/store";
import { EmptyState, SectionHeader } from "@/components/SectionHeader";
import { useUiText } from "@/lib/localization";
import SectionViewAll from "@/components/SectionViewAll";

const deviconSlugs: Record<string, string> = {
  html: "html5", html5: "html5",
  css: "css3", css3: "css3",
  javascript: "javascript", js: "javascript",
  typescript: "typescript", ts: "typescript",
  react: "react", reactjs: "react", "react native": "react",
  nextjs: "nextjs", "next.js": "nextjs",
  vue: "vuejs", vuejs: "vuejs", "vue.js": "vuejs",
  angular: "angularjs", svelte: "svelte",
  tailwind: "tailwindcss", "tailwind css": "tailwindcss", tailwindcss: "tailwindcss",
  bootstrap: "bootstrap", sass: "sass", "material ui": "materialui", mui: "materialui",
  node: "nodejs", nodejs: "nodejs", "node.js": "nodejs",
  express: "express", "express.js": "express", nestjs: "nestjs", "nest.js": "nestjs",
  php: "php", laravel: "laravel", filament: "filament", wordpress: "wordpress",
  python: "python", django: "django", flask: "flask",
  java: "java", spring: "spring", "spring boot": "spring",
  "c++": "cplusplus", cplusplus: "cplusplus", csharp: "csharp", "c#": "csharp", c: "c",
  dart: "dart", flutter: "flutter", swift: "swift", kotlin: "kotlin",
  mysql: "mysql", postgresql: "postgresql", postgres: "postgresql", sqlite: "sqlite",
  mongodb: "mongodb", mongo: "mongodb", redis: "redis", supabase: "supabase", firebase: "firebase",
  prisma: "prisma", graphql: "graphql",
  git: "git", github: "github", gitlab: "gitlab",
  docker: "docker", kubernetes: "kubernetes", linux: "linux", aws: "amazonwebservices",
  figma: "figma", photoshop: "photoshop", illustrator: "illustrator",
  vite: "vitejs", vitejs: "vitejs", webpack: "webpack", jest: "jest", postman: "postman",
  jquery: "jquery", redux: "redux", "react query": "react",
};

const slugFor = (name: string) => deviconSlugs[name.trim().toLowerCase()];

const initialsFor = (name: string) =>
  name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?";

const SkillLogo = ({ name, slug }: { name: string; slug?: string }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]">
      {slug && !failed ? (
        <img
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-original.svg`}
          alt=""
          loading="lazy"
          className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-sm font-black tracking-tight text-slate-700">{initialsFor(name)}</span>
      )}
    </div>
  );
};

const Skills = () => {
  const { skills } = usePortfolio();
  const t = useUiText();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = Array.from(new Set(skills.map(skill => skill.category).filter(Boolean)));
  const filters = ["all", ...categories];
  const visible = activeCategory === "all" ? skills : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="relative overflow-hidden py-20 sm:py-24">
      <div className="container relative mx-auto px-4">
        <SectionHeader
          eyebrow={t("skills.eyebrow", "Technologies")}
          icon={Code2}
          title={t("skills.technologyTitle", "Technology")}
          highlight={t("skills.stackTitle", "Stack")}
          description={t("skills.description", "Technologies and tools I use to bring ideas to life.")}
        />

        {skills.length === 0 ? (
          <EmptyState icon={Code2} title={t("skills.emptyTitle", "No skills yet")} description={t("skills.emptyDescription", "Skills added from the dashboard will appear here.")} />
        ) : (
          <>
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {filters.map(filter => {
                const active = activeCategory === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveCategory(filter)}
                    className={`rounded-full border px-5 py-2 text-sm font-medium capitalize transition-colors ${
                      active
                        ? "border-gold bg-gold text-gold-foreground"
                        : "border-border/70 bg-card/40 text-foreground/75 hover:border-gold/40 hover:text-foreground"
                    }`}
                  >
                    {filter === "all" ? t("skills.all", "All") : filter}
                  </button>
                );
              })}
            </div>

            <motion.div layout className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visible.map((skill, index) => {
                const slug = slugFor(skill.name);
                return (
                  <motion.div
                    layout
                    key={skill.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
                    whileHover={{ y: -4 }}
                    className="group flex flex-col items-center rounded-2xl border border-border/70 bg-card/60 px-4 py-7 text-center backdrop-blur-sm transition-colors hover:border-gold/40"
                  >
                    <SkillLogo name={skill.name} slug={slug} />
                    <p className="text-sm font-semibold leading-tight text-gold">{skill.name}</p>
                    <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{skill.category}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        {skills.length > 0 && <SectionViewAll to="/skills" />}
      </div>
    </section>
  );
};

export default Skills;
