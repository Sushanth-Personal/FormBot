import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Switch from "../../components/Switch/Switch";
import { useUserContext } from "../../Contexts/UserContext";
import useAuth from "../../customHooks/useAuth";
import { createFolder, deleteFolder } from "../../api/api";
import useFetchFolders from "../../customHooks/useFetchFolders";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  useAuth();
  useFetchFolders();

  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false); // State for modal visibility
  const [folderName, setFolderName] = useState(""); // State for folder name input
  const { folders, setFolders } = useUserContext();
  const { theme, userData } = useUserContext();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /**
   * Toggles the visibility of the dropdown menu
   */
  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleCreateFolderClick = () => {
    setIsFolderModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsFolderModalOpen(false); // Close the modal
    setFolderName(""); // Reset folder name
  };

  const handleFolderDone = async () => {
    if (folderName.trim()) {
      try {
        // Call the createFolder function and pass the folderName
        const currentFolderData = await createFolder(folderName);
        if (currentFolderData === "UserId not found") {
          navigate("/login");
          return;
        }
        // Update the folder list with the new folder data
        setFolders(currentFolderData);

        console.log(
          "Folder created successfully:",
          currentFolderData
        );

        // Close the modal after successful creation
        handleCloseModal();
      } catch (error) {
        // Handle any errors during the folder creation
        console.error("Error creating folder:", error);
        alert("Failed to create folder. Please try again.");
      }
    } else {
      alert("Please enter a folder name");
    }
  };

  const handleDeleteFolder = async (folderName) => {
    try {
      console.log("folderName", folderName);
      // Call the deleteFolder function and pass the folderId
      const currentFolderData = await deleteFolder(folderName);
      if (currentFolderData === "UserId not found") {
        navigate("/login");
        return;
      }
      // Update the folder list
      setFolders(currentFolderData);
      console.log(
        "Folder deleted successfully:",
        currentFolderData
      );
    } catch (error) {
      // Handle any errors during the folder deletion
      console.error("Error deleting folder:", error);
      alert("Failed to delete folder. Please try again.");
    }
  };

  return (
    <section className={styles.dashboard}>
      <nav className={styles.navBar}>
        <div className={styles.leftContainer}>
          {!isDropdownVisible && (
            <div
              role="button"
              onClick={toggleDropdown}
              className={styles.workspaceSelector}
            >
              <h1>{`${userData.username}'s workspace`}</h1>
              <img
                className={styles.downArrow}
                src={
                  theme === "light"
                    ? "https://res.cloudinary.com/dtu64orvo/image/upload/v1734862852/arrow-down-sign-to-navigate_pfxwn8.png"
                    : "https://res.cloudinary.com/dtu64orvo/image/upload/v1734852265/options_ffofkm.png"
                }
                alt="options"
              />
            </div>
          )}
          {isDropdownVisible && (
            <div
              role="button"
              onClick={toggleDropdown}
              className={styles.dropdown}
            >
              <ul>
                <li>
                  <p>{`${userData.username}'s workspace`}</p>
                  <img
                    src={
                      theme === "light"
                        ? "https://res.cloudinary.com/dtu64orvo/image/upload/v1734862454/upload_qki06s.png"
                        : "https://res.cloudinary.com/dtu64orvo/image/upload/v1734853373/SVG_2_yxfzds.png"
                    }
                    alt="options"
                  />
                </li>
                <li>Settings</li>
                <li>Log Out</li>
              </ul>
            </div>
          )}
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.themeSelector}>
            <label htmlFor="basic-switch">Light</label>
            <Switch />
            <label htmlFor="basic-switch">Dark</label>
          </div>
          <button className={styles.share}>Share</button>
        </div>
      </nav>
      <div className={styles.workspace}>
        <div className={styles.content}>
          <div className={styles.folderNav}>
            <ul>
              <li role="button" onClick={handleCreateFolderClick}>
                <img
                  className={styles.createFolder}
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734865182/SVG_3_fawuu1.png"
                  alt="create folder"
                />
                Create a folder
              </li>
              {folders.map((folder, index) => (
                <li key={index}>
                  {folder.name}
                  <img
                    role="button"
                    onClick={() => handleDeleteFolder(folder.name)}
                    className={styles.deleteFolder}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734865860/delete_obpnmw.png"
                    alt="delete folder"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.formArea}>
            <ul>
              <li>
                <img
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734893036/SVG_4_zwan4q.png"
                  alt="add"
                />
                <h3>Create a typebot</h3>
              </li>
              <li>
                <img
                  className={styles.deleteButton}
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734893849/delete_dvkcex.svg"
                  alt="delete"
                />
                <h3>New form</h3>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Folder Modal */}
      {isFolderModalOpen && (
        <div className={styles.Modal}>
          <div className={styles.modalContent}>
            <h3>Create Folder</h3>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className={styles.modalInput}
            />
            <div className={styles.modalActions}>
              <button
                onClick={handleFolderDone}
                className={styles.doneButton}
              >
                Done
              </button>
              <button
                onClick={handleCloseModal}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
