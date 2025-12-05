import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import profile from '../../public/profile.jpg';

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20">
      {/* Enhanced Animated Background with Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="absolute w-[700px] h-[700px] bg-primary/30 rounded-full blur-[150px] -top-40 -left-40 animate-float" />
        <div className="absolute w-[800px] h-[800px] bg-secondary/25 rounded-full blur-[150px] -bottom-40 -right-40 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />
        
        {/* Animated particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-bounce-slow" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-secondary rounded-full animate-bounce-slow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-accent rounded-full animate-bounce-slow" style={{ animationDelay: "2.5s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="order-2 md:order-1"
          >
            <div className="relative w-full max-w-md mx-auto aspect-square group">
              {/* Multi-layered glow effect */}
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-3xl opacity-40 animate-glow" />
              <div className="absolute inset-0 bg-gradient-secondary rounded-full blur-2xl opacity-30 animate-pulse-slow" />
              
              {/* Rotating border effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-50 animate-spin-slow" style={{ padding: "4px" }}>
                <div className="w-full h-full rounded-full bg-background" />
              </div>
              
              {/* Image container with glass effect */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/30 shadow-glow-lg glass-card group-hover:border-primary/50 transition-all duration-500">
                <img
                src={profile}
                  //src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"
                  alt="Ahmad Wais Sarwari"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-bounce-slow" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-bounce-slow" style={{ animationDelay: "1s" }} />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Hi, I'm{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Ahmad Wais
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl text-muted-foreground mb-6"
            >
              <motion.span
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="bg-gradient-to-r from-primary via-secondary via-accent to-primary bg-[length:300%_auto] bg-clip-text text-transparent font-bold"
              >
                Full Stack Web & Mobile App Developer
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base md:text-lg text-muted-foreground mb-8"
            >
              Crafting beautiful web experiences with MERN Stack and building powerful mobile apps with Flutter
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start mb-8"
            >
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-all text-primary-foreground shadow-glow-lg group relative overflow-hidden"
                onClick={() => scrollToSection("projects")}
              >
                <span className="relative z-10 group-hover:scale-110 transition-transform inline-block">
                  View My Work
                </span>
                <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10 group relative overflow-hidden glass-card"
                onClick={() => scrollToSection("contact")}
              >
                <span className="relative z-10 group-hover:scale-110 transition-transform inline-block">
                  Contact Me
                </span>
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex gap-4 justify-center md:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.15, rotate: 5, y: -5 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full glass-card hover:shadow-glow transition-all group relative overflow-hidden"
              >
                <Github className="w-6 h-6 relative z-10 group-hover:text-primary transition-colors" />
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, rotate: -5, y: -5 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full glass-card hover:shadow-glow transition-all group relative overflow-hidden"
              >
                <Linkedin className="w-6 h-6 relative z-10 group-hover:text-primary transition-colors" />
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, rotate: 5, y: -5 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:ahmadwaissarwari@gmail.com"
                className="p-4 rounded-full glass-card hover:shadow-glow transition-all group relative overflow-hidden"
              >
                <Mail className="w-6 h-6 relative z-10 group-hover:text-accent transition-colors" />
                <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => scrollToSection("about")}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-sm text-muted-foreground">Scroll Down</span>
          <ArrowDown className="w-6 h-6 text-primary animate-glow" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
