import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useUserContext } from "../Contexts/UserContext";
/**
 * Custom hook to fetch flow button data from the backend and cache it in sessionStorage.
 */
const useFetchFlowData = () => {
  const {
    userData,
    selectedFolder,
    selectedForm,
    flowData,
    setFlowData,
  } = useUserContext();

  useEffect(() => {
    console.log("Reached",userData);
    const fetchData = async () => {
     
   
        try {
          console.log("Reached", selectedFolder, selectedForm);
          const response = await api.get(
            `/protected/form/${userData._id}`,
            {
              params: {
                formName: selectedForm,
                folderName: selectedFolder,
              },
            }
          ); // Updated API endpoint
          if (response.status === 200) {
            const data = response.data;
            console.log(response);

            sessionStorage.setItem("flowData", JSON.stringify(data.elements));
            setFlowData(data.elements);
          } else {
            console.error("Failed to fetch flow data");
          }
        } catch (error) {
          console.error("Error fetching flow data:", error);
        }
      }
    

    fetchData();
  }, [userData]);

  return flowData;
};

export default useFetchFlowData;
