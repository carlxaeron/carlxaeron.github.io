import React, { useState } from 'react';
import { ThemeContext } from './theme-context';

function ThemeProvider({ children }) {
  const defaultEnv = 'dev';

  const [value, setValue] = useState({
    env: defaultEnv,
  });

  return (
    <ThemeContext.Provider value={{value, setValue}}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;