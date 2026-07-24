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
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
        Dynamic Company Directory
      </h1>
      <p className="text-sm font-medium text-gray-500 mb-8">
        Fetched live via external REST API endpoints from DummyJSON
      </p>

      {/* Real-time search filter text input */}
      <div className="mb-6">
        <input
          className="px-4 py-2.5 w-full max-w-md border border-gray-200 rounded-xl"
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
            <div
              key={member.id}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 text-left transition duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <h2>
                Welcome, {member.firstName} {member.lastName}!
              </h2>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-block">
                {member.company.title}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DirectoryPage;
