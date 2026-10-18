import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import Resume from "@/components/Resume";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { HeroSkeleton, AboutSkeleton, SkillsSkeleton, ServicesSkeleton, ProjectsSkeleton, ResumeSkeleton, TestimonialsSkeleton, ContactSkeleton } from "@/components/Skeletons";

const IndexSkeleton = () => (
  <>
    <HeroSkeleton />
    <AboutSkeleton />
    <SkillsSkeleton />
    <ServicesSkeleton />
    <ProjectsSkeleton />
    <ResumeSkeleton />
    <TestimonialsSkeleton />
    <ContactSkeleton />
  </>
);

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLoader skeleton={<IndexSkeleton />}>
      <Hero />
      <About preview />
      <Skills />
      <Services />
      <Projects />
      <Resume />
      <Testimonials />
      <Contact />
      <Footer />
    </PageLoader>
  </div>
);

export default Index;
