import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { ContactSkeleton } from "@/components/Skeletons";

const ContactPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <PageLoader skeleton={<ContactSkeleton />}>
      <Contact />
      <Footer />
    </PageLoader>
  </div>
);

export default ContactPage;
