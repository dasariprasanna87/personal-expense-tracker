import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { DashboardProvider } from "./context/DashboardContext.jsx";
// 📥 1. Import TanStack Query components
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ⚡ 2. Instantiate a fresh QueryClient cache bucket instance
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 🌟 3. Wrap everything inside the QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
