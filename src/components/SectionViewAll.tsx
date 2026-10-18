import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUiText } from "@/lib/localization";

const SectionViewAll = ({ to }: { to: string }) => {
  const t = useUiText();
  const location = useLocation();

  if (location.pathname !== "/") return null;

  return (
    <div className="mt-10 flex justify-center">
      <Button asChild variant="outline" className="gap-2 rounded-full border-primary/40 px-6 hover:bg-primary/10">
        <Link to={to}>
          {t("common.viewAll", "View all")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default SectionViewAll;
