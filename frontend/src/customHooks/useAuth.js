import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Contexts/UserContext";
import { fetchUserData } from "../api/api"; 

const useAuth = () => {
  const { setUserData, setUserId, setIsLoggedIn } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");

        if (!storedUserId) {
          // Redirect to login if userId is not in localStorage
          navigate("/login");
          return;
        }

        // Fetch user data from the backend
        const userResponse = await fetchUserData(storedUserId);
        console.log("userResponse", userResponse);
        if (userResponse) {
          setUserId(userResponse._id); // Set userId in context
          setUserData({
            ...userResponse,
            userId: userResponse._id,
          }); // Set full userData in context
          setIsLoggedIn(true);
        } else {
          // Handle case where user data is not found
          console.error("User data not found");
          navigate("/login"); // Redirect to login
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        navigate("/login"); // Redirect to login on error
      }
    };

    authenticateUser();
  }, [navigate, setUserData, setUserId]);
};

export default useAuth;
