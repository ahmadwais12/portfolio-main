import { useState, useEffect, ReactNode } from "react";
import { usePortfolio } from "@/lib/store";

interface PageLoaderProps {
  skeleton: ReactNode;
  children: ReactNode;
  delay?: number;
}

const PageLoader = ({ skeleton, children, delay = 800 }: PageLoaderProps) => {
  const [waiting, setWaiting] = useState(true);
  const { status } = usePortfolio();

  useEffect(() => {
    const t = setTimeout(() => setWaiting(false), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const contentPending = status === "idle" || status === "loading";
  return waiting || contentPending ? <>{skeleton}</> : <>{children}</>;
};

export default PageLoader;
