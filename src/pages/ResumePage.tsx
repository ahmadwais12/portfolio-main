import Navbar from "@/components/Navbar";
import Resume from "@/components/Resume";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { ResumeSkeleton } from "@/components/Skeletons";

const ResumePage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLoader skeleton={<ResumeSkeleton />}>
      <Resume />
      <Footer />
    </PageLoader>
  </div>
);

export default ResumePage;
