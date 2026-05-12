import React, { useState } from 'react';
import { ThemeContext } from './theme-context';
import { create } from 'zustand';
import sessionstorage from 'sessionstorage';

const defaultEnv = 'prod';
const doneTimer = sessionstorage.getItem('done') || false;
const modalDefault = {
  show: false,
  title: '',
  body: '',
  footer: '',
  config: {},
};
const useStore = create((set) => ({
  value: {
    env: defaultEnv,
    isMobile: (window?.innerWidth <= 768) || false,
    width: window?.innerWidth || 0,
    modal: modalDefault,
    done: doneTimer && doneTimer > new Date().getTime(),
  },
  setValue: (newState) => set((state) => {
    if (state.value.modal.show === true && newState.modal.show === false) {
      const newValue = { value: {...state.value, ...newState, modal: modalDefault } } 
      return newValue;
    }

    return { value: {...state.value, ...newState} } 
  }),
}))

function ThemeProvider({ children }) {
  const [value, setValue] = useState({
    env: 'prod',
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