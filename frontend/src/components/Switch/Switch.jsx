import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../Contexts/UserContext';
import styles from './Switch.module.css'; // Import the CSS module

const Switch = () => {
  const { theme, setTheme } = useUserContext();
  const [checked, setChecked] = useState(theme === 'dark'); // Set initial state based on the current theme

  useEffect(() => {
    // Update the theme whenever it changes in the context
    setChecked(theme === 'dark');
  }, [theme]);

  const handleSwitchToggle = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    setChecked(prevChecked => !prevChecked); // Toggle the checked state
  };

  return (
    <div className={styles.switch}>
      
      <button
        id="basic-switch"
        className={`${styles.mdcSwitch} ${checked ? styles.mdcSwitchSelected : ''}`}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleSwitchToggle} // Toggle the switch on click
      >
        <div className={styles.mdcSwitchTrack}></div>
        <div className={styles.mdcSwitchHandleTrack}>
          <div className={styles.mdcSwitchHandle}>
            <div className={styles.mdcSwitchShadow}>
              <div className={styles.mdcElevationOverlay}></div>
            </div>
            <div className={styles.mdcSwitchRipple}></div>
            <div className={styles.mdcSwitchIcons}>
              <svg
                className={`${styles.mdcSwitchIcon} ${checked ? '' : styles.mdcSwitchIconHidden}`}
                viewBox="0 0 24 24"
              >
                <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
              </svg>
              <svg
                className={`${styles.mdcSwitchIcon} ${!checked ? '' : styles.mdcSwitchIconHidden}`}
                viewBox="0 0 24 24"
              >
                <path d="M20 13H4v-2h16v2z" />
              </svg>
            </div>
          </div>
        </div>
        <span className={styles.mdcSwitchFocusRingWrapper}>
          <div className={styles.mdcSwitchFocusRing}></div>
        </span>
      </button>

    </div>
  );
};

export default Switch;
