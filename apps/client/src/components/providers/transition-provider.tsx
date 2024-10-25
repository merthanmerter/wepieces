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

  const previousPath = React.useRef<ParsedLocation>(state.location);

  React.useEffect(() => {
    const unsubscribeStart = subscribe("onBeforeLoad", ({ toLocation }) => {
      if (previousPath.current.pathname !== toLocation.pathname) {
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
  }, [state, subscribe]);

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
