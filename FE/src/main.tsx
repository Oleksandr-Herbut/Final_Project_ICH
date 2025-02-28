import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
// import { ThemeProvider } from './services/ThemeContext.tsx';
import "./i18n";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <ThemeProvider> */}
    <Router>
      <Provider store={store}>     
        <App />     
      </Provider>
    </Router>
    {/* </ThemeProvider> */}
  </StrictMode>
);
