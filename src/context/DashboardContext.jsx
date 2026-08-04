import { createContext, useState, useEffect } from "react";
// 🌟 1. Create the empty Context cloud container
export const DashboardContext = createContext();
// 🌟 2. Build the Provider component that will wrap our entire app
export const DashboardProvider = ({ children }) => {
  const [team, setTeam] = useState(() => {
    const localTeam = localStorage.getItem("savedTeamDirectory");
    return localTeam ? JSON.parse(localTeam) : [];
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const localTeam = localStorage.getItem("savedTeamDirectory");
    if (localTeam && JSON.parse(localTeam).length > 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch("https://dummyjson.com/users")
      .then((response) => response.json())
      .then((data) => {
        const initialProfiles = data.users.slice(0, 4);
        setTeam(initialProfiles);
        localStorage.setItem(
          "savedTeamDirectory",
          JSON.stringify(initialProfiles),
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (team.length > 0) {
      localStorage.setItem("savedTeamDirectory", JSON.stringify(team));
    }
  }, [team]);

  // 🌟 3. Pass values down into the cloud provider value stream
  return (
    <DashboardContext.Provider value={{ team, setTeam, isLoading }}>
      {children}
    </DashboardContext.Provider>
  );
};
