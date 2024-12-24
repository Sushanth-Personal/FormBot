import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../api/api";
/**
 * Custom hook to fetch flow button data from the backend and cache it in sessionStorage.
 */
const useFetchFlowData = () => {
  const [flowData, setFlowData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = sessionStorage.getItem("flowData");
      if (cachedData) {
        setFlowData(JSON.parse(cachedData));
      } else {
        try {
          const response = await api.get("/flowData"); // Updated API endpoint
          if (response.status === 200) {
            const data = response.data;
            sessionStorage.setItem("flowData", JSON.stringify(data));
            setFlowData(data);
          } else {
            console.error("Failed to fetch flow data");
          }
        } catch (error) {
          console.error("Error fetching flow data:", error);
        }
      }
    };

    fetchData();
  }, []);

  return flowData;
};

export default useFetchFlowData;
