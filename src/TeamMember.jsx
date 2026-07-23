import { useState } from "react";

const TeamMember = (props) => {
  const [likes, setLikes] = useState(0);
  const handleCount = () => {
    setLikes(likes + 1);
  };

  return (
    // Beautiful card design with shadows, rounded corners, and hover animations
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 m-4 max-w-sm mx-auto transition duration-300 hover:shadow-md hover:-translate-y-1">
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        Welcome, {props.name}!
      </h2>
      <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mb-4">
        {props.designation}
      </p>

      {/* A modern interactive interactive layout for the metrics button */}
      <div className="mt-2 pt-3 border-t border-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-400 font-medium">
          Activity Metric
        </span>
        <button
          onClick={handleCount}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-1.5 px-4 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
        >
          👍 Likes {likes}
        </button>
      </div>
    </div>
  );
};

export default TeamMember;
