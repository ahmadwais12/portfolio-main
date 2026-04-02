import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { AboutSkeleton } from "@/components/Skeletons";

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLoader skeleton={<AboutSkeleton />}>
      <About />
      <Footer />
    </PageLoader>
  </div>
);

export default AboutPage;
