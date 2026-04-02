import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar, Code, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAbout } from "@/lib/store";
import profile from '../../public/profile.jpg';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const data = getAbout();

  const stats = [
    { icon: Calendar, label: "Years Experience", value: data.years_experience },
    { icon: Code, label: "Projects Completed", value: data.projects_completed },
    { icon: Award, label: "Technologies", value: data.technologies },
    { icon: MapPin, label: "Location", value: data.location },
  ];

  return (
    <section id="about" className="py-20 bg-background relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate developer with expertise in building modern web and mobile applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto group">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-30 animate-glow" />
              <div className="absolute inset-0 bg-gradient-secondary rounded-2xl blur-2xl opacity-20 animate-pulse-slow" />
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-primary/20 shadow-glow-lg glass-card group-hover:border-primary/40 transition-all duration-500 hover-lift">
                <img src={profile} alt={data.full_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="absolute -top-3 -right-3 w-24 h-24 border-t-4 border-r-4 border-primary/30 rounded-tr-2xl" />
              <div className="absolute -bottom-3 -left-3 w-24 h-24 border-b-4 border-l-4 border-secondary/30 rounded-bl-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-primary bg-clip-text text-transparent">{data.title}</span>
              </h3>
              {data.bio.split('\n\n').map((para, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mt-4 first:mt-0">{para}</p>
              ))}
              <div className="mt-4 space-y-2">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Email:</span> {data.email}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Phone:</span> {data.phone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="p-6 glass-card hover:border-primary/50 transition-all hover-lift group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <stat.icon className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-3xl font-bold mb-1 text-gradient">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
