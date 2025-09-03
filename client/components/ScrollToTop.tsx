import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Always reset scroll to top on route changes
    // If you specifically want to honor hash anchors in the future, handle them here
    if (hash) {
      // Optionally scroll to element if exists, else to top
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "auto" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
