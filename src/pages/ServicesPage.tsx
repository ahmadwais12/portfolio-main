import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { ServicesSkeleton } from "@/components/Skeletons";

const ServicesPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLoader skeleton={<ServicesSkeleton />}>
      <Services />
      <Footer />
    </PageLoader>
  </div>
);

export default ServicesPage;
