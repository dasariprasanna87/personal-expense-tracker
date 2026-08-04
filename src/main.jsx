import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// 📥 Import the provider wrapper
import { DashboardProvider } from "./context/DashboardContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DashboardProvider>
      {" "}
      {/* 🌟 Wrap the root of the app */}
      <App />
    </DashboardProvider>
  </React.StrictMode>,
);
