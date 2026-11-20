import type { ComponentType, ReactNode } from "react";
import { motion } from "framer-motion";

type IconType = ComponentType<{ className?: string }>;

type SectionHeaderProps = {
  eyebrow: string;
  icon: IconType;
  title: string;
  highlight: string;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
};

/** Shared heading used by every home page section. */
export const SectionHeader = ({ eyebrow, title, highlight, description, action, children }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="mx-auto mb-12 flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between"
  >
    <div className="max-w-2xl">
      <span className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
        <span aria-hidden="true" className="h-px w-10 bg-gold" />
        {eyebrow}
      </span>
      <div className="flex items-stretch gap-4">
        <span aria-hidden="true" className="w-1 shrink-0 rounded-full bg-gold" />
        <h2 className="text-gold-gradient text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          {title}{highlight ? ` ${highlight}` : ""}
        </h2>
      </div>
      {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
    </div>
    {(action || children) && (
      <div className="flex shrink-0 flex-wrap items-center gap-3 md:justify-end md:pb-2">
        {action}
        {children}
      </div>
    )}
  </motion.div>
);

type EmptyStateProps = {
  icon: IconType;
  title: string;
  description: string;
};

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-12 text-center backdrop-blur-sm">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
      <Icon className="h-6 w-6" />
    </div>
    <p className="mb-1 font-semibold">{title}</p>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);
