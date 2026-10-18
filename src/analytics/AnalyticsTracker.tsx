import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/analytics/tracker";

export default function AnalyticsTracker() {
  const location = useLocation();
  const lastRoute = useRef("");
  useEffect(() => {
    const route = location.pathname;
    if (lastRoute.current === route) return;
    lastRoute.current = route;
    void trackPageView(route);
  }, [location.pathname]);
  return null;
}
