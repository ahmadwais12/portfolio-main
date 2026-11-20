import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Download, FileText } from "lucide-react";
import { usePortfolio } from "@/lib/store";
import { EmptyState, SectionHeader } from "@/components/SectionHeader";
import { trackAnalyticsEvent } from "@/analytics/tracker";
import { useUiText } from "@/lib/localization";
import { initialsOf } from "@/lib/utils";
import SectionViewAll from "@/components/SectionViewAll";

const yearOf = (period: string, index: 0 | -1 = 0) => {
  const years = (period.match(/\b(?:19|20)\d{2}\b/g) || []).map(Number);
  if (years.length === 0) return null;
  return index === 0 ? years[0] : years[years.length - 1];
};

const Resume = () => {
  const { resume, about } = usePortfolio();
  const t = useUiText();
  const currentYear = new Date().getFullYear();

  const downloadButton = about.resume_url ? (
    <a
      href={about.resume_url}
      onClick={() => void trackAnalyticsEvent("resume_download_click")}
      download={`${(about.full_name || "Resume").replace(/ /g, "_")}_Resume.pdf`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-card/60 px-5 text-sm font-semibold text-foreground/80 backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold"
    >
      <Download className="h-4 w-4" />
      {t("resume.download", "Download Resume")}
    </a>
  ) : undefined;

  return (
    <section id="resume" className="relative overflow-hidden py-20 sm:py-24">
      <div className="container relative mx-auto px-4">
        <SectionHeader
          eyebrow={t("resume.experience", "Experience")}
          icon={FileText}
          title={t("resume.company", "Company")}
          highlight={t("resume.journey", "Journey")}
          description={t("resume.journeyDescription", "A journey of professional growth, meaningful experiences, and contributions to every organization.")}
          action={downloadButton}
        />

        {resume.length === 0 ? (
          <EmptyState icon={FileText} title={t("resume.emptyTitle", "No resume entries yet")} description={t("resume.emptyDescription", "Work, education and certifications added from the dashboard will appear here.")} />
        ) : (
          <>
            <div className="mx-auto max-w-5xl">
              {resume.map((item, index) => {
                const startYear = yearOf(item.period);
                const endYear = yearOf(item.period, -1);
                const ongoing = /present|current|now|ongoing/i.test(item.period);
                const isPast = !ongoing && endYear !== null && endYear < currentYear;
                const status = isPast ? t("resume.past", "Past") : t("resume.present", "Present");

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.3), ease: [0.22, 1, 0.36, 1] }}
                    className="relative grid gap-4 pb-10 md:grid-cols-[170px_40px_1fr] md:gap-0"
                  >
                    <div className="md:pr-6 md:text-right">
                      <p className="text-3xl font-extrabold leading-none text-gold sm:text-4xl">
                        {startYear ?? t("resume.experience", "Experience")}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">{item.period}</p>
                    </div>

                    <div className="relative hidden md:block" aria-hidden="true">
                      <span className={`absolute left-1/2 top-2 w-px -translate-x-1/2 bg-border ${index === resume.length - 1 ? "h-16" : "h-full"}`} />
                      <span className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_14px_hsl(var(--gold)/0.75)]" />
                    </div>

                    <div className="group relative rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-gold/30 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/10 text-sm font-bold text-gold">
                            {initialsOf(item.organization || item.title) || "•"}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold tracking-tight text-gold sm:text-xl">
                              {item.organization || item.title}
                            </h3>
                            <p className="truncate text-sm text-muted-foreground">
                              {item.organization ? item.title : item.type_label || t(`resume.${item.type}`, item.type)}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold text-background">
                          {status}
                        </span>
                      </div>

                      {item.description && (
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-gold/80" />
                          {item.period}
                        </span>
                        <Link to="/resume" className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                          {t("resume.viewDetails", "View details")}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
            <SectionViewAll to="/resume" />
          </>
        )}
      </div>
    </section>
  );
};

export default Resume;
