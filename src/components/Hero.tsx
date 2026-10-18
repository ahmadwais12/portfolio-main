import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";
import { ArrowRight, MapPin, Mail, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/lib/store";
import { getSocialIcon } from "@/lib/socials";
import { useUiText, splitLocalizedList } from "@/lib/localization";

/**
 * Rotating Text / Text Rotator — the sentence stays in place ("I'm a …") while
 * only the changing part cycles through the list of professional titles:
 *   I'm a Full-Stack Developer → I'm a Flutter Developer → I'm a Mobile App Developer
 */
const RotatingTitles = ({ titles, prefix, intervalMs = 3000 }: { titles: string[]; prefix?: string; intervalMs?: number }) => {
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
    <span className="flex flex-wrap items-baseline justify-center gap-x-2 lg:justify-start">
      {prefix && <span className="text-muted-foreground">{prefix}</span>}
      <span
        className="relative inline-block overflow-hidden"
        style={{ padding: "0.12em 0", margin: "-0.12em 0" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={title}
            initial={{ opacity: 0, y: "100%", rotateX: -50 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: "-100%", rotateX: 50 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="block bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text font-bold text-transparent animate-gradient"
            style={{ transformOrigin: "center center", backfaceVisibility: "hidden" }}
          >
            {title}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
};

/**
 * Text Slider — the outgoing text slides up and out of the masked window,
 * then the next text slides in from below (whenever the text changes:
 * language switch, edited name, etc.).
 */
const TextSlider = ({ text, children }: { text: string; children: ReactNode }) => (
  <span
    className="block overflow-hidden"
    style={{ padding: "0.15em 0", margin: "-0.15em 0" }}
  >
    <AnimatePresence mode="wait">
      <motion.span
        key={text}
        className="block"
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "-100%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  </span>
);

const AnimatedName = ({ name }: { name: string }) => (
  <motion.span
    key={name}
    aria-label={name}
    className="inline-block"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.045, delayChildren: 0.35 } },
    }}
  >
    {name.split("").map((character, index) => (
      <motion.span
        key={`${character}-${index}`}
        aria-hidden="true"
        className="inline-block text-primary"
        style={{ whiteSpace: character === " " ? "pre" : undefined, transformOrigin: "center bottom", backfaceVisibility: "hidden" }}
        variants={{
          hidden: { opacity: 0, rotateX: -90, y: 10 },
          visible: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
        }}
      >
        {character === " " ? "\u00a0" : character}
      </motion.span>
    ))}
  </motion.span>
);

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const Hero = () => {
  const { about, socialLinks: allSocialLinks } = usePortfolio();
  const t = useUiText();
  const socials = allSocialLinks.filter(item => item.enabled && item.url.trim()).slice(0, 6);

  const firstName = about.full_name.trim();
  const welcomeTitle = t("hero.introWithName", "Welcome to my {highlight}").split("{highlight}");
  const greeting = t("hero.greeting", "Hi, I'm");
  const titles = splitLocalizedList(about.title.replace(/\|/g, ","));
  const intro = about.bio.split("\n").find(line => line.trim())?.trim()
    || (titles[0] ? t("hero.titleFallback", `Crafting fast, accessible and beautiful digital experiences as a ${titles[0]}.`).replace("{title}", titles[0]) : "");
  const initials = about.full_name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const stats = [
    { value: about.years_experience, label: t("hero.yearsExperience", "Years experience") },
    { value: about.projects_completed, label: t("hero.projectsDone", "Projects done") },
    { value: about.technologies, label: t("hero.technologies", "Technologies") },
  ].filter(s => s.value.trim());

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-background pb-16 pt-28">
      {/* Animated code editor and circuit artwork. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-violet-50 to-blue-100 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950" />
        <div className="hero-color-orb hero-color-orb-cyan absolute -left-36 top-[12%] h-[26rem] w-[26rem] rounded-full bg-cyan-400/20 blur-[110px]" />
        <div className="hero-color-orb hero-color-orb-violet absolute right-[8%] top-[18%] h-[30rem] w-[30rem] rounded-full bg-violet-500/15 blur-[130px] dark:bg-violet-500/25" />
        <div className="hero-color-orb hero-color-orb-blue absolute bottom-[-10rem] left-[35%] h-[28rem] w-[28rem] rounded-full bg-blue-500/15 blur-[130px] dark:bg-blue-500/20" />
        <img
          src="/coding-hero.svg"
          alt=""
          className="hero-code-art absolute inset-0 h-full w-full object-cover object-center opacity-40 dark:opacity-50"
        />
        <div className="hero-code-scan absolute -inset-x-1/3 inset-y-0" />
        <div className="hero-grid absolute inset-0" />
        <div className="absolute inset-0 bg-background/55 lg:bg-transparent lg:bg-gradient-to-r lg:from-background/80 lg:via-background/40 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <motion.div {...fadeUp(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-4 py-1.5 text-xs font-semibold text-foreground/80 backdrop-blur-md sm:text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              {t("hero.available", "Available for new projects")}
            </motion.div>

            <motion.h1 {...fadeUp(0.1)} className="mb-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              {firstName ? (
                <>
                  {greeting}{" "}
                  <TextSlider text={firstName}>
                    <AnimatedName name={firstName} />
                  </TextSlider>
                </>
              ) : (
                <>
                  {welcomeTitle[0]}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">{welcomeTitle[1] || ""}</span>
                </>
              )}
            </motion.h1>

            {titles.length > 0 && (
              <motion.div {...fadeUp(0.2)} className="mb-6 min-h-10 overflow-hidden text-2xl sm:text-3xl md:min-h-12 md:text-4xl">
                <RotatingTitles titles={titles} prefix={t("hero.iAm", "I'm a")} />
              </motion.div>
            )}

            {intro && (
              <motion.p {...fadeUp(0.3)} className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg lg:mx-0">
                {intro}
              </motion.p>
            )}

            <motion.div {...fadeUp(0.4)} className="mb-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button
                size="lg"
                className="group h-12 rounded-full bg-gradient-primary px-7 font-semibold text-white shadow-glow-lg transition-transform hover:scale-[1.03] hover:opacity-95"
                onClick={() => scrollToSection("projects")}
              >
                {t("hero.viewWork", "View My Work")}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary/40 bg-background/50 px-7 font-semibold backdrop-blur-md hover:border-primary hover:bg-primary/10"
                onClick={() => scrollToSection("contact")}
              >
                <Mail className="mr-1 h-4 w-4" />
                {t("hero.contact", "Contact Me")}
              </Button>
            </motion.div>

            {(socials.length > 0 || stats.length > 0) && (
              <motion.div {...fadeUp(0.5)} className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:justify-start">
                {socials.length > 0 && (
                  <div className="flex items-center gap-2">
                    {socials.map(s => {
                      const Icon = getSocialIcon(s.icon);
                      return (
                        <a
                          key={s.id}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/50 text-foreground/70 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/60 hover:text-primary"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                )}

                {socials.length > 0 && stats.length > 0 && <span className="hidden h-10 w-px bg-border sm:block" />}

                {stats.length > 0 && (
                  <div className="flex gap-6">
                    {stats.map(s => (
                      <div key={s.label} className="text-center sm:text-left">
                        <p className="bg-gradient-primary bg-clip-text text-2xl font-bold text-transparent">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="relative mx-auto w-full max-w-[18rem] sm:max-w-sm"
          >
            <motion.div
              className="group relative aspect-square"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -inset-6 rounded-full bg-gradient-primary opacity-30 blur-3xl animate-glow" />
              <div className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,hsl(var(--primary)),hsl(var(--secondary)),transparent_60%,hsl(var(--primary)))] animate-spin-slow" />
              <div className="absolute inset-0 rounded-full bg-background" />

              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-background shadow-glow-lg">
                {about.avatar_url ? (
                  <img
                    src={about.avatar_url}
                    alt={about.full_name || t("about.profilePhoto", "Profile photo")}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/25 via-background to-secondary/25">
                    {initials ? (
                      <span className="bg-gradient-primary bg-clip-text text-7xl font-extrabold text-transparent">{initials}</span>
                    ) : (
                      <UserRound className="h-24 w-24 text-primary/60" />
                    )}
                  </div>
                )}
              </div>

              {titles[0] && (
                <div className="absolute -left-4 top-8 flex items-center gap-2 rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-md sm:-left-10">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {titles[0]}
                </div>
              )}
              {about.location && (
                <div className="absolute -right-2 bottom-10 flex items-center gap-2 rounded-2xl border border-border/60 bg-background/80 px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-md sm:-right-8">
                  <MapPin className="h-4 w-4 text-secondary" />
                  {about.location}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("about")}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary md:flex"
        aria-label={t("hero.scrollToAbout", "Scroll to about section")}
      >
        {t("hero.scroll", "Scroll")}
        <span className="flex h-9 w-5 justify-center rounded-full border-2 border-current pt-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-current"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </button>
    </section>
  );
};

export default Hero;
