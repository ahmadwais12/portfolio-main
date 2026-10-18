import type { ComponentType, ReactNode } from "react";
import { motion } from "framer-motion";

type IconType = ComponentType<{ className?: string }>;

type SectionHeaderProps = {
  eyebrow: string;
  icon: IconType;
  title: string;
  highlight: string;
  description?: ReactNode;
  children?: ReactNode;
};

/** Shared heading used by every home page section. */
export const SectionHeader = ({ eyebrow, icon: Icon, title, highlight, description, children }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="mx-auto mb-14 max-w-2xl text-center"
  >
    <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      <Icon className="h-3.5 w-3.5" />
      {eyebrow}
    </span>
    <h2 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
      {title}{" "}
      <span className="relative inline-block bg-gradient-primary bg-clip-text text-transparent">
        {highlight}
        <motion.span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-0 h-1 w-full origin-left rounded-full bg-gradient-primary"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </span>
    </h2>
    {description && <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
    {children}
  </motion.div>
);

type EmptyStateProps = {
  icon: IconType;
  title: string;
  description: string;
};

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-border/70 bg-background/40 px-6 py-12 text-center backdrop-blur-sm">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Icon className="h-6 w-6" />
    </div>
    <p className="mb-1 font-semibold">{title}</p>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);