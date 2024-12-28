import { useState, useEffect } from "react";
import {api} from "../api/api";
import { useUserContext } from "../Contexts/UserContext";
const useFetchAccessibleWorkspaces = () => {

  
  const [error, setError] = useState(null);
  const {workspaces,userData, setWorkspaces} = useUserContext();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {

        const response = await api.get(`/access/workspaces/${userData._id}`);
        // Assuming the response contains an array of workspaces with user info (username, userId, accessToken)
        console.log(response.data);
        if(userData._id != undefined){
          setWorkspaces([{
            userId: userData._id,
            username: userData.username,
            permission: "edit"
          },
        ...response.data
        ]);
        }
        
      } catch (err) {
        setError("Failed to fetch accessible workspaces",err);
      } 
    };

   
      fetchWorkspaces();
    
  }, [userData]);

  return { workspaces, error };
};

export default useFetchAccessibleWorkspaces;
