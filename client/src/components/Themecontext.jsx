import React from 'react';

const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const storedMode = localStorage.getItem('themeMode') || 'light';
  const [mode, setMode] = React.useState(storedMode);

  React.useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);
