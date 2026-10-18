import { motion } from "framer-motion";
import { MapPin, Calendar, Code, Award, Mail, Phone, UserRound, Download, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/SectionHeader";
import { usePortfolio } from "@/lib/store";
import { initialsOf } from "@/lib/utils";
import { useUiText, splitLocalizedList } from "@/lib/localization";
import SectionViewAll from "@/components/SectionViewAll";

const About = ({ preview = false }: { preview?: boolean }) => {
  const { about: data } = usePortfolio();
  const t = useUiText();
  const paragraphs = data.bio.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const titles = splitLocalizedList(data.title.replace(/\|/g, ","));
  const initials = initialsOf(data.full_name);

  const stats = [
    { icon: Calendar, label: t("about.yearsExperience", "Years Experience"), value: data.years_experience },
    { icon: Code, label: t("about.projectsCompleted", "Projects Completed"), value: data.projects_completed },
    { icon: Award, label: t("about.technologies", "Technologies"), value: data.technologies },
  ].filter(s => s.value.trim());

  const contacts = [
    { icon: Mail, label: t("about.email", "Email"), value: data.email, href: data.email && `mailto:${data.email}` },
    { icon: Phone, label: t("about.phone", "Phone"), value: data.phone, href: data.phone && `tel:${data.phone.replace(/\s+/g, "")}` },
    { icon: MapPin, label: t("about.location", "Location"), value: data.location, href: "" },
  ].filter(c => c.value.trim());

  return (
    <section id="about" className="relative overflow-hidden bg-background py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative mx-auto px-4">
        <SectionHeader
          eyebrow={t("about.eyebrow", "Get to know me")}
          icon={UserRound}
          title={t("about.title", "About")}
          highlight={t("about.highlight", "Me")}
          description={preview ? undefined : titles.length ? `${titles.join(" · ")}` : t("about.description", "A little about who I am and what I do.")}
        />

        {preview ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              {paragraphs[0] || t("about.bioFallback", "Add your bio from the dashboard to introduce yourself here.")}
            </p>
            <SectionViewAll to="/about" />
          </motion.div>
        ) : (
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-primary opacity-20 blur-2xl" />
            <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border-2 border-primary/30" />
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-elevated">
              {data.avatar_url ? (
                <img
                  src={data.avatar_url}
                  alt={data.full_name || t("about.profilePhoto", "Profile photo")}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
                  {initials
                    ? <span className="bg-gradient-primary bg-clip-text text-8xl font-extrabold text-transparent">{initials}</span>
                    : <UserRound className="h-24 w-24 text-primary/50" />}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent" />
            </div>

            {data.years_experience && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
                className="absolute -bottom-6 -left-4 rounded-2xl border border-border/60 bg-background/90 px-5 py-4 shadow-xl backdrop-blur-md sm:-left-8"
              >
                <p className="bg-gradient-primary bg-clip-text text-3xl font-extrabold text-transparent">{data.years_experience}</p>
                <p className="text-xs font-medium text-muted-foreground">Years of experience</p>
              </motion.div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-4 text-2xl font-bold sm:text-3xl">
                {data.full_name ? <>{t("about.im", "I'm {name}").split("{name}")[0]}<span className="text-gradient">{data.full_name}</span></> : t("about.whoIAm", "Who I am")}
              </h3>
              {paragraphs.length ? (
                paragraphs.map((para, i) => (
                  <p key={i} className="mt-4 leading-relaxed text-muted-foreground first:mt-0">{para}</p>
                ))
              ) : (
                <p className="leading-relaxed text-muted-foreground">{t("about.bioFallback", "Add your bio from the dashboard to introduce yourself here.")}</p>
              )}
            </div>

            {titles.length > 1 && (
              <ul className="grid gap-2 sm:grid-cols-2">
                {titles.map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            )}

            {contacts.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {contacts.map(c => {
                  const content = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gradient-primary group-hover:text-white">
                        <c.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs text-muted-foreground">{c.label}</span>
                        <span className="block truncate text-sm font-semibold">{c.value}</span>
                      </span>
                    </>
                  );
                  const cls = "group flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40";
                  return c.href
                    ? <a key={c.label} href={c.href} className={cls}>{content}</a>
                    : <div key={c.label} className={cls}>{content}</div>;
                })}
              </div>
            )}

            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-4 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
                  >
                    <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                    <p className="text-2xl font-extrabold text-gradient sm:text-3xl">{stat.value}</p>
                    <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-gradient-primary px-7 font-semibold text-white shadow-glow hover:opacity-95">
                <Link to="/contact">
                  {t("about.workTogether", "Let's work together")} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              {data.resume_url && (
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-primary/40 px-7 font-semibold hover:bg-primary/10">
                  <a href={data.resume_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-1 h-4 w-4" /> {t("about.downloadCv", "Download CV")}
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
        )}
      </div>
    </section>
  );
};

export default About;
