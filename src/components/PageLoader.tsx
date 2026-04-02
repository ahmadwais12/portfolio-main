import { useState, useEffect, ReactNode } from "react";

interface PageLoaderProps {
  skeleton: ReactNode;
  children: ReactNode;
  delay?: number;
}

const PageLoader = ({ skeleton, children, delay = 800 }: PageLoaderProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return loading ? <>{skeleton}</> : <>{children}</>;
};

export default PageLoader;
