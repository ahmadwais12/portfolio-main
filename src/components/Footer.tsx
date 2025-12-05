import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUp, Github, Linkedin, Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/ahmadwais",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/ahmadwais",
      label: "LinkedIn",
    },
    {
      icon: FaWhatsapp,
      href: "https://wa.me/93776415307",
      label: "WhatsApp",
    },
    {
      icon: Mail,
      href: "mailto:ahmadwaissarwari@gmail.com",
      label: "Email",
    },
    {
      icon: Phone,
      href: "tel:+93776415307",
      label: "Phone",
    },
  ];

  return (
    <footer className="relative py-12 bg-gradient-hero border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex gap-4 flex-wrap justify-center"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-3 rounded-full bg-card/50 backdrop-blur-sm border border-border hover:bg-gradient-primary hover:border-primary transition-all group"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 group-hover:text-primary-foreground transition-colors" />
              </motion.a>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <p className="text-muted-foreground">
              © 2025 <span className="font-semibold bg-gradient-primary bg-clip-text text-transparent">Ahmad Wais Sarwari</span>. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Crafted with passion using React, Tailwind CSS, and Framer Motion
            </p>
          </motion.div>

          {/* Scroll to Top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              onClick={scrollToTop}
              className="rounded-full bg-gradient-primary hover:opacity-90 shadow-glow group"
              size="icon"
            >
              <ArrowUp className="w-5 h-5 group-hover:animate-bounce" />
            </Button>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
