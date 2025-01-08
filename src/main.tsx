import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { HamburgerProvider } from "./context/HamburgerContext.tsx";
import { StyledEngineProvider } from '@mui/material/styles';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    primary: {
      main: "rgba(43, 155, 237, 1)", // Set your primary color here
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <Router>
          <StyledEngineProvider injectFirst>
            <HamburgerProvider>
              <App />
            </HamburgerProvider>
          </StyledEngineProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
