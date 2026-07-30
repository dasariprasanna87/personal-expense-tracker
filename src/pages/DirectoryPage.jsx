import { useState, useEffect } from "react";

const DirectoryPage = () => {
  const [team, setTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // ⏳ 1. Add a loading state flag tracker (starts as true)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Ensure loading is true when the fetch starts
    // Fetch live corporate users from the external REST API endpoint
    fetch("https://dummyjson.com/users")
      .then((response) => response.json())
      .then((data) => {
        // Take the first 4 profiles to populate our grid
        setTeam(data.users.slice(0, 4));
        setIsLoading(false); // 🔥 2. Turn off loader once data arrives safely!
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Turn off loader even if the network fails
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center px-4 py-6">
      {/* 📝 Main Heading */}
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">
        Dynamic Company Directory
      </h1>
      {/* 📝 Subtitle description text */}
      <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-8 transition-colors">
        Fetched live via external REST API endpoints from DummyJSON
      </p>

      {/* Real-time search filter text input */}
      <div className="mb-6">
        <input
          className="px-4 py-2.5 w-full max-w-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
          type="text"
          placeholder="Search team members by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {/* ⚡ 3. CONDITIONAL RENDER: Show Skeleton pulses if loading, else show real data */}
        {isLoading
          ? // Generate an array of 4 empty slots to render 4 pulsing skeleton cards
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-pulse bg-white border border-gray-100 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-sm rounded-2xl p-6 text-left"
              >
                {/* Pulsing Placeholder line for Employee Name */}
                <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4 mb-4"></div>
                {/* Pulsing Placeholder block for Company Title Badge */}
                <div className="h-6 bg-gray-100 dark:bg-slate-800/60 rounded-full w-1/2"></div>
              </div>
            ))
          : // Render actual active data once it finishes transferring
            team
              .filter((member) =>
                `${member.firstName} ${member.lastName}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()),
              )
              .map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-gray-100 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-sm rounded-2xl p-6 text-left transition duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-2 transition-colors">
                    Welcome, {member.firstName} {member.lastName}!
                  </h2>
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
