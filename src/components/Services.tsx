import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code, Palette, Smartphone, Database, Globe, Shield, Briefcase, Check, ArrowRight } from "lucide-react";
import { SectionHeader, EmptyState } from "@/components/SectionHeader";
import { usePortfolio } from "@/lib/store";
import { useUiText } from "@/lib/localization";
import SectionViewAll from "@/components/SectionViewAll";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Smartphone,
  Palette,
  Database,
  Globe,
  Shield,
};

const Services = () => {
  const { services } = usePortfolio();
  const t = useUiText();

  return (
    <section id="services" className="relative overflow-hidden bg-background px-4 py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-secondary/10 blur-[120px]" />

      <div className="container relative mx-auto">
        <SectionHeader
          eyebrow={t("services.eyebrow", "What I offer")}
          icon={Briefcase}
          title={t("services.my", "My")}
          highlight={t("services.title", "Services")}
          description={t("services.description", "End-to-end help to design, build and launch products your users will love.")}
        />

        {services.length === 0 ? (
          <EmptyState icon={Briefcase} title={t("services.emptyTitle", "No services yet")} description={t("services.emptyDescription", "Services added from the dashboard will appear here.")} />
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 justify-center gap-6 sm:grid-cols-[repeat(auto-fit,minmax(18rem,22rem))]">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] ?? Code;
              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_25px_60px_-15px_hsl(var(--primary)/0.35)]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-primary transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-primary opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25" />

                  <div className="mb-6 flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-glow transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="text-4xl font-extrabold text-foreground/5 transition-colors group-hover:text-primary/15">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary">{service.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{service.description}</p>

                  {service.features?.length > 0 && (
                    <ul className="mt-auto space-y-2 border-t border-border/60 pt-5">
                      {service.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <Check className="h-3 w-3" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-5 overflow-hidden rounded-3xl bg-gradient-primary p-8 text-center text-white shadow-glow-lg md:flex-row md:text-left"
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_55%)]" />
          <div className="relative">
            <h3 className="text-2xl font-bold">{t("services.ctaTitle", "Have a project in mind?")}</h3>
            <p className="text-white/80">{t("services.ctaDescription", "Let's talk about how I can help bring it to life.")}</p>
          </div>
          <Link
            to="/contact"
            className="group relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition-transform hover:scale-105"
          >
            {t("services.ctaStartProject", "Start a project")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
        {services.length > 0 && <SectionViewAll to="/services" />}
      </div>
    </section>
  );
};

export default Services;
