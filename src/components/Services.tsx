import { motion } from "framer-motion";
import { Code, Palette, Smartphone, Database, Globe, Shield } from "lucide-react";
import { getServices } from "@/lib/store";

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-8 h-8" />,
  Smartphone: <Smartphone className="w-8 h-8" />,
  Palette: <Palette className="w-8 h-8" />,
  Database: <Database className="w-8 h-8" />,
  Globe: <Globe className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
};

const Services = () => {
  const services = getServices();

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
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow"
            >
              <div className="text-primary mb-4">{iconMap[service.icon] ?? <Code className="w-8 h-8" />}</div>
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
