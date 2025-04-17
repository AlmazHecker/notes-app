import { useEffect } from "react";

export const usePushStateListener = (callback: () => void) => {
  useEffect(() => {
    const originalPushState = history.pushState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event("pushstate"));
    };

    window.addEventListener("pushstate", callback);

    callback();

    return () => {
      history.pushState = originalPushState;
      window.removeEventListener("pushstate", callback);
    };
  }, []);
};
