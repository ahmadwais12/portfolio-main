import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Briefcase, GraduationCap, Award, Sparkles, FileText, Calendar, Building2 } from "lucide-react";
import { usePortfolio } from "@/lib/store";
import { EmptyState, SectionHeader } from "@/components/SectionHeader";
import { trackAnalyticsEvent } from "@/analytics/tracker";
import { useUiText } from "@/lib/localization";
import SectionViewAll from "@/components/SectionViewAll";

const iconMap = { work: Briefcase, education: GraduationCap, certification: Award };

const typeConfig = {
  work:          { gradient: "from-cyan-500 to-blue-500",   bg: "bg-cyan-500/8",   border: "border-cyan-400/25",   text: "text-cyan-400",   glow: "rgba(6,182,212,0.2)",   label: "Work" },
  education:     { gradient: "from-violet-500 to-purple-500", bg: "bg-violet-500/8", border: "border-violet-400/25", text: "text-violet-400", glow: "rgba(139,92,246,0.2)", label: "Education" },
  certification: { gradient: "from-amber-400 to-orange-500", bg: "bg-amber-500/8",  border: "border-amber-400/25",  text: "text-amber-400",  glow: "rgba(245,158,11,0.2)",  label: "Certification" },
};

const Resume = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { resume: timeline, about } = usePortfolio();
  const t = useUiText();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? timeline : timeline.filter(i => i.type === activeTab);

  const counts = {
    work:          timeline.filter(i => i.type === "work").length,
    education:     timeline.filter(i => i.type === "education").length,
    certification: timeline.filter(i => i.type === "certification").length,
  };

  return (
    <section id="resume" className="py-24 bg-background relative overflow-hidden" ref={ref}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1,1.1,1], opacity:[0.03,0.07,0.03] }} transition={{ duration:9, repeat:Infinity }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-500 rounded-full blur-[120px]" />
        <motion.div animate={{ scale: [1,1.15,1], opacity:[0.03,0.06,0.03] }} transition={{ duration:11, repeat:Infinity, delay:3 }}
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-cyan-500 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        <SectionHeader
          eyebrow={t("resume.eyebrow", "My journey")}
          icon={FileText}
          title={t("resume.titlePrefix", "Resume &")}
          highlight={t("resume.highlight", "Experience")}
          description={t("resume.description", "My professional journey, education and certifications.")}
        >
          {about.resume_url && (
            <div className="mt-8">
              <a
                href={about.resume_url}
                onClick={() => void trackAnalyticsEvent("resume_download_click")}
                download={`${(about.full_name || "Resume").replace(/ /g, "_")}_Resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-12 gap-2 rounded-full bg-gradient-primary px-8 font-semibold text-white shadow-glow hover:opacity-95">
                  <motion.span animate={{ y:[0,-2,0] }} transition={{ duration:1.5, repeat:Infinity }}>
                    <Download className="w-5 h-5" />
                  </motion.span>
                  {t("resume.download", "Download Resume")}
                </Button>
              </a>
            </div>
          )}
        </SectionHeader>

        {timeline.length === 0 ? (
          <EmptyState icon={FileText} title={t("resume.emptyTitle", "No resume entries yet")} description={t("resume.emptyDescription", "Work, education and certifications added from the dashboard will appear here.")} />
        ) : (
        <>
        {/* Stats strip */}
        <motion.div initial={{ opacity:0, y:20 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.2 }}
          className="mx-auto mb-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label:t("resume.work", "Work"),           value: counts.work,          icon: Briefcase,     gradient: typeConfig.work.gradient },
            { label:t("resume.education", "Education"),      value: counts.education,     icon: GraduationCap, gradient: typeConfig.education.gradient },
            { label:t("resume.certifications", "Certifications"), value: counts.certification, icon: Award,         gradient: typeConfig.certification.gradient },
            { label:t("resume.totalEntries", "Total entries"),  value: timeline.length,      icon: Sparkles,      gradient: "from-primary to-secondary" },
          ].map((s,i) => (
            <motion.div key={s.label} initial={{ opacity:0, scale:0.9 }} animate={isInView ? { opacity:1, scale:1 } : {}}
              transition={{ delay:0.2+i*0.08 }}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/40">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-md`}>
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <p className={`text-xl font-extrabold leading-none bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <motion.div initial={{ opacity:0, y:16 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.35 }}
          className="flex justify-center mb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto flex-wrap justify-center gap-1 rounded-3xl sm:rounded-full border border-border/60 bg-background/60 p-1 backdrop-blur-md">
              {[
                { value:"all",           label:t("resume.all", "All"),           count: timeline.length },
                { value:"work",          label:t("resume.work", "Work"),          count: counts.work },
                { value:"education",     label:t("resume.education", "Education"),     count: counts.education },
                { value:"certification", label:t("resume.certifications", "Certifications"),count: counts.certification },
              ].map(t => (
                <TabsTrigger key={t.value} value={t.value}
                  className="gap-1.5 rounded-full px-4 py-2 text-sm transition-all duration-300 data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow">
                  {t.label}
                  <span className="rounded-full bg-foreground/10 px-1.5 text-[10px] font-bold">{t.count}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-violet-500 to-amber-500 opacity-40" />

            <div className="space-y-8">
              {filtered.map((item, index) => {
                const Icon = iconMap[item.type];
                const cfg  = typeConfig[item.type];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity:0, x:-40, scale:0.97 }}
                    animate={isInView ? { opacity:1, x:0, scale:1 } : {}}
                    transition={{ duration:0.55, delay:index*0.1, type:"spring", bounce:0.25 }}
                    className="relative pl-20 group"
                  >
                    {/* Timeline dot */}
                    <motion.div
                      whileHover={{ scale:1.2, rotate:10 }}
                      transition={{ type:"spring", bounce:0.5 }}
                      className={`absolute left-4 -translate-x-1/2 w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg text-white z-10`}
                      style={{ boxShadow:`0 0 20px ${cfg.glow}` }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>

                    {/* Connector dot on line */}
                    <div className={`absolute left-8 top-5 w-2 h-2 rounded-full bg-gradient-to-r ${cfg.gradient} -translate-x-1/2 z-10`} />

                    {/* Card */}
                    <motion.div
                      whileHover={{ y:-4, boxShadow:`0 20px 50px ${cfg.glow}` }}
                      transition={{ duration:0.25 }}
                      className={`relative rounded-2xl p-6 border ${cfg.border} ${cfg.bg} glass-card overflow-hidden transition-all duration-300`}
                    >
                      {/* Top gradient bar */}
                      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.gradient}`} />

                      {/* Glow orb */}
                      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${cfg.gradient} opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500`} />

                      {/* Header row */}
                      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-xl font-bold group-hover:${cfg.text} transition-colors duration-300`}>
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                              <Building2 className={`w-3.5 h-3.5 ${cfg.text}`} />
                              {item.organization}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={`${cfg.bg} ${cfg.text} border ${cfg.border} gap-1 text-xs font-semibold`}>
                            <Calendar className="w-3 h-3" />
                            {item.period}
                          </Badge>
                          <Badge className={`bg-gradient-to-r ${cfg.gradient} text-white border-0 text-xs capitalize`}>
                            {item.type_label && item.type_label !== item.type ? item.type_label : t(`resume.${item.type}`, cfg.label)}
                          </Badge>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className={`h-px bg-gradient-to-r ${cfg.gradient} opacity-20 mb-3`} />

                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        <SectionViewAll to="/resume" />
        </>
        )}
      </div>
    </section>
  );
};

export default Resume;
