import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageSquareQuote, Quote, Building2, MessageSquare, Plus } from "lucide-react";
import { SectionHeader, EmptyState } from "@/components/SectionHeader";
import { usePortfolio } from "@/lib/store";
import { initialsOf } from "@/lib/utils";
import { useUiText } from "@/lib/localization";
import SectionViewAll from "@/components/SectionViewAll";

const Testimonials = () => {
  const { testimonials } = usePortfolio();
  const t = useUiText();

  const addFeedback = (
    <Link
      to="/contact"
      className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-card/60 px-5 text-sm font-semibold text-foreground/80 backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold"
    >
      <Plus className="h-4 w-4" />
      {t("testimonials.addFeedback", "Add Feedback")}
    </Link>
  );

  return (
    <section id="testimonials" className="relative overflow-hidden py-20 sm:py-24">
      <div className="container relative mx-auto px-4">
        <SectionHeader
          eyebrow={t("testimonials.eyebrow", "Testimonials")}
          icon={MessageSquareQuote}
          title={t("testimonials.whatPeopleSay", "What People")}
          highlight={t("testimonials.say", "Say")}
          description={t("testimonials.description", "Don't just take my word for it. Here's what people say about working with me.")}
          action={addFeedback}
        />

        {testimonials.length === 0 ? (
          <EmptyState icon={MessageSquareQuote} title={t("testimonials.emptyTitle", "No testimonials yet")} description={t("testimonials.emptyDescription", "Testimonials added from the dashboard will appear here.")} />
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {testimonials.map((item, i) => (
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-gold/40"
              >
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} loading="lazy" className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10" />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/[0.06] text-sm font-bold text-foreground ring-1 ring-white/10">
                      {initialsOf(item.name) || "?"}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gold">{item.name}</p>
                    {item.role && <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">{item.role}</p>}
                  </div>
                </div>

                <Quote className="mt-5 h-6 w-6 shrink-0 text-gold/25" />

                <blockquote className="mt-2 line-clamp-4 flex-1 text-sm leading-6 text-muted-foreground">{item.content}</blockquote>

                {item.company && (
                  <p className="mt-5 flex items-center gap-2 text-sm text-foreground/80">
                    <Building2 className="h-4 w-4 shrink-0 text-gold" />
                    <span className="truncate">{item.company}</span>
                  </p>
                )}

                <figcaption className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-medium">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {t("testimonials.feedback", "Feedback")}
                  </span>
                  <Link to="/testimonials" className="text-gold transition-colors hover:text-gold/80">
                    {t("testimonials.readMore", "Read more")}
                  </Link>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}

        {testimonials.length > 0 && <SectionViewAll to="/testimonials" />}
      </div>
    </section>
  );
};

export default Testimonials;
