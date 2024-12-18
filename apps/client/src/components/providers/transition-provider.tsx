import { ParsedLocation, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import React from "react";

export default function TransitionProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { subscribe, state } = useRouter();
  const [key] = React.useState(state.location.state.key);
  const [transition, setTransition] = React.useState(false);

  /**
   * Or we can use pathChange flag
   * @see https://github.com/TanStack/router/discussions/2638#discussion-7364807
   */
  const previousPath = React.useRef<ParsedLocation>(state.location);
  const isRouteChanging = (location: ParsedLocation) =>
    previousPath.current.pathname !== location.pathname;

  React.useEffect(() => {
    const unsubscribeStart = subscribe("onBeforeLoad", ({ toLocation }) => {
      if (isRouteChanging(toLocation)) {
        setTransition(true);
        previousPath.current = toLocation;
      } else {
        setTransition(false);
      }
    });

    const unsubscribeResolved = subscribe("onResolved", () => {
      setTransition(false);
    });

    return () => {
      unsubscribeStart();
      unsubscribeResolved();
    };
  }, [previousPath, subscribe]);

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0 }}
      animate={{ opacity: transition ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className={className}>
      {children}
    </motion.div>
  );
}
