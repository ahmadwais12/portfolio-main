import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Briefcase, GraduationCap, Award } from "lucide-react";

const Resume = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const timeline = [
    {
      type: "work",
      icon: Briefcase,
      title: "Senior Full Stack Developer",
      organization: "Tech Solutions Inc.",
      period: "2022 - Present",
      description: "Leading development of enterprise web applications using MERN stack. Mentoring junior developers and implementing best practices.",
    },
    {
      type: "work",
      icon: Briefcase,
      title: "Mobile App Developer",
      organization: "AppCraft Studios",
      period: "2020 - 2022",
      description: "Developed and deployed 15+ mobile applications using Flutter. Collaborated with design team to create intuitive user experiences.",
    },
    {
      type: "education",
      icon: GraduationCap,
      title: "Bachelor's in Computer Science",
      organization: "University of Technology",
      period: "2016 - 2020",
      description: "Graduated with honors. Specialized in Software Engineering and Mobile Development.",
    },
    {
      type: "certification",
      icon: Award,
      title: "AWS Certified Developer",
      organization: "Amazon Web Services",
      period: "2021",
      description: "Certified in cloud architecture and serverless application development.",
    },
  ];

  return (
    <section id="resume" className="py-20 bg-muted/30 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Resume & <span className="bg-gradient-primary bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            My professional journey and achievements
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-gradient-primary hover:opacity-90 shadow-glow-lg group relative overflow-hidden">
              <Download className="w-4 h-4 mr-2 group-hover:animate-bounce-slow" />
              <span className="relative z-10">Download Resume</span>
              <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10 glass-card group relative overflow-hidden">
              <Download className="w-4 h-4 mr-2 group-hover:animate-bounce-slow" />
              <span className="relative z-10">Download CV</span>
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            </Button>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-20"
                >
                  {/* Icon */}
                  <div className="absolute left-4 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-lg group-hover:scale-125 transition-transform duration-300">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>

                  <Card className="p-6 glass-card hover:border-primary/50 transition-all hover-lift group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold group-hover:text-gradient transition-all">{item.title}</h3>
                      <span className="text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full backdrop-blur-sm">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-primary font-medium mb-2">{item.organization}</p>
                    <p className="text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
