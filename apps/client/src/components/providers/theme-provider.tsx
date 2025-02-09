import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import React from "react";

export enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}
type ThemeProviderProps = {
  children: React.ReactNode;
};

const themeAtom = atomWithStorage<{ user: Theme; system: Theme }>("theme", {
  user: Theme.System,
  system: Theme.Light,
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeState, setThemeState] = useAtom(themeAtom);

  const appliedTheme = React.useMemo(
    () =>
      themeState.user === Theme.System ? themeState.system : themeState.user,
    [themeState],
  );

  React.useEffect(() => {
    const root = document.documentElement; // Use only the <html> element
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setThemeState((prev) => {
        const systemTheme = e.matches ? Theme.Dark : Theme.Light;
        const userTheme =
          prev.user === Theme.System && !localStorage.getItem("theme")
            ? systemTheme
            : prev.user;
        return { user: userTheme, system: systemTheme };
      });
    };

    // Initialize system and user themes
    updateSystemTheme(mediaQuery);

    // Apply the theme using className only
    root.className = appliedTheme;

    // Add event listener for system theme changes
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => {
      // Cleanup
      mediaQuery.removeEventListener("change", updateSystemTheme);
      root.className = "";
    };
  }, [appliedTheme, setThemeState]);

  return <>{children}</>;
};

export const useTheme = () => {
  const [themeState, setThemeState] = useAtom(themeAtom);

  const theme = React.useMemo(
    () => ({
      theme: themeState.user,
      system: themeState.system,
      setTheme: (user: Theme) => {
        setThemeState((prev) => ({ ...prev, user }));
      },
    }),
    [themeState, setThemeState],
  );

  return theme;
};
