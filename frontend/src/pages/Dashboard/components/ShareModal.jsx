import { useState } from "react";
import styles from "./sharemodal.module.css"; // Ensure to style your modal as needed.
import axios from "axios";
import { useUserContext } from "../../../Contexts/UserContext";
import {api} from "../../../api/api";
const ShareModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("view");
  const { userData } = useUserContext();
  const handleShare = async () => {
    try {
      if (!email) {
        alert("Please enter a valid email.");
        return;
      }
 
      const response = await api.post(
        `/protected/access/workspaces/${userData._id}`,
        {
          email,
          permission:action,
        }
      );
      console.log("API Response:", response.data);
      alert("Invite sent successfully!");
      onClose(); // Close modal after successful API call.
    } catch (error) {
      console.error("Error sharing workspace:", error);
      alert("Failed to send invite. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Share Workspace</h2>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email ID:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email ID"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="action">Action:</label>
          <select
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
        </div>
        <button className={styles.shareButton} onClick={handleShare}>
          Send Invite
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
