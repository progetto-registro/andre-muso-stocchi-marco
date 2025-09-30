import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { LoadingSystem } from "./shared/loading/LoadingSystem";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <LoadingSystem>
          <App/>
        </LoadingSystem>
      </LocalizationProvider>
  </BrowserRouter>
);
