import { useState, useEffect } from "react";

const DirectoryPage = () => {
  const [team, setTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch live corporate users from the external REST API endpoint
    fetch("https://dummyjson.com/users")
      .then((response) => response.json())
      .then((data) => {
        // Take the first 4 profiles to populate our grid
        setTeam(data.users.slice(0, 4));
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center px-4 py-6">
      {/* 📝 Main Heading: Added dark:text-white */}
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">
        Dynamic Company Directory
      </h1>
      {/* 📝 Subtitle description text: Added dark:text-slate-400 */}
      <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-8 transition-colors">
        Fetched live via external REST API endpoints from DummyJSON
      </p>

      {/* Real-time search filter text input */}
      <div className="mb-6">
        {/* 🔍 Search Input Field: Added active ring states and border highlight variables */}
        <input
          className="px-4 py-2.5 w-full max-w-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
          type="text"
          placeholder="Search team members by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid container mapping our active user state arrays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {team
          .filter((member) =>
            `${member.firstName} ${member.lastName}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
          )
          .map((member) => (
            /* 🔲 Profile Cards: Changed to dark:bg-slate-900/40 for crisp separation against slate-950 layouts */
            <div
              key={member.id}
              className="bg-white border border-gray-100 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-sm rounded-2xl p-6 text-left transition duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              {/* 👤 Employee Name Text: Added text-gray-900 dark:text-white and font styling */}
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-2 transition-colors">
                Welcome, {member.firstName} {member.lastName}!
              </h2>
              {/* 🏷️ Badge Tag Element: Configured to look clean and legible on dark canvases */}
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50 px-3 py-1.5 rounded-full inline-block transition-colors">
                {member.company.title}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DirectoryPage;
