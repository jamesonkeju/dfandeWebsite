import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTrackVisitMutation } from "../api/analyticsApi";

const SESSION_KEY = "dfande_session_id";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "sess_anonymous";
  }
}

export function usePageTracker() {
  const location = useLocation();
  const [trackVisit] = useTrackVisitMutation();
  const startTimeRef = useRef<number>(Date.now());
  const currentPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    const sessionId = getSessionId();
    const path = location.pathname;
    const search = location.search;
    const referrer = document.referrer || undefined;

    // Record visit on public paths
    if (!path.startsWith("/admin")) {
      startTimeRef.current = Date.now();
      currentPathRef.current = path;

      trackVisit({
        sessionId,
        path,
        queryString: search || undefined,
        referrer,
        durationSeconds: 0,
      }).catch(() => {
        // Fire-and-forget, ignore errors
      });
    }

    // Cleanup / duration update on page leave
    return () => {
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (durationSeconds > 1 && !currentPathRef.current.startsWith("/admin")) {
        trackVisit({
          sessionId,
          path: currentPathRef.current,
          durationSeconds,
        }).catch(() => {});
      }
    };
  }, [location.pathname, location.search, trackVisit]);
}
