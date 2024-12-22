import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Switch from "../../components/Switch/Switch";
import { useUserContext } from "../../Contexts/UserContext"; // Import the context

const Dashboard = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { theme } = useUserContext(); // Get theme from context

  // Update the theme attribute on <html> based on theme from context
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <section className={styles.dashboard}>
      <nav className={styles.navBar}>
        <div className={styles.leftContainer}>
          {!isDropdownVisible && (
            <div className={styles.workspaceSelector}>
              <h1>Dewank Rastogi's workspace</h1>
              <img
                className = {styles.downArrow}
                role="button"
                src={theme === "light" ? "https://res.cloudinary.com/dtu64orvo/image/upload/v1734862852/arrow-down-sign-to-navigate_pfxwn8.png" :"https://res.cloudinary.com/dtu64orvo/image/upload/v1734852265/options_ffofkm.png"}
                alt="options"
                onClick={toggleDropdown}
              />
            </div>
          )}
          {isDropdownVisible && (
            <div className={styles.dropdown}>
              <ul>
                <li>
                  <p>Dewank Rastogi's workspace</p>
                  <img
                    role="button"
                    src={theme === "light" ? "https://res.cloudinary.com/dtu64orvo/image/upload/v1734862454/upload_qki06s.png" :"https://res.cloudinary.com/dtu64orvo/image/upload/v1734853373/SVG_2_yxfzds.png"}
                    alt="options"
                    onClick={toggleDropdown}
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
        <div className={styles.content}></div>
        <div className={styles.folderNav}></div>
        <div className={styles.formArea}></div>
      </div>
    </section>
  );
};

export default Dashboard;
