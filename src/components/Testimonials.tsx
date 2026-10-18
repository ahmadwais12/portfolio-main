import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MessageSquareQuote, Quote, Star } from "lucide-react";
import { SectionHeader, EmptyState } from "@/components/SectionHeader";
import { usePortfolio } from "@/lib/store";
import { initialsOf } from "@/lib/utils";
import { useUiText } from "@/lib/localization";
import SectionViewAll from "@/components/SectionViewAll";
import { useLocation } from "react-router-dom";

const Testimonials = () => {
  const { testimonials } = usePortfolio();
  const t = useUiText();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [slideIndex, setSlideIndex] = useState(0);
  const pairCount = Math.ceil(testimonials.length / 2);

  useEffect(() => {
    setSlideIndex(0);
    if (!isHome || pairCount < 2) return;
    const timer = setInterval(() => setSlideIndex(current => (current + 1) % pairCount), 5000);
    return () => clearInterval(timer);
  }, [isHome, pairCount]);

  const visibleTestimonials = isHome && testimonials.length > 2
    ? [testimonials[(slideIndex * 2) % testimonials.length], testimonials[(slideIndex * 2 + 1) % testimonials.length]]
    : testimonials;

  return (
    <section id="testimonials" className="relative overflow-hidden bg-muted/30 px-4 py-24">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[24rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative mx-auto">
        <SectionHeader
          eyebrow={t("testimonials.eyebrow", "Kind words")}
          icon={MessageSquareQuote}
          title={t("testimonials.titlePrefix", "Client")}
          highlight={t("testimonials.title", "Testimonials")}
          description={t("testimonials.description", "Don't just take my word for it. Here's what people say about working with me.")}
        />

        {testimonials.length === 0 ? (
          <EmptyState icon={MessageSquareQuote} title={t("testimonials.emptyTitle", "No testimonials yet")} description={t("testimonials.emptyDescription", "Testimonials added from the dashboard will appear here.")} />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isHome ? slideIndex : "all-testimonials"}
            initial={isHome ? { opacity: 0, x: 48 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={isHome ? { opacity: 0, x: -48 } : undefined}
            transition={{ duration: isHome ? 0.7 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto grid max-w-6xl grid-cols-1 justify-center gap-6 sm:grid-cols-[repeat(auto-fit,minmax(18rem,22rem))]"
          >
            {visibleTestimonials.map((t, i) => {
              const photo = t.image;
              const rating = Math.max(0, Math.min(5, t.rating ?? 5));
              const subtitle = [t.role, t.company].filter(Boolean).join(" · ");
              return (
                <motion.figure
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_25px_60px_-15px_hsl(var(--primary)/0.35)]"
                >
                  <Quote className="absolute right-6 top-6 h-12 w-12 text-primary/10 transition-colors group-hover:text-primary/20" />

                  <div className="mb-4 flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={`h-4 w-4 ${s < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>

                  <blockquote className="mb-6 flex-1 leading-relaxed text-foreground/85">"{t.content}"</blockquote>

                  <figcaption className="flex items-center gap-3 border-t border-border/60 pt-5">
                    <div className="relative shrink-0">
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-primary opacity-70" />
                      {photo ? (
                        <img src={photo} alt={t.name} loading="lazy" className="relative h-12 w-12 rounded-full border-2 border-background object-cover" />
                      ) : (
                        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-background bg-card text-sm font-bold text-primary">
                          {initialsOf(t.name) || "?"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{t.name}</p>
                      {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
                    </div>
                  </figcaption>
                </motion.figure>
              );
            })}
          </motion.div>
          </AnimatePresence>
        )}
        {testimonials.length > 0 && <SectionViewAll to="/testimonials" />}
      </div>
    </section>
  );
};

export default Testimonials;
