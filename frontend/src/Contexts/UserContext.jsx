import { createContext, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types";

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [theme, setTheme] = useState("dark");
  const [folders, setFolders] = useState([]);
  const [allForms, setAllForms] = useState({});
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [flowData, setFlowData] = useState({});
  const [workspaces, setWorkspaces] = useState([]);
  const value = useMemo(
    () => ({
      userId,
      setUserId,
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      theme,
      setTheme,
      folders,
      setFolders,
      allForms,
      setAllForms,
      selectedForm,
      setSelectedForm,
      selectedFolder,
      setSelectedFolder,
      flowData,
      setFlowData,
      workspaces,
      setWorkspaces
    }),
    [
      userId,
      setUserId,
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      theme,
      setTheme,
      folders,
      setFolders,
      allForms,
      setAllForms,
      selectedForm,
      setSelectedForm,
      selectedFolder,
      setSelectedFolder,
      flowData,
      setFlowData,
      workspaces,
      setWorkspaces
    ]
  );

  return (
    <UserContext.Provider value={value}>
      {children} {/* Render the children inside the provider */}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUserContext must be used within a UserProvider"
    );
  }
  return context;
};

// PropTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Set a display name for debugging
UserContext.displayName = "UserContext";

export default UserContext;
