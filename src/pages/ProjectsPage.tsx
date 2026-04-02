import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { ProjectsSkeleton } from "@/components/Skeletons";

const ProjectsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLoader skeleton={<ProjectsSkeleton />}>
      <Projects />
      <Footer />
    </PageLoader>
  </div>
);

export default ProjectsPage;
