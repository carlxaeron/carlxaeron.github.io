import React, { useEffect, useState } from 'react';
import { ThemeContext } from './theme-context';
import { create } from 'zustand';

const defaultEnv = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'dev' : 'prod';
const useStore = create((set) => ({
  value: {
    env: defaultEnv,
    isMobile: false,
  },
  setValue: (newState) => set((state) => ({ value: {...state.value, ...newState} })),
}))

function ThemeProvider({ children }) {
  const defaultEnv = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'dev' : 'prod';

  const [value, setValue] = useState({
    env: defaultEnv,
  });

  return (
    <ThemeContext.Provider 
      value={{value, setValue}}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
export { useStore, ThemeProvider };