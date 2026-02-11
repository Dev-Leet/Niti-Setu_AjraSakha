// import React, { useState, useEffect, ReactNode } from 'react';
// import { Theme, ThemeContext } from './ThemeContext';

// export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [theme, setTheme] = useState<Theme>(() => {
//     try {
//       const saved = localStorage.getItem('theme') as Theme | null;
//       return saved ?? 'light';
//     } catch {
//       return 'light';
//     }
//   });

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', theme);
//     try { localStorage.setItem('theme', theme); } catch (error) {
//       console.error('Failed to save theme to localStorage:', error);
//     }
//   }, [theme]);

//   const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

//   return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
// };

// export default ThemeProvider;
