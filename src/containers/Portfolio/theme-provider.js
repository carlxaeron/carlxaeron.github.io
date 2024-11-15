import React, { useEffect, useState } from 'react';
import { ThemeContext } from './theme-context';
import { create } from 'zustand';
import sessionstorage from 'sessionstorage';

const defaultEnv = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'dev' : 'prod';
const doneTimer = sessionstorage.getItem('done') || false;
const useStore = create((set) => ({
  value: {
    env: defaultEnv,
    isMobile: (window?.innerWidth <= 768) || false,
    modal: {
      show: false,
      title: '',
      body: '',
      footer: '',
    },
    done: doneTimer && doneTimer > new Date().getTime(),
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