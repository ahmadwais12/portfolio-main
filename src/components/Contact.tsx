import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle, Sparkles, MessageSquare, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getAbout } from "@/lib/store";
import { toast } from "sonner";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const data = getAbout();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! I'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1000);
  };

  const contactInfo = [
    { icon: Mail,    label: "Email",    value: data.email,    href: `mailto:${data.email}`,   gradient: "from-cyan-500 to-blue-500",    glow: "rgba(6,182,212,0.2)" },
    { icon: Phone,   label: "Phone",    value: data.phone,    href: `tel:${data.phone}`,       gradient: "from-violet-500 to-purple-500", glow: "rgba(139,92,246,0.2)" },
    { icon: MapPin,  label: "Location", value: data.location, href: "#",                       gradient: "from-emerald-500 to-teal-500",  glow: "rgba(16,185,129,0.2)" },
  ];

  const socialLinks = [
    {
      icon: Github, label: "GitHub", sub: "View my code",
      href: data.social_links.github,
      gradient: "from-gray-600 to-gray-800",
      bg: "bg-gray-500/8", border: "border-gray-400/20", text: "text-gray-400",
      glow: "rgba(107,114,128,0.25)",
    },
    {
      icon: Linkedin, label: "LinkedIn", sub: "Connect with me",
      href: data.social_links.linkedin,
      gradient: "from-blue-500 to-blue-700",
      bg: "bg-blue-500/8", border: "border-blue-400/20", text: "text-blue-400",
      glow: "rgba(59,130,246,0.25)",
    },
    {
      icon: Twitter, label: "Twitter", sub: "Follow my updates",
      href: data.social_links.twitter,
      gradient: "from-sky-400 to-cyan-500",
      bg: "bg-sky-500/8", border: "border-sky-400/20", text: "text-sky-400",
      glow: "rgba(14,165,233,0.25)",
    },
    {
      icon: MessageCircle, label: "WhatsApp", sub: "Chat directly",
      href: data.social_links.whatsapp,
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-500/8", border: "border-green-400/20", text: "text-green-400",
      glow: "rgba(34,197,94,0.25)",
    },
  ];

  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden" id="contact" ref={ref}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale:[1,1.1,1], opacity:[0.03,0.07,0.03] }} transition={{ duration:9, repeat:Infinity }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[120px]" />
        <motion.div animate={{ scale:[1,1.15,1], opacity:[0.03,0.06,0.03] }} transition={{ duration:11, repeat:Infinity, delay:3 }}
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-violet-500 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity:0, y:30 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ duration:0.7 }} className="text-center mb-16">
          <motion.div initial={{ opacity:0, scale:0.5 }} animate={isInView ? { opacity:1, scale:1 } : {}} transition={{ duration:0.5, type:"spring", bounce:0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 text-primary text-sm font-semibold mb-6">
            <MessageSquare className="w-4 h-4" /> Let's Talk <Sparkles className="w-4 h-4" />
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Get In{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-400 via-primary to-violet-500 bg-clip-text text-transparent">Touch</span>
              <motion.div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                initial={{ scaleX:0 }} animate={isInView ? { scaleX:1 } : {}} transition={{ duration:0.8, delay:0.5 }} />
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a project in mind? Let's build something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* ── Contact Form ── */}
          <motion.div initial={{ opacity:0, x:-30 }} animate={isInView ? { opacity:1, x:0 } : {}} transition={{ duration:0.6, delay:0.2 }}>
            <div className="relative rounded-2xl p-8 glass-card border border-border/50 overflow-hidden">
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 to-violet-500" />
              {/* Glow orb */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-primary">
                  <Send className="w-4 h-4 text-white" />
                </div>
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name:"name",  label:"Name",  type:"text",  placeholder:"Your name" },
                    { name:"email", label:"Email", type:"email", placeholder:"your@email.com" },
                  ].map(f => (
                    <motion.div key={f.name} className="space-y-1.5"
                      animate={{ scale: focused === f.name ? 1.01 : 1 }} transition={{ duration:0.2 }}>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
                      <Input name={f.name} type={f.type} value={formData[f.name as keyof typeof formData]}
                        onChange={handleChange} required placeholder={f.placeholder}
                        onFocus={() => setFocused(f.name)} onBlur={() => setFocused(null)}
                        className={`glass-card border transition-all duration-300 ${focused===f.name ? "border-primary/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "border-border/50"}`} />
                    </motion.div>
                  ))}
                </div>

                <motion.div className="space-y-1.5" animate={{ scale: focused==="subject" ? 1.01 : 1 }} transition={{ duration:0.2 }}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject</label>
                  <Input name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can I help?"
                    onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)}
                    className={`glass-card border transition-all duration-300 ${focused==="subject" ? "border-primary/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "border-border/50"}`} />
                </motion.div>

                <motion.div className="space-y-1.5" animate={{ scale: focused==="message" ? 1.005 : 1 }} transition={{ duration:0.2 }}>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Message</label>
                  <Textarea name="message" value={formData.message} onChange={handleChange} required
                    placeholder="Tell me about your project..." rows={5}
                    onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                    className={`glass-card border resize-none transition-all duration-300 ${focused==="message" ? "border-primary/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "border-border/50"}`} />
                </motion.div>

                <motion.div whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}>
                  <Button type="submit" disabled={sending}
                    className="w-full h-12 bg-gradient-to-r from-cyan-500 to-primary hover:opacity-90 shadow-glow gap-2 font-semibold text-white text-base">
                    {sending ? (
                      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}>
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                    ) : <Send className="w-5 h-5" />}
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* ── Right column ── */}
          <motion.div initial={{ opacity:0, x:30 }} animate={isInView ? { opacity:1, x:0 } : {}} transition={{ duration:0.6, delay:0.3 }} className="space-y-6">

            {/* Availability badge */}
            <motion.div initial={{ opacity:0, y:10 }} animate={isInView ? { opacity:1, y:0 } : {}} transition={{ delay:0.4 }}
              className="flex items-center gap-3 p-4 glass-card rounded-2xl border border-green-400/20 bg-green-500/5">
              <motion.div className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0"
                animate={{ scale:[1,1.3,1], opacity:[1,0.6,1] }} transition={{ duration:2, repeat:Infinity }} />
              <div>
                <p className="font-semibold text-green-400 text-sm">Available for Work</p>
                <p className="text-xs text-muted-foreground">Open to freelance & full-time opportunities</p>
              </div>
            </motion.div>

            {/* Contact info cards */}
            <div className="space-y-3">
              {contactInfo.map((info, i) => (
                <motion.a key={i} href={info.href}
                  initial={{ opacity:0, x:20 }} animate={isInView ? { opacity:1, x:0 } : {}} transition={{ delay:0.45+i*0.1 }}
                  whileHover={{ x:4, boxShadow:`0 8px 30px ${info.glow}` }}
                  className="flex items-center gap-4 p-4 glass-card rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{info.label}</p>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{info.value}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300 flex-shrink-0" />
                </motion.a>
              ))}
            </div>

            {/* Social links section */}
            <div>
              <motion.div initial={{ opacity:0 }} animate={isInView ? { opacity:1 } : {}} transition={{ delay:0.6 }}
                className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/50" />
                <Badge variant="outline" className="text-xs border-primary/30 text-primary px-3">Connect With Me</Badge>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/50" />
              </motion.div>

              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((s, i) => (
                  <motion.a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    initial={{ opacity:0, scale:0.85, y:10 }}
                    animate={isInView ? { opacity:1, scale:1, y:0 } : {}}
                    transition={{ delay:0.65+i*0.08, type:"spring", bounce:0.4 }}
                    whileHover={{ y:-4, boxShadow:`0 16px 40px ${s.glow}` }}
                    whileTap={{ scale:0.96 }}
                    className={`relative group flex items-center gap-3 p-4 rounded-2xl border ${s.border} ${s.bg} glass-card overflow-hidden transition-all duration-300`}
                  >
                    {/* Top gradient bar */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.gradient} opacity-60`} />
                    {/* Glow orb on hover */}
                    <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-400`} />

                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate:8, scale:1.1 }}
                      transition={{ type:"spring", bounce:0.5 }}
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md flex-shrink-0`}
                    >
                      <s.icon className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <p className={`font-bold text-sm ${s.text}`}>{s.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.sub}</p>
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight className={`w-4 h-4 ${s.text} opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0`} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
