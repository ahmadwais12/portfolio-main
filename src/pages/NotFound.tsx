import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/PageLoader";
import { Skeleton } from "@/components/ui/skeleton";

const NotFoundSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-6">
      <Skeleton className="h-40 w-64 mx-auto rounded-2xl" />
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-5 w-72 mx-auto" />
      <div className="flex gap-3 justify-center">
        <Skeleton className="h-11 w-32 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>
    </div>
  </div>
);

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageLoader skeleton={<NotFoundSkeleton />} delay={400}>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.07, 0.04] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-violet-500 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative z-10 text-center">
          {/* 404 number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="mb-6"
          >
            <span className="text-[10rem] font-black leading-none bg-gradient-to-r from-cyan-400 via-primary to-violet-500 bg-clip-text text-transparent select-none">
              404
            </span>
          </motion.div>

          {/* Animated underline */}
          <motion.div
            className="h-1 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full mx-auto mb-8"
            initial={{ scaleX: 0, width: "0%" }}
            animate={{ scaleX: 1, width: "60%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold mb-3"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg mb-8 max-w-md mx-auto"
          >
            The page{" "}
            <span className="text-primary font-mono text-sm bg-primary/10 px-2 py-0.5 rounded">
              {location.pathname}
            </span>{" "}
            doesn't exist or has been moved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3 justify-center flex-wrap"
          >
            <Link to="/">
              <Button className="gap-2 bg-gradient-primary hover:opacity-90 shadow-glow">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()} className="gap-2 border-primary/30 hover:border-primary/60 hover:bg-primary/5">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </motion.div>
        </div>
      </div>
    </PageLoader>
  );
};

export default NotFound;
