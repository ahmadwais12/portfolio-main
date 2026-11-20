import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code, Palette, Smartphone, Database, Globe, Shield, Briefcase, ArrowRight } from "lucide-react";
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
    <section id="services" className="relative overflow-hidden py-20 sm:py-24">
      <div className="container relative mx-auto px-4">
        <SectionHeader
          eyebrow={t("services.eyebrow", "Services")}
          icon={Briefcase}
          title={t("services.whatICan", "What I Can")}
          highlight={t("services.buildForYou", "Build For You")}
          description={t("services.servicesDescription", "Practical digital services shaped around clean interfaces, reliable systems, and business goals.")}
        />

        {services.length === 0 ? (
          <EmptyState icon={Briefcase} title={t("services.emptyTitle", "No services yet")} description={t("services.emptyDescription", "Services added from the dashboard will appear here.")} />
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] ?? Code;
              return (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.07, 0.3), ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-gold/40"
                >
                  <span aria-hidden="true" className="pointer-events-none absolute right-5 top-4 text-5xl font-extrabold leading-none text-foreground/[0.06]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-zinc-100 ring-1 ring-white/10">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-7 text-xl font-bold tracking-tight text-gold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
                </motion.article>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-5 rounded-2xl border border-border/70 bg-card/60 p-7 backdrop-blur-sm md:flex-row md:items-center"
        >
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gold">{t("services.ctaTitle", "Have a project in mind?")}</h3>
            <p className="mt-1 text-muted-foreground">{t("services.ctaDescription", "Let's talk about how I can help bring it to life.")}</p>
          </div>
          <Link
            to="/contact"
            className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-gold px-6 text-sm font-semibold text-gold-foreground transition-colors hover:bg-gold/90"
          >
            {t("services.ctaStartProject", "Start a project")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {services.length > 0 && <SectionViewAll to="/services" />}
      </div>
    </section>
  );
};

export default Services;
