import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Download } from "lucide-react";
import { usePortfolio } from "@/lib/store";
import { initialsOf } from "@/lib/utils";
import { useUiText, splitLocalizedList } from "@/lib/localization";
import HeroBackdrop from "@/components/HeroBackdrop";

const RotatingTitles = ({ titles, intervalMs = 3000 }: { titles: string[]; intervalMs?: number }) => {
  const [index, setIndex] = useState(0);
  const count = titles.length;

  useEffect(() => {
    setIndex(current => (current < count ? current : 0));
    if (count < 2) return;
    const timer = setInterval(() => setIndex(current => (current + 1) % count), intervalMs);
    return () => clearInterval(timer);
  }, [count, intervalMs]);

  if (count === 0) return null;
  const title = titles[Math.min(index, count - 1)];

  return (
    <span className="relative inline-block overflow-hidden" style={{ padding: "0.12em 0", margin: "-0.12em 0" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={title}
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="block text-gold"
        >
          {title}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const Hero = () => {
  const { about } = usePortfolio();
  const t = useUiText();

  const displayName = about.full_name.trim() || "Ahmad Wais Sarwari";
  const nameParts = displayName.split(/\s+/);
  const lastName = nameParts.length > 1 ? nameParts.pop() || "" : "";
  const firstLine = nameParts.join(" ");

  const titles = splitLocalizedList(about.title.replace(/\|/g, ","));
  if (titles.length === 0) titles.push("Software Developer");
  const intro = about.bio.split("\n").find(line => line.trim())?.trim()
    || t(
      "hero.descriptionFallback",
      "We design interfaces that combine beauty with functionality, creating seamless experiences that users love and businesses thrive on."
    );

  const cvUrl = about.resume_url.trim() || "/resume.pdf";
  const initials = initialsOf(displayName) || "ME";

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-[#05090c] pb-20 pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-aura absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full bg-[#38bdf8]/[0.08] blur-[130px]" />
        <div className="hero-aura-slow absolute -bottom-48 left-[-8%] h-[34rem] w-[34rem] rounded-full bg-[#38bdf8]/[0.05] blur-[120px]" />
        <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent_0%,black_45%,black_80%,rgba(0,0,0,0.6)_100%)]">
          <HeroBackdrop />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#04090c]/90 via-[#04090c]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div className="max-w-3xl text-left">
            <motion.div {...fadeUp(0)} className="mb-7">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#0a1014]/55 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md sm:text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38bdf8] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#38bdf8]" />
                </span>
                {t("hero.available", "Available for freelance & full-time roles")}
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="text-balance text-gold-gradient text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.4rem]"
            >
              {firstLine || displayName}
              {lastName && (
                <>
                  <br />
                  <span>{lastName}</span>
                </>
              )}
            </motion.h1>

            {titles.length > 0 && (
              <motion.div
                {...fadeUp(0.18)}
                className="mt-4 min-h-[2.4em] overflow-hidden text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
              >
                <RotatingTitles titles={titles} />
              </motion.div>
            )}

            {intro && (
              <motion.p {...fadeUp(0.26)} className="mb-9 mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
                {intro}
              </motion.p>
            )}

            <motion.div {...fadeUp(0.34)} className="flex flex-wrap items-center gap-3">
              <a
                href="#about"
                className="group inline-flex h-12 items-center gap-2 rounded-lg bg-gold px-7 text-xs font-semibold uppercase tracking-[0.18em] text-gold-foreground transition-colors hover:bg-gold/90"
              >
                {t("hero.aboutMe", "About Me")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-2 rounded-lg border border-gold/45 bg-transparent px-7 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition-colors hover:border-gold hover:bg-gold/10"
              >
                {t("hero.downloadCv", "Download CV")}
                <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.2)} className="order-first justify-self-center lg:order-none lg:justify-self-end">
            <div className="relative h-64 w-64 bg-gradient-to-br from-[#bae6fd] via-[#38bdf8] to-[#0284c7] p-[3px] shadow-[0_0_80px_-16px_rgba(56,189,248,0.6)] sm:h-80 sm:w-80 rounded-3xl">
              <div className="h-full w-full overflow-hidden rounded-[21px] bg-[#0a1014]">
                {about.avatar_url ? (
                  <img
                    src={about.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-5xl font-bold tracking-wide text-[#38bdf8] sm:text-6xl">
                    {initials}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
