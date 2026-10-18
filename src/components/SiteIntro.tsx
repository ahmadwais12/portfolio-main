import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { usePortfolio } from "@/lib/store";

/**
 * Opening transition — a branded curtain that covers the very first paint,
 * shows the name while the portfolio content loads, then lifts up to reveal
 * the page exactly as the hero plays its entrance animation.
 *
 * Plays once per full page load (not on client-side navigation), is skipped
 * for the admin/dashboard routes and for users who prefer reduced motion.
 */
const MIN_HOLD = 800; // never lift before this (ms)
const MAX_HOLD = 1500; // hard cap while waiting for content (ms)
const EXIT_DURATION = 0.65; // curtain lift (seconds)
const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

const SiteIntro = () => {
  const reducedMotion = useReducedMotion();
  const { pathname } = useLocation();
  const { about, status } = usePortfolio();
  const mountedAt = useRef(Date.now());
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  const isPrivate = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
  const name = about.full_name.trim();

  /* Lock scrolling while the curtain is up (with a safety release). */
  useEffect(() => {
    if (reducedMotion || isPrivate) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const safety = window.setTimeout(
      () => { document.body.style.overflow = previous; },
      MAX_HOLD + EXIT_DURATION * 1000 + 400
    );
    return () => {
      window.clearTimeout(safety);
      document.body.style.overflow = previous;
    };
  }, [reducedMotion, isPrivate]);

  /* Lift once the content is ready, but never before MIN_HOLD or after MAX_HOLD. */
  useEffect(() => {
    if (reducedMotion || leaving) return;
    if (isPrivate) {
      setLeaving(true);
      return;
    }
    const elapsed = Date.now() - mountedAt.current;
    const contentReady = status === "ready" || status === "error";
    const remaining = contentReady
      ? Math.max(0, MIN_HOLD - elapsed)
      : MAX_HOLD - elapsed;
    if (remaining <= 0) {
      setLeaving(true);
      return;
    }
    const t = window.setTimeout(() => setLeaving(true), remaining);
    return () => window.clearTimeout(t);
  }, [status, reducedMotion, isPrivate, leaving]);

  /* Fallback removal in case the animation-complete callback never fires. */
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setGone(true), EXIT_DURATION * 1000 + 300);
    return () => window.clearTimeout(t);
  }, [leaving]);

  if (reducedMotion || gone) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[200] overflow-hidden bg-background"
      initial={false}
      animate={{ y: leaving ? "-100%" : "0%" }}
      transition={{ duration: EXIT_DURATION, ease: CURTAIN_EASE }}
      onAnimationComplete={() => { if (leaving) setGone(true); }}
    >
      <div className="hero-grid absolute inset-0" />
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/25 blur-[110px]" />
      <div className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-secondary/25 blur-[110px]" />

      <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6">
        <AnimatePresence mode="wait">
          {name && (
            <motion.span
              key={name}
              className="text-gradient px-4 text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: SOFT_EASE }}
            >
              {name}
            </motion.span>
          )}
        </AnimatePresence>

        <div className="relative h-px w-40 overflow-hidden bg-border sm:w-56">
          <motion.span
            className="absolute inset-y-0 left-0 block w-1/3 bg-gradient-primary"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SiteIntro;
