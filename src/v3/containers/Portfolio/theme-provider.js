import { useState, useEffect } from "react";
import { ThemeContext } from "./theme-context";
import { create } from "zustand";

const modalDefault = {
  show: false,
  title: "",
  body: null,
};

const useStore = create((set) => ({
  value: {
    env: "prod",
    isMobile: (typeof window !== "undefined" ? window.innerWidth <= 768 : false),
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    modal: modalDefault,
  },
  setValue: (newState) =>
    set((state) => ({
      value: {
        ...state.value,
        ...(typeof newState === "function" ? newState(state.value) : newState),
      },
    })),
}));

function ThemeProvider({ children }) {
  const [value, setValue] = useState({ env: "prod" });

  useEffect(() => {
    const updateSize = () => {
      useStore.setState((state) => ({
        value: {
          ...state.value,
          isMobile: window.innerWidth <= 768,
          width: window.innerWidth,
        },
      }));
    };

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <ThemeContext.Provider value={{ value, setValue }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { useStore, ThemeProvider };
