import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import TrackerPage from "./pages/TrackerPage";
import DirectoryPage from "./pages/DirectoryPage";

const App = () => {
  return (
    // 🔥 2. Router wraps everything cleanly, removing complex subfolder parameters completely!
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* 🧭 Navigation Menu Bar Header */}
        <nav className="bg-slate-900 p-4 shadow-md rounded-b-xl">
          <div className="max-w-xl mx-auto flex justify-between items-center">
            {/* Our styled brand title text */}
            <span className="font-bold text-yellow-300 text-xl">
              My Dashboard App
            </span>

            {/* 🔀 Pure, Clear Navigation Link Strings */}
            <div className="flex gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-300 hover:text-yellow-300 transition"
              >
                💰 Expenses
              </Link>
              <Link
                to="/directory"
                className="text-sm font-medium text-gray-300 hover:text-yellow-300 transition"
              >
                👥 Employees
              </Link>
            </div>
          </div>
        </nav>

        {/* 🗺️ Master Switch Board panel mapping views */}
        <div className="py-6">
          <Routes>
            <Route path="/" element={<TrackerPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
