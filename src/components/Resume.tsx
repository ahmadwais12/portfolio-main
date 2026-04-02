import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Briefcase, GraduationCap, Award, Sparkles, FileText, Calendar, Building2 } from "lucide-react";
import { getResume, getAbout } from "@/lib/store";

const iconMap = { work: Briefcase, education: GraduationCap, certification: Award };

const typeConfig = {
  work:          { gradient: "from-cyan-500 to-blue-500",   bg: "bg-cyan-500/8",   border: "border-cyan-400/25",   text: "text-cyan-400",   glow: "rgba(6,182,212,0.2)",   label: "Work" },
  education:     { gradient: "from-violet-500 to-purple-500", bg: "bg-violet-500/8", border: "border-violet-400/25", text: "text-violet-400", glow: "rgba(139,92,246,0.2)", label: "Education" },
  certification: { gradient: "from-amber-400 to-orange-500", bg: "bg-amber-500/8",  border: "border-amber-400/25",  text: "text-amber-400",  glow: "rgba(245,158,11,0.2)",  label: "Certification" },
};

const Resume = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const timeline = getResume();
  const about    = getAbout();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? timeline : timeline.filter(i => i.type === activeTab);

  const counts = {
    work:          timeline.filter(i => i.type === "work").length,
    education:     timeline.filter(i => i.type === "education").length,
    certification: timeline.filter(i => i.type === "certification").length,
  };

  return (
    <section id="resume" className="py-24 bg-muted/20 relative overflow-hidden" ref={ref}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1,1.1,1], opacity:[0.03,0.07,0.03] }} transition={{ duration:9, repeat:Infinity }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-500 rounded-full blur-[120px]" />
        <motion.div animate={{ scale: [1,1.15,1], opacity:[0.03,0.06,0.03] }} transition={{ duration:11, repeat:Infinity, delay:3 }}
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-cyan-500 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:30 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7 }} className="text-center mb-16">
          <motion.div initial={{ opacity:0, scale:0.5 }} animate={isInView ? { opacity:1, scale:1 } : {}} transition={{ duration:0.5, type:"spring", bounce:0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 text-primary text-sm font-semibold mb-6">
            <FileText className="w-4 h-4" /> My Journey <Sparkles className="w-4 h-4" />
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Resume &{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 via-primary to-violet-500 bg-clip-text text-transparent">Experience</span>
              <motion.div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                initial={{ scaleX:0 }} animate={isInView ? { scaleX:1 } : {}} transition={{ duration:0.8, delay:0.5 }} />
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">My professional journey, education and certifications</p>

          {/* Download button */}
          <motion.div initial={{ opacity:0, y:10 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.4 }}>
            <a href={about.resume_url || "/resume.pdf"} download={`${about.full_name.replace(/ /g,"_")}_Resume.pdf`} target="_blank" rel="noopener noreferrer">
              <Button className="h-12 px-8 bg-gradient-to-r from-cyan-500 to-primary hover:opacity-90 shadow-glow gap-2 font-semibold text-white group">
                <motion.span animate={{ y:[0,-2,0] }} transition={{ duration:1.5, repeat:Infinity }}>
                  <Download className="w-5 h-5" />
                </motion.span>
                Download Resume
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Stats strip */}
        <motion.div initial={{ opacity:0, y:20 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { label:"Work Experience", icon:"💼", cfg: typeConfig.work },
            { label:"Education",       icon:"🎓", cfg: typeConfig.education },
            { label:"Certifications",  icon:"🏆", cfg: typeConfig.certification },
            { label:"Total Entries",   icon:"📋", cfg: { gradient:"from-primary to-secondary", text:"text-primary" } },
          ].map((s,i) => (
            <motion.div key={i} initial={{ opacity:0, scale:0.8 }} animate={isInView ? { opacity:1, scale:1 } : {}}
              transition={{ delay:0.3+i*0.08 }} whileHover={{ scale:1.05, y:-2 }}
              className="flex items-center gap-3 px-5 py-3 glass-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300">
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className={`text-sm font-bold bg-gradient-to-r ${s.cfg.gradient} bg-clip-text text-transparent leading-none`}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter tabs */}
        <motion.div initial={{ opacity:0, y:16 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.35 }}
          className="flex justify-center mb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="glass-card border border-border/50 p-1 rounded-2xl gap-1">
              {[
                { value:"all",           label:"All",           count: timeline.length },
                { value:"work",          label:"Work",          count: counts.work },
                { value:"education",     label:"Education",     count: counts.education },
                { value:"certification", label:"Certifications",count: counts.certification },
              ].map(t => (
                <TabsTrigger key={t.value} value={t.value}
                  className="rounded-xl px-4 py-2 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300 gap-1.5">
                  {t.label}
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
                            {cfg.label}
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
      </div>
    </section>
  );
};

export default Resume;
