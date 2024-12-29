import { useState, useEffect } from "react";
import { fetchUserData, api } from "../api/api";
import { useUserContext } from "../Contexts/UserContext";

const useFetchAccessibleWorkspaces = (setSelectedWorkspace) => {
  const [error, setError] = useState(null);
  const { workspaces, userData, setWorkspaces } = useUserContext();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        // Get userId from sessionStorage or localStorage
        const userId = localStorage.getItem("userId");

        console.log("userId", userId);

        // Fetch workspaces for the given userId
        const response = await api.get(
          `/access/workspaces/${userId}`
        );
        console.log(response.data);

   
          setWorkspaces([...response.data.workspaces]);
          if(JSON.parse(sessionStorage.getItem("selectedWorkspace"))){
            setSelectedWorkspace(JSON.parse(sessionStorage.getItem("selectedWorkspace")));
            return;
          }
         
          const userResponse = await fetchUserData(userId);
          if (userResponse) {
            console.log("goinginside");
            setSelectedWorkspace(userResponse);
            sessionStorage.setItem(
              "selectedWorkspace",
              JSON.stringify(userResponse)
            );
          }
        
      } catch (err) {
        // Handle errors
        setError("Failed to fetch accessible workspaces");
        console.error(err);
      }
    };

    fetchWorkspaces();
  }, [userData, setWorkspaces, setSelectedWorkspace]);

  return { workspaces, error };
};

export default useFetchAccessibleWorkspaces;
