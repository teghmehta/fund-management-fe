import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';
import App from "./routes/App";
import { createGlobalStyle } from 'styled-components';
import Send from "./routes/Send";
import globals from "./index.css";


const GlobalStyle = createGlobalStyle`${globals}`;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Send />} />
          </Route>
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);