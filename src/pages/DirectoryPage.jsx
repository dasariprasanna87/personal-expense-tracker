import { useState, useEffect } from "react";

// 📥 Destructure team, setTeam, and isLoading directly from incoming parent props
const DirectoryPage = ({ team, setTeam, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ⌨️ Keyboard Escape key listener: Manages closing the modal layout smoothly
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedMember(null);
      }
    };
    if (selectedMember) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMember]);

  // ➕ Form submission handler: Adds new custom team members to root state array
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newName || !newTitle) return;

    const nameParts = newName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Member";

    const newEmployee = {
      id: Date.now(),
      firstName,
      lastName,
      company: {
        title: newTitle,
        name: "My Dashboard App Corp",
      },
      image: "placeholder-triggered", // Triggers local SVG fallback inside modal
    };

    setTeam([newEmployee, ...team]); // prepends new employee at the top of the array
    setNewName("");
    setNewTitle("");
    setIsFormOpen(false);
  };

  // 🗑️ Animated Card Deletion handler with event propagation block controls
  const handleDeleteEmployee = (idToDelete, e) => {
    e.stopPropagation(); // Stops main card click popup action from triggering

    setTeam(
      team.map((member) =>
        member.id === idToDelete ? { ...member, isDeleting: true } : member,
      ),
    );

    setTimeout(() => {
      setTeam((prevTeam) =>
        prevTeam.filter((member) => member.id !== idToDelete),
      );
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto text-center px-4 py-6">
      {/* Page Typography Headings */}
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">
        Dynamic Company Directory
      </h1>
      <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-8 transition-colors">
        Fetched live via external REST API endpoints from DummyJSON
      </p>

      {/* Real-time search filter input field box container */}
      <div className="mb-6">
        <input
          className="px-4 py-2.5 w-full max-w-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
          type="text"
          placeholder="Search team members by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Employee Form panel control block layout section */}
      <div className="mb-6 max-w-md mx-auto text-right">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
        >
          {isFormOpen ? "✕ Close Form" : "➕ Add New Team Member"}
        </button>

        {isFormOpen && (
          <form
            onSubmit={handleAddEmployee}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left mt-4 transition-all duration-300"
          >
            <div className="mb-3.5">
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Corporate Title / Role
              </label>
              <input
                type="text"
                placeholder="Lead Architect, Specialist"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-sm transition"
            >
              Save Employee Profile
            </button>
          </form>
        )}
      </div>

      {/* Grid container formatting live mapping arrays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {isLoading
          ? // 📊 Pulse shimmer skeletons fallbacks displayed while data transfers
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-pulse bg-white border border-gray-100 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-sm rounded-2xl p-6 text-left"
              >
                <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-100 dark:bg-slate-800/60 rounded-full w-1/2"></div>
              </div>
            ))
          : team
              .filter((member) =>
                `${member.firstName} ${member.lastName}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()),
              )
              .map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`relative bg-white border border-gray-100 dark:bg-slate-900/40 dark:border-slate-800/80 shadow-sm rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer origin-center overflow-hidden
                  ${
                    member.isDeleting
                      ? "opacity-0 scale-90 max-h-0 py-0 my-0 border-0 pointer-events-none"
                      : "opacity-100 scale-100 max-h-48"
                  }`}
                >
                  {/* ✕ Action Delete Button row item */}
                  <button
                    onClick={(e) => handleDeleteEmployee(member.id, e)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 font-bold transition text-sm p-1 rounded-md cursor-pointer active:scale-90 z-10"
                    title="Remove Employee"
                  >
                    ✕
                  </button>

                  <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-2 pr-6 transition-colors">
                    Welcome, {member.firstName} {member.lastName}!
                  </h2>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50 px-3 py-1.5 rounded-full inline-block transition-colors">
                    {member.company.title}
                  </span>
                </div>
              ))}
      </div>

      {/* Profile Detail overlay Modal Window Container */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedMember(null)}
          ></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-800 text-center transition-all scale-100">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold cursor-pointer text-lg p-1"
            >
              ✕
            </button>

            {/* Avatar block with structural logic fallback check */}
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
              {selectedMember.image &&
              !selectedMember.image.includes("placeholder-triggered") ? (
                <img
                  src={selectedMember.image}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-10 h-10 text-blue-500 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://w3.org"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {selectedMember.firstName} {selectedMember.lastName}
            </h3>
            <p className="text-sm font-semibold text-blue-600 dark:text-yellow-300 mb-4">
              {selectedMember.company.title}
            </p>

            {/* Rich Detail Contact Row Sections */}
            <div className="space-y-2.5 text-left border-t border-gray-100 dark:border-slate-800 pt-4 mt-2">
              <div className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                Contact Information
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                📧{" "}
                <span className="font-medium ml-1">{selectedMember.email}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                📞{" "}
                <span className="font-medium ml-1">{selectedMember.phone}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                🏢{" "}
                <span className="font-medium ml-1">
                  {selectedMember.company.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
