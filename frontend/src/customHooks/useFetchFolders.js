import { useEffect, useState } from "react";
import { useUserContext } from "../Contexts/UserContext";
import {api} from "../api/api";

const useFetchFolders = () => {
  const { setFolders, setUserData,userData } = useUserContext(); // Destructure setUserData from context
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state

  useEffect(() => {
    console.log(userData);

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("reached")
        // Fetch user data along with folders
        const response = await api.get(`/protected/user/${userData._id}`);
        console.log("response", response);
        const { user, folders } = response.data;
        console.log("user and folders", user, folders);
        // Update user data in context
        setUserData(user);

        // Update folders in context
        setFolders(folders);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user and folder data:", err);
        setError(err.message || "Failed to fetch data.");
        setLoading(false);
      }
    };

    if (userData._id) fetchData(); // Only fetch if userId is provided
  }, [ userData._id,setUserData, setFolders]);

  return { loading, error };
};

export default useFetchFolders;
