import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  capturePortalParamsFromUrl,
  checkSubscriptionStatus,
  getStoredSubid,
  redirectToCampaign,
} from "../lib/subscriptionApi";

/**
 * On content pages: run status check.
 * If subid is present and user is not subscribed → campaign redirect.
 * subid=0 (first visit / browse) stays on portal so phone popup can run.
 */
export function ContentStatusGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      capturePortalParamsFromUrl();
      const subid = getStoredSubid();
      // Account page stays available for Subscribe / Unsubscribe actions
      if (location.pathname.startsWith("/account")) return;

      try {
        const result = await checkSubscriptionStatus();
        if (cancelled) return;
        // Returning subscriber with inactive status → campaign
        if (subid !== "0" && !result.active) {
          redirectToCampaign(subid);
        }
      } catch {
        // Keep portal usable if status API is temporarily down
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search]);

  return <>{children}</>;
}
