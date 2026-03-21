import React, { createContext, useContext } from 'react';
import type { BrandTheme } from './brands';
import { economistTheme } from './brands';

const ThemeContext = createContext<BrandTheme>(economistTheme);

export const ThemeProvider: React.FC<{
  theme: BrandTheme;
  children: React.ReactNode;
}> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
