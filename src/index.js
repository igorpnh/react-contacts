import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthContextProvider from "./contexts/AuthContext";
import { ColorModeScript } from "@chakra-ui/react";
import theme from './theme'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
