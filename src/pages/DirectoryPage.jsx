import { useState, useEffect } from "react";

const DirectoryPage = () => {
  const [team, setTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // 🌟 1. Track which employee card is clicked (null means modal is closed)
  const [selectedMember, setSelectedMember] = useState(null);
  // 1. Form tracking variables
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false); // Controls opening/closing the form

  useEffect(() => {
    setIsLoading(true);
    fetch("https://dummyjson.com/users")
      .then((response) => response.json())
      .then((data) => {
        setTeam(data.users.slice(0, 4));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);
  // ⌨️ Side Effect: Listen for the Escape key to close the modal automatically
  useEffect(() => {
    // 1. Define the handler function
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedMember(null);
      }
    };

    // 2. Only add the event listener if a modal is actually open
    if (selectedMember) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // 3. 🔥 THE CLEANUP FUNCTION: Removes the listener when the modal closes or unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMember]); // 🔄 Re-run this effect only when selectedMember changes
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newName || !newTitle) return;

    const nameParts = newName.trim().split(" ");
    // Using indexing directly to get clean, reliable string values
    const firstName = nameParts[0] || "New";
    const lastName = nameParts.slice(1).join(" ") || "Member";

    const newEmployee = {
      id: Date.now(),
      firstName: firstName,
      lastName: lastName,
      company: {
        title: newTitle,
        name: "My Dashboard App Corp",
      },
      // ⚡ BULLETPROOF FIX: A direct public URL that works anywhere without needing template variables!
      image: "https://dicebear.com",
    };

    setTeam([newEmployee, ...team]);
    setNewName("");
    setNewTitle("");
    setIsFormOpen(false);
  };
  const handleDeleteEmployee = (idToDelete, e) => {
    // ⚡ 1. Prevent the card's main onClick modal popup from opening when clicking delete
    e.stopPropagation();

    // ⚙️ 2. Mark the targeted item as "isDeleting: true" inside our state array
    setTeam(
      team.map((member) =>
        member.id === idToDelete ? { ...member, isDeleting: true } : member,
      ),
    );

    // ⏳ 3. Wait 300ms for the animation transition to finish executing
    setTimeout(() => {
      // 🗑️ 4. Filter it out of the array state once it is hidden
      setTeam((prevTeam) =>
        prevTeam.filter((member) => member.id !== idToDelete),
      );
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto text-center px-4 py-6">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">
        Dynamic Company Directory
      </h1>
      <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-8 transition-colors">
        Fetched live via external REST API endpoints from DummyJSON
      </p>

      {/* Real-time search filter */}
      <div className="mb-6">
        <input
          className="px-4 py-2.5 w-full max-w-md border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm"
          type="text"
          placeholder="Search team members by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* ➕ Add Employee Control Action Layout Block */}
      <div className="mb-6 max-w-md mx-auto text-right">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
        >
          {isFormOpen ? "✕ Close Form" : "➕ Add New Team Member"}
        </button>

        {/* Sliding Expandable Form Frame container panel box */}
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

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
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
                /* 🔲 Profile Cards: Added height reduction tracking variables matching ExpenseItem's setup */
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
                  {/* ✕ Action Delete Button: Positioned in top-right corner */}
                  <button
                    onClick={(e) => handleDeleteEmployee(member.id, e)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 font-bold transition text-sm p-1 rounded-md cursor-pointer active:scale-90 z-10"
                    title="Remove Employee"
                  >
                    ✕
                  </button>

                  {/* 👤 Employee Name Text */}
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-2 pr-6 transition-colors">
                    Welcome, {member.firstName} {member.lastName}!
                  </h2>

                  {/* 🏷️ Badge Tag Element */}
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50 px-3 py-1.5 rounded-full inline-block transition-colors">
                    {member.company.title}
                  </span>
                </div>
              ))}
      </div>

      {/* 🖼️ 3. CONDITIONAL OVERLAY MODAL WINDOW BOX */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          {/* Modal Backdrop overlay closer element click wrapper */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedMember(null)}
          ></div>

          {/* Main Content Modal Card Container */}
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-800 text-center transition-all scale-100">
            {/* Close Button Top Right */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold cursor-pointer text-lg p-1"
            >
              ✕
            </button>

            {/* Profile Avatar Image Box */}
            {/* 👤 Profile Avatar Image Box - FIXED to use local SVGs instead of external web URLs */}
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
              {selectedMember.image &&
              !selectedMember.image.includes("dicebear") ? (
                // If it's a real live user from DummyJSON, load their real network image safely
                <img
                  src={selectedMember.image}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                // ⚡ FALLBACK: If it's your custom member, render a local, beautiful vector silhouette icon instantly without any network call!
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

            {/* Employee Core Names Text headers */}
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
