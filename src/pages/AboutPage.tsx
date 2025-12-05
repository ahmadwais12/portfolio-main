import About from "@/components/About";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <About />
      <Footer />
    </div>
  );
};

export default AboutPage;