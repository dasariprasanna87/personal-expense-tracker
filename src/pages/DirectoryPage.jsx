import { useState, useEffect } from "react";
import Toast from "../Tost";

// 📥 Destructure team, setTeam, and isLoading directly from incoming parent props
const DirectoryPage = ({ team, setTeam, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  // ⚠️ Track form validation errors
  const [errors, setErrors] = useState({ name: false, title: false });
  const [toastMessage, setToastMessage] = useState("");

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

    // ⚙️ 1. Reset error state flags before checking
    const newErrors = {
      name: !newName.trim(),
      title: !newTitle.trim(),
    };

    setErrors(newErrors);

    // 🛑 2. Block submission if any required field is empty
    if (newErrors.name || newErrors.title) return;

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
      image: "placeholder-triggered",
    };

    setTeam([newEmployee, ...team]);
    setNewName("");
    setNewTitle("");
    setErrors({ name: false, title: false }); // Reset error state explicitly
    setIsFormOpen(false);
    setToastMessage("Team member profile created!"); // 🌟 TRIGGER
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
  const handleResetDirectory = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the directory and re-fetch the default corporate team?",
      )
    ) {
      // 🗑️ 1. Clear the specific team cache from browser storage
      localStorage.removeItem("savedTeamDirectory");

      // 🔄 2. Force the app to re-fetch fresh profiles by temporarily emptying the array
      setTeam([]);

      // 🌐 3. Force-reload the page to re-trigger the root App.jsx useEffect API fetch script
      window.location.reload();
    }
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
        {/* ➕ Add Employee & 🔄 Reset Directory Layout Panel Block Row */}
        <div className="mb-6 max-w-md mx-auto flex justify-between items-center">
          {/* 🔄 Reset Control Button */}
          {team.length > 0 && (
            <button
              onClick={handleResetDirectory}
              className="text-xs font-bold uppercase text-red-500 hover:text-red-700 transition cursor-pointer"
            >
              🔄 Reset Default Team
            </button>
          )}

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-sm transition active:scale-98 cursor-pointer"
          >
            {isFormOpen ? "✕ Close Form" : "➕ Add New Team Member"}
          </button>
        </div>

        {isFormOpen && (
          <form
            onSubmit={handleAddEmployee}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-left mt-4 transition-all duration-300"
          >
            {/* Full Name Input Field */}
            <div className="mb-3.5">
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: false })); // Remove red border on type
                }}
                className={`w-full px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 text-sm transition-all border
          ${
            errors.name
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-200 dark:border-slate-700 focus:ring-blue-500"
          }`}
              />
              {/* ⚠️ Dynamic Alert Text Notice */}
              {errors.name && (
                <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1 animate-fade-in">
                  ⚠️ Full Name is required to create a profile.
                </p>
              )}
            </div>

            {/* Corporate Title / Role Input Field */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Corporate Title / Role
              </label>
              <input
                type="text"
                placeholder="Lead Architect, Specialist"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (errors.title)
                    setErrors((prev) => ({ ...prev, title: false })); // Remove red border on type
                }}
                className={`w-full px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 text-sm transition-all border
          ${
            errors.title
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-200 dark:border-slate-700 focus:ring-blue-500"
          }`}
              />
              {/* ⚠️ Dynamic Alert Text Notice */}
              {errors.title && (
                <p className="text-red-500 text-xs font-semibold mt-1.5 ml-1 animate-fade-in">
                  ⚠️ Corporate Role is required to distribute title tags.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-sm transition cursor-pointer"
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
      {/* 🔔 FLOATING ALERT INJECTION NODE */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
};

export default DirectoryPage;
