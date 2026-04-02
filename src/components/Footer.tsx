import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Github, Linkedin, Mail, Phone, Twitter, Heart, Sparkles, ArrowUpRight, MapPin, ExternalLink } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { getAbout } from "@/lib/store";

/* ─── floating particle ─── */
const Particle = ({ x, y, delay, size }: { x: string; y: string; delay: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-primary/30 pointer-events-none"
    style={{ left: x, top: y, width: size, height: size }}
    animate={{ y: [0, -18, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.4, 1] }}
    transition={{ duration: 3.5 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

const navLinks = [
  { label: "About",        href: "#about" },
  { label: "Skills",       href: "#skills" },
  { label: "Projects",     href: "#projects" },
  { label: "Resume",       href: "#resume" },
  { label: "Services",     href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact",      href: "#contact" },
];

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const about = getAbout();

  const socialLinks = [
    {
      icon: Github, label: "GitHub", sub: "View my repos",
      href: about.social_links.github,
      gradient: "from-gray-500 to-gray-700",
      bg: "bg-gray-500/8", border: "border-gray-400/20", text: "text-gray-400",
      glow: "rgba(107,114,128,0.35)",
    },
    {
      icon: Linkedin, label: "LinkedIn", sub: "Let's connect",
      href: about.social_links.linkedin,
      gradient: "from-blue-500 to-blue-700",
      bg: "bg-blue-500/8", border: "border-blue-400/20", text: "text-blue-400",
      glow: "rgba(59,130,246,0.35)",
    },
    {
      icon: Twitter, label: "Twitter", sub: "Follow updates",
      href: about.social_links.twitter,
      gradient: "from-sky-400 to-cyan-500",
      bg: "bg-sky-500/8", border: "border-sky-400/20", text: "text-sky-400",
      glow: "rgba(14,165,233,0.35)",
    },
    {
      icon: FaWhatsapp, label: "WhatsApp", sub: "Chat with me",
      href: about.social_links.whatsapp,
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-500/8", border: "border-green-400/20", text: "text-green-400",
      glow: "rgba(34,197,94,0.35)",
    },
    {
      icon: Mail, label: "Email", sub: "Drop a message",
      href: `mailto:${about.email}`,
      gradient: "from-cyan-500 to-primary",
      bg: "bg-cyan-500/8", border: "border-cyan-400/20", text: "text-cyan-400",
      glow: "rgba(6,182,212,0.35)",
    },
    {
      icon: Phone, label: "Phone", sub: "Call me directly",
      href: `tel:${about.phone}`,
      gradient: "from-violet-500 to-purple-500",
      bg: "bg-violet-500/8", border: "border-violet-400/20", text: "text-violet-400",
      glow: "rgba(139,92,246,0.35)",
    },
  ];

  return (
    <footer className="relative bg-gradient-hero border-t border-border/50 overflow-hidden" ref={ref}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale:[1,1.1,1], opacity:[0.04,0.09,0.04] }} transition={{ duration:8, repeat:Infinity }}
          className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-cyan-500 rounded-full blur-[110px]" />
        <motion.div animate={{ scale:[1,1.15,1], opacity:[0.04,0.08,0.04] }} transition={{ duration:10, repeat:Infinity, delay:2 }}
          className="absolute -bottom-32 -right-32 w-[550px] h-[550px] bg-violet-500 rounded-full blur-[110px]" />
        {/* Floating particles */}
        <Particle x="10%" y="20%" delay={0}   size={4} />
        <Particle x="25%" y="60%" delay={0.8} size={3} />
        <Particle x="50%" y="15%" delay={1.5} size={5} />
        <Particle x="70%" y="70%" delay={0.4} size={3} />
        <Particle x="85%" y="30%" delay={1.2} size={4} />
        <Particle x="40%" y="80%" delay={2.0} size={3} />
      </div>

      <div className="container mx-auto px-4 pt-16 pb-0 relative z-10">

        {/* ── Top: Logo + tagline + nav ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12 items-start">

          {/* Brand */}
          <motion.div initial={{ opacity:0, y:20 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ duration:0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <motion.img src="/logo.png" alt="logo"
                className="w-11 h-11 rounded-xl shadow-glow object-cover"
                whileHover={{ scale:1.08, rotate:4 }} transition={{ type:"spring", bounce:0.5 }} />
              <span className="text-xl font-black bg-gradient-to-r from-cyan-400 via-primary to-violet-500 bg-clip-text text-transparent">
                {about.full_name}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3 max-w-xs">
              Full Stack Developer & Mobile App Engineer crafting scalable, high-performance digital experiences.
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              {about.location}
            </p>
          </motion.div>

          {/* Quick nav */}
          <motion.div initial={{ opacity:0, y:20 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ duration:0.6, delay:0.1 }}>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Quick Links
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navLinks.map((link, i) => (
                <motion.a key={link.label} href={link.href}
                  initial={{ opacity:0, x:-10 }} animate={isInView ? { opacity:1, x:0 } : {}}
                  transition={{ delay:0.15+i*0.05 }}
                  whileHover={{ x:4, color:"hsl(190,100%,50%)" }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors flex-shrink-0" />
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Availability card */}
          <motion.div initial={{ opacity:0, y:20 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ duration:0.6, delay:0.2 }}>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Status
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 glass-card rounded-xl border border-green-400/20 bg-green-500/5">
                <motion.div className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0"
                  animate={{ scale:[1,1.4,1], opacity:[1,0.5,1] }} transition={{ duration:2, repeat:Infinity }} />
                <div>
                  <p className="text-xs font-bold text-green-400">Available for Work</p>
                  <p className="text-[10px] text-muted-foreground">Open to new opportunities</p>
                </div>
              </div>
              <motion.a href={`mailto:${about.email}`}
                whileHover={{ scale:1.02, y:-2 }} whileTap={{ scale:0.97 }}
                className="flex items-center justify-between p-3 glass-card rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/40 transition-all duration-300 group"
              >
                <span className="text-xs font-semibold text-primary">Hire Me</span>
                <ExternalLink className="w-3.5 h-3.5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div initial={{ scaleX:0 }} animate={isInView ? { scaleX:1 } : {}} transition={{ duration:0.9, delay:0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-10" />

        {/* ── Social links grid ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.35 }} className="mb-10">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Find Me On <Sparkles className="w-3.5 h-3.5 text-primary" />
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
            {socialLinks.map((s, i) => (
              <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                initial={{ opacity:0, y:20, scale:0.88 }}
                animate={isInView ? { opacity:1, y:0, scale:1 } : {}}
                transition={{ delay:0.4+i*0.07, type:"spring", bounce:0.4 }}
                whileHover={{ y:-7, boxShadow:`0 22px 45px ${s.glow}` }}
                whileTap={{ scale:0.95 }}
                className={`relative group flex flex-col items-center gap-2 p-4 rounded-2xl border ${s.border} ${s.bg} glass-card overflow-hidden transition-all duration-300`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.gradient}`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                <motion.div whileHover={{ rotate:10, scale:1.18 }} transition={{ type:"spring", bounce:0.5 }}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md relative z-10`}>
                  <s.icon className="w-5 h-5 text-white" />
                </motion.div>
                <div className="text-center relative z-10">
                  <p className={`text-xs font-bold ${s.text}`}>{s.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{s.sub}</p>
                </div>
                <ArrowUpRight className={`absolute top-2.5 right-2.5 w-3 h-3 ${s.text} opacity-0 group-hover:opacity-100 transition-all duration-300`} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div initial={{ scaleX:0 }} animate={isInView ? { scaleX:1 } : {}} transition={{ duration:0.9, delay:0.55 }}
          className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        <motion.div initial={{ opacity:0, y:10 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.65 }}
          className="flex flex-col items-center gap-3 py-6 text-center">

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              {about.full_name}
            </span>
            . All rights reserved.
          </p>

          {/* Crafted with */}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap justify-center">
            Crafted with
            <motion.span animate={{ scale:[1,1.35,1] }} transition={{ duration:1.1, repeat:Infinity }}>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </motion.span>
            and passion in
            <span className="font-semibold bg-gradient-to-r from-cyan-400 to-primary bg-clip-text text-transparent">
              Kabul, Afghanistan
            </span>
          </p>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
