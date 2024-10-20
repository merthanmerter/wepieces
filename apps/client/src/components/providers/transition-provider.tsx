import { useRouter } from "@tanstack/react-router";
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
  const [transition, set] = React.useState(false);

  React.useEffect(() => {
    const unsubscribeStart = subscribe("onBeforeLoad", (r) => {
      set(r.pathChanged);
    });

    const unsubscribeResolved = subscribe("onResolved", () => {
      set(false);
    });

    return () => {
      unsubscribeStart();
      unsubscribeResolved();
    };
  }, [state.location.state.key]);

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
