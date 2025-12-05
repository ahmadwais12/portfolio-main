import { motion } from "framer-motion";
import { Code, Palette, Smartphone, Database, Globe, Shield } from "lucide-react";

const services = [
  {
    id: 1,
    icon: <Code className="w-8 h-8" />,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies like React, Node.js, and MongoDB."
  },
  {
    id: 2,
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile Apps",
    description: "Cross-platform mobile applications developed with Flutter for both iOS and Android platforms."
  },
  {
    id: 3,
    icon: <Palette className="w-8 h-8" />,
    title: "UI/UX Design",
    description: "Beautiful and intuitive user interfaces designed with user experience principles in mind."
  },
  {
    id: 4,
    icon: <Database className="w-8 h-8" />,
    title: "Database Design",
    description: "Efficient database architectures using SQL and NoSQL solutions tailored to your needs."
  },
  {
    id: 5,
    icon: <Globe className="w-8 h-8" />,
    title: "SEO Optimization",
    description: "Improve your website's visibility on search engines and drive more organic traffic."
  },
  {
    id: 6,
    icon: <Shield className="w-8 h-8" />,
    title: "Security Auditing",
    description: "Comprehensive security assessments to protect your digital assets from vulnerabilities."
  }
];

const Services = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">My Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I offer a wide range of services to help your business thrive in the digital world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: service.id * 0.1 }}
              className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow"
            >
              <div className="text-primary mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;