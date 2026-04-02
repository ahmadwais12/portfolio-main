import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { TestimonialsSkeleton } from "@/components/Skeletons";

const TestimonialsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLoader skeleton={<TestimonialsSkeleton />}>
      <Testimonials />
      <Footer />
    </PageLoader>
  </div>
);

export default TestimonialsPage;
