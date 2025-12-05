import Resume from "@/components/Resume";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ResumePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Resume />
      <Footer />
    </div>
  );
};

export default ResumePage;