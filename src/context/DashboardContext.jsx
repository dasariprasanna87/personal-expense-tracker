import { createContext } from "react";
// 📥 Import essential modules from TanStack Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // 1. 🌐 THE ENGINE FETCH PIPELINE: Looks at LocalStorage FIRST, falls back to API if empty
  const { data: team = [], isLoading } = useQuery({
    queryKey: ["teamDirectory"],
    queryFn: async () => {
      // 💾 Check if there is an existing local disk backup cache first
      const savedCache = localStorage.getItem("savedTeamDirectory");
      if (savedCache && JSON.parse(savedCache).length > 0) {
        return JSON.parse(savedCache);
      }

      // If no disk backup is found, fetch from the external network endpoint
      const response = await fetch("https://dummyjson.com/users");
      if (!response.ok) throw new Error("Network request breakdown");
      const data = await response.json();

      const initialProfiles = data.users.slice(0, 4);
      localStorage.setItem(
        "savedTeamDirectory",
        JSON.stringify(initialProfiles),
      ); // Seed disk cache
      return initialProfiles;
    },
    staleTime: 1000 * 60 * 5, // Data remains fresh in memory for 5 minutes
  });

  // 2. ➕ THE MUTATION ENGINE: Adds a worker to memory AND updates the LocalStorage backup disk
  const addEmployeeMutation = useMutation({
    mutationFn: async (newEmployee) => newEmployee,
    onSuccess: (newEmployee) => {
      queryClient.setQueryData(["teamDirectory"], (oldTeamData = []) => {
        const updatedCache = [newEmployee, ...oldTeamData];
        localStorage.setItem(
          "savedTeamDirectory",
          JSON.stringify(updatedCache),
        ); // Save to hard drive
        return updatedCache;
      });
    },
  });

  // 3. 🗑️ THE DELETION MUTATION ENGINE: Removes a worker from memory and updates LocalStorage
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (idToDelete) => idToDelete,
    onSuccess: (idToDelete) => {
      queryClient.setQueryData(["teamDirectory"], (oldTeamData = []) => {
        const updatedCache = oldTeamData.filter(
          (member) => member.id !== idToDelete,
        );
        localStorage.setItem(
          "savedTeamDirectory",
          JSON.stringify(updatedCache),
        ); // Save to hard drive
        return updatedCache;
      });
    },
  });

  // 4. 🔄 THE RESET MUTATION ENGINE: Wipes local disk and forces a fresh API download trigger
  const resetDirectoryMutation = useMutation({
    mutationFn: async () => null,
    onSuccess: () => {
      localStorage.removeItem("savedTeamDirectory"); // Clear hard drive cache completely
      queryClient.invalidateQueries({ queryKey: ["teamDirectory"] }); // Invalidate RAM memory
    },
  });

  // ⚙️ Bridge logic function mapping for DirectoryPage.jsx compatibility
  const setTeam = (updatedDataOrAction) => {
    if (Array.isArray(updatedDataOrAction)) {
      const deletionFlagCheck = updatedDataOrAction.find((m) => m.isDeleting);

      if (deletionFlagCheck) {
        const remainingItems = updatedDataOrAction.filter(
          (m) => m.id !== deletionFlagCheck.id,
        );
        if (
          remainingItems.length < team.length &&
          !updatedDataOrAction.some((m) => m.id === deletionFlagCheck.id)
        ) {
          deleteEmployeeMutation.mutate(deletionFlagCheck.id);
        } else {
          queryClient.setQueryData(["teamDirectory"], updatedDataOrAction);
        }
      } else if (updatedDataOrAction.length > team.length) {
        // If adding an employee from DirectoryPage form
        addEmployeeMutation.mutate(updatedDataOrAction[0]);
      } else {
        queryClient.setQueryData(["teamDirectory"], updatedDataOrAction);
        localStorage.setItem(
          "savedTeamDirectory",
          JSON.stringify(updatedDataOrAction),
        );
      }
    }
  };

  return (
    <DashboardContext.Provider
      value={{ team, setTeam, isLoading, resetDirectoryMutation }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
