import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Sparkles, ArrowUpRight, MapPin, ExternalLink, ArrowUp } from "lucide-react";
import { usePortfolio } from "@/lib/store";
import { getSocialIcon, rgba } from "@/lib/socials";
import { useUiText } from "@/lib/localization";

const navLinks = [
  { label: "About",        href: "/about" },
  { label: "Skills",       href: "/skills" },
  { label: "Projects",     href: "/projects" },
  { label: "Resume",       href: "/resume" },
  { label: "Services",     href: "/services" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact",      href: "/contact" },
];

const MotionLink = motion.create(Link);

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const { about, socialLinks: savedSocialLinks } = usePortfolio();
  const t = useUiText();
  const brandName = about.full_name.trim() || "Portfolio";

  // Social platforms managed from Dashboard → Social Media
  const socialLinks = savedSocialLinks.filter(s => s.enabled && s.url.trim()).map((s) => ({
      icon: getSocialIcon(s.icon),
      label: s.label,
      sub: s.sub,
      href: s.url,
      color: s.color,
    }));

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-background/40" ref={ref}>
      <div className="container mx-auto px-4 pt-16 pb-0 relative z-10">

        {/* ── Top: Logo + tagline + nav ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12 items-start">

          {/* Brand */}
          <motion.div initial={{ opacity:0, y:20 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ duration:0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-gradient-to-r from-[#bae6fd] via-[#38bdf8] to-[#0284c7] bg-clip-text text-xl font-black text-transparent">
                {brandName}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3 max-w-xs">
              {about.bio.split("\n")[0] || t("footer.designingExperiences", "Designing and building modern, fast and accessible web experiences.")}
            </p>
            {about.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                {about.location}
              </p>
            )}
          </motion.div>

          {/* Quick nav */}
          <motion.div initial={{ opacity:0, y:20 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ duration:0.6, delay:0.1 }}>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> {t("footer.quickLinks", "Quick Links")}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map((link, i) => (
                <MotionLink key={link.label} to={link.href}
                  initial={{ opacity:0, x:-10 }} animate={isInView ? { opacity:1, x:0 } : {}}
                  transition={{ delay:0.15+i*0.05 }}
                  whileHover={{ x:4 }}
                  className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-200 hover:text-gold"
                >
                  <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors flex-shrink-0" />
                  {t(`nav.${link.label.toLowerCase()}`, link.label)}
                </MotionLink>
              ))}
            </div>
          </motion.div>

          {/* Availability card */}
          <motion.div initial={{ opacity:0, y:20 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ duration:0.6, delay:0.2 }}>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> {t("footer.status", "Status")}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-green-400/20 bg-green-500/5 p-3">
                <motion.div className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0"
                  animate={{ scale:[1,1.4,1], opacity:[1,0.5,1] }} transition={{ duration:2, repeat:Infinity }} />
                <div>
                  <p className="text-xs font-bold text-green-400">{t("footer.availableForWork", "Available for Work")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("footer.opportunities", "Open to new opportunities")}</p>
                </div>
              </div>
              <MotionLink to="/contact"
                whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:0.97 }}
                className="flex items-center justify-between rounded-xl bg-gold p-3 text-gold-foreground transition-colors hover:bg-gold/90 group"
              >
                <span className="text-xs font-semibold">{t("nav.hireMe", "Hire Me")}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
              </MotionLink>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div initial={{ scaleX:0 }} animate={isInView ? { scaleX:1 } : {}} transition={{ duration:0.9, delay:0.3 }}
          className="mb-10 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        {/* ── Social links grid ── */}
        {socialLinks.length > 0 && <motion.div initial={{ opacity:0, y:16 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.35 }} className="mb-10">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" /> {t("footer.findMeOn", "Find Me On")} <Sparkles className="w-3.5 h-3.5 text-gold" />
          </p>
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3 [&>a]:w-[calc(50%-0.375rem)] sm:[&>a]:w-32">
            {socialLinks.map((s, i) => (
              <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                initial={{ opacity:0, y:20, scale:0.88 }}
                animate={isInView ? { opacity:1, y:0, scale:1 } : {}}
                transition={{ delay:0.4+i*0.07, type:"spring", bounce:0.4 }}
                whileHover={{ y:-7, boxShadow:`0 22px 45px ${rgba(s.color, 0.35)}` }}
                whileTap={{ scale:0.95 }}
                style={{ borderColor: rgba(s.color, 0.25), background: rgba(s.color, 0.07) }}
                className="relative group flex flex-col items-center gap-2 overflow-hidden rounded-2xl border p-4 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(to right, transparent, ${s.color}, transparent)` }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
                  style={{ background: s.color }} />
                <motion.div whileHover={{ rotate:10, scale:1.18 }} transition={{ type:"spring", bounce:0.5 }}
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${rgba(s.color, 0.55)})` }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md relative z-10">
                  <s.icon className="w-5 h-5 text-white" />
                </motion.div>
                <div className="text-center relative z-10">
                  <p className="text-xs font-bold" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{s.sub}</p>
                </div>
                <ArrowUpRight className="absolute top-2.5 right-2.5 w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ color: s.color }} />
              </motion.a>
            ))}
          </div>
        </motion.div>}

        {/* ── Bottom bar ── */}
        <motion.div initial={{ scaleX:0 }} animate={isInView ? { scaleX:1 } : {}} transition={{ duration:0.9, delay:0.55 }}
          className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <motion.div initial={{ opacity:0, y:10 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.65 }}
          className="flex flex-col items-center justify-between gap-4 py-6 text-center md:flex-row md:text-left">

          <div className="space-y-1">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              <span className="bg-gradient-to-r from-[#bae6fd] via-[#38bdf8] to-[#0284c7] bg-clip-text font-bold text-transparent">
                {brandName}
              </span>
              . {t("footer.rights", "All rights reserved.")}
            </p>

            {/* Crafted with */}
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap justify-center md:justify-start">
              {t("footer.craftedWith", "Crafted with")}
              <motion.span animate={{ scale:[1,1.35,1] }} transition={{ duration:1.1, repeat:Infinity }}>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </motion.span>
              {t("footer.andPassion", "and passion")}{about.location && <> {t("footer.in", "in")}
              <span className="font-semibold text-gold">
                {about.location}
              </span></>}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-sm transition-all hover:border-gold/50 hover:text-gold"
          >
            {t("footer.backToTop", "Back to top")}
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
