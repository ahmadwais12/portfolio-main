import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUiText } from "@/lib/localization";

const SectionViewAll = ({ to }: { to: string }) => {
  const t = useUiText();
  const location = useLocation();

  if (location.pathname !== "/") return null;

  return (
    <div className="mt-12 flex justify-center">
      <Link
        to={to}
        className="group inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-card/60 px-6 text-sm font-semibold text-foreground/80 backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold"
      >
        {t("common.viewAll", "View all")}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
};

export default SectionViewAll;
