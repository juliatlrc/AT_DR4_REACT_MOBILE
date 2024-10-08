import React, { createContext, useState, useContext } from "react";
import {
  MD3DarkTheme as PaperDarkModeTheme,
  DefaultTheme as PaperLightModeTheme,
  Provider as PaperThemeProvider,
} from "react-native-paper";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components/native";

const AppThemeContext = createContext(undefined);

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeContextProvider");
  }
  return context;
};

const lightTheme = {
  ...PaperLightModeTheme,
  colors: {
    ...PaperLightModeTheme.colors,
    background: "#f3f4f6",
    primary: "#ff8a80",
  },
};

const darkTheme = {
  ...PaperDarkModeTheme,
  colors: {
    ...PaperDarkModeTheme.colors,
    background: "#000000",
    primary: "#6200ea",
  },
};

export const ThemeContextProvider = ({ children }) => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const switchTheme = () => {
    setDarkModeEnabled((prevMode) => !prevMode);
  };

  const activeTheme = darkModeEnabled ? darkTheme : lightTheme;

  return (
    <AppThemeContext.Provider
      value={{ switchTheme, darkModeEnabled, activeTheme }}
    >
      <PaperThemeProvider theme={activeTheme}>
        <StyledComponentsThemeProvider theme={activeTheme}>
          {children}
        </StyledComponentsThemeProvider>
      </PaperThemeProvider>
    </AppThemeContext.Provider>
  );
};
