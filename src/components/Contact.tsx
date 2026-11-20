import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Send, Sparkles, MessageSquare, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { usePortfolio } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getSocialIcon, rgba } from "@/lib/socials";
import { toast } from "sonner";
import { trackAnalyticsEvent } from "@/analytics/tracker";
import { useUiText } from "@/lib/localization";

const Contact = () => {
  const t = useUiText();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  useEffect(() => { if (isInView) void trackAnalyticsEvent("contact_section_view"); }, [isInView]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success(t("contact.sent", "Message sent! I'll get back to you soon."));
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1000);
  };

  const { about, socialLinks: savedSocialLinks } = usePortfolio();
  const contactDetails = [
    { icon: Mail, label: t("contact.email", "Email"), value: about.email, href: about.email && `mailto:${about.email}` },
    { icon: Phone, label: t("contact.phone", "Phone"), value: about.phone, href: about.phone && `tel:${about.phone.replace(/\s+/g, "")}` },
    { icon: MapPin, label: t("contact.location", "Location"), value: about.location, href: "" },
  ].filter(c => c.value.trim());

  // Social platforms managed from Dashboard → Social Media
  const socialLinks = savedSocialLinks.filter(s => s.enabled && s.url.trim()).map((s) => ({
    icon: getSocialIcon(s.icon),
    label: s.label,
    sub: s.sub,
    href: s.url,
    color: s.color,
  }));

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-24" id="contact" ref={ref}>
      <div className="container mx-auto relative z-10">

        <SectionHeader
          eyebrow={t("contact.eyebrow", "Let's talk")}
          icon={MessageSquare}
          title={t("contact.title", "Get In")}
          highlight={t("contact.highlight", "Touch")}
          description={t("contact.description", "Have a project in mind? Let's build something amazing together.")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* ── Contact Form ── */}
          <motion.div initial={{ opacity:0, x:-30 }} animate={isInView ? { opacity:1, x:0 } : {}} transition={{ duration:0.6, delay:0.2 }}>
            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gold">
                <div className="p-2 rounded-lg bg-gold/10 text-gold">
                  <Send className="w-4 h-4" />
                </div>
                {t("contact.formTitle", "Send a Message")}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name:"name",  label:t("contact.name", "Name"),  type:"text",  placeholder:t("contact.namePlaceholder", "Your name") },
                    { name:"email", label:t("contact.email", "Email"), type:"email", placeholder:t("contact.emailPlaceholder", "your@email.com") },
                  ].map(f => (
                    <motion.div key={f.name} className="space-y-1.5"
                      animate={{ scale: focused === f.name ? 1.01 : 1 }} transition={{ duration:0.2 }}>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
                      <Input name={f.name} type={f.type} value={formData[f.name as keyof typeof formData]}
                        onChange={handleChange} required placeholder={f.placeholder}
                        onFocus={() => setFocused(f.name)} onBlur={() => setFocused(null)}
                        className={`border bg-background/40 transition-colors duration-300 ${focused===f.name ? "border-gold/60" : "border-border/60"}`} />
                    </motion.div>
                  ))}
                </div>

                <motion.div className="space-y-1.5" animate={{ scale: focused==="subject" ? 1.01 : 1 }} transition={{ duration:0.2 }}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("contact.subject", "Subject")}</label>
                  <Input name="subject" value={formData.subject} onChange={handleChange} required placeholder={t("contact.subjectPlaceholder", "How can I help?")}
                    onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)}
                    className={`border bg-background/40 transition-colors duration-300 ${focused==="subject" ? "border-gold/60" : "border-border/60"}`} />
                </motion.div>

                <motion.div className="space-y-1.5" animate={{ scale: focused==="message" ? 1.005 : 1 }} transition={{ duration:0.2 }}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("contact.message", "Message")}</label>
                  <Textarea name="message" value={formData.message} onChange={handleChange} required
                    placeholder={t("contact.messagePlaceholder", "Tell me about your project...")} rows={5}
                    onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                    className={`border bg-background/40 resize-none transition-colors duration-300 ${focused==="message" ? "border-gold/60" : "border-border/60"}`} />
                </motion.div>

                <motion.div whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}>
                  <Button type="submit" disabled={sending}
                    className="w-full h-12 bg-gold text-gold-foreground hover:bg-gold/90 gap-2 font-semibold text-base">
                    {sending ? (
                      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}>
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    ) : <Send className="w-5 h-5" />}
                    {sending ? t("contact.sending", "Sending...") : t("contact.sendMessage", "Send Message")}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* ── Right column ── */}
          <motion.div initial={{ opacity:0, x:30 }} animate={isInView ? { opacity:1, x:0 } : {}} transition={{ duration:0.6, delay:0.3 }} className="space-y-6">

            {/* Availability badge */}
            <motion.div initial={{ opacity:0, y:10 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.4 }}
              className="flex items-center gap-3 rounded-2xl border border-green-400/20 bg-green-500/5 p-4">
              <motion.div className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0"
                animate={{ scale:[1,1.3,1], opacity:[1,0.6,1] }} transition={{ duration:2, repeat:Infinity }} />
              <div>
                <p className="font-semibold text-green-400 text-sm">{t("contact.availableForWork", "Available for Work")}</p>
                <p className="text-xs text-muted-foreground">{t("contact.opportunities", "Open to freelance & full-time opportunities")}</p>
              </div>
            </motion.div>

            {/* Direct contact details */}
            {contactDetails.length > 0 && (
              <div className="space-y-3">
                {contactDetails.map((c, i) => {
                  const body = (
                    <>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.06] text-gold transition-colors group-hover:text-gold">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</span>
                        <span className="block truncate font-semibold">{c.value}</span>
                      </span>
                      {c.href && <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />}
                    </>
                  );
                  const cls = "group flex items-center gap-4 rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm transition-colors hover:border-gold/40";
                  return (
                    <motion.div key={c.label} initial={{ opacity:0, y:10 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.45 + i*0.08 }}>
                      {c.href
                        ? <a href={c.href} onClick={() => void trackAnalyticsEvent(`${c.label.toLowerCase()}_click`)} className={cls}>{body}</a>
                        : <div className={cls}>{body}</div>}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Social links section */}
            {socialLinks.length > 0 && (
            <div>
              <motion.div initial={{ opacity:0 }} animate={isInView ? { opacity:1 } : {}} transition={{ delay:0.6 }}
                className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
                <Badge variant="outline" className="text-xs border-gold/30 text-gold px-3">{t("contact.connectWithMe", "Connect With Me")}</Badge>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((s, i) => (
                  <motion.a key={s.label} href={s.href} onClick={() => void trackAnalyticsEvent(`${s.label.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_click`)} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity:0, scale:0.85, y:10 }}
                    animate={isInView ? { opacity:1, scale:1, y:0 } : {}}
                    transition={{ delay:0.65+i*0.08, type:"spring", bounce:0.4 }}
                    whileHover={{ y:-4, boxShadow:`0 16px 40px ${rgba(s.color, 0.25)}` }}
                    whileTap={{ scale:0.96 }}
                    style={{ borderColor: rgba(s.color, 0.25), background: rgba(s.color, 0.07) }}
                    className="relative group flex items-center gap-3 p-4 rounded-2xl border glass-card overflow-hidden transition-all duration-300"
                  >
                    {/* Top gradient bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                      style={{ background: `linear-gradient(to right, transparent, ${s.color}, transparent)` }} />
                    {/* Glow orb on hover */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-400"
                      style={{ background: s.color }} />

                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate:8, scale:1.1 }}
                      transition={{ type:"spring", bounce:0.5 }}
                      style={{ background: `linear-gradient(135deg, ${s.color}, ${rgba(s.color, 0.55)})` }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                    >
                      <s.icon className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <p className="font-bold text-sm" style={{ color: s.color }}>{s.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.sub}</p>
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                      style={{ color: s.color }} />
                  </motion.a>
                ))}
              </div>
            </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
