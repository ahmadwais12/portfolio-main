import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { HeroSkeleton, AboutSkeleton, SkillsSkeleton, ProjectsSkeleton, ResumeSkeleton, ContactSkeleton } from "@/components/Skeletons";

const IndexSkeleton = () => (
  <>
    <HeroSkeleton />
    <AboutSkeleton />
    <SkillsSkeleton />
    <ProjectsSkeleton />
    <ResumeSkeleton />
    <ContactSkeleton />
  </>
);

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLoader skeleton={<IndexSkeleton />}>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Resume />
      <Contact />
      <Footer />
    </PageLoader>
  </div>
);

export default Index;
