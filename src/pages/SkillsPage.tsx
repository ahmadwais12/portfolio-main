import Navbar from "@/components/Navbar";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { SkillsSkeleton } from "@/components/Skeletons";

const SkillsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLoader skeleton={<SkillsSkeleton />}>
      <Skills />
      <Footer />
    </PageLoader>
  </div>
);

export default SkillsPage;
