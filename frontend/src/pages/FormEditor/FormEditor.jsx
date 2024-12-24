import styles from "./formeditor.module.css";
import { useUserContext } from "../../Contexts/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "../../components/Switch/Switch";
import { api } from "../../api/api";
import useAuth from "../../customHooks/useAuth";
const FormEditor = () => {
  useAuth();
  const navigate = useNavigate();
  const {
    theme,
    userData,
    selectedForm,
    setSelectedForm,
    selectedFolder,
  } = useUserContext();
  const [isInputSelected, setIsInputSelected] = useState(false);
  const [currentForm, setCurrentForm] = useState(selectedForm);
  const [isFlowClicked, setIsFlowClicked] = useState(false);
  const [isResponseClicked, setIsResponseClicked] = useState(false);
  const [error, setError] = useState("Required field");
  const [selectedTool, setSelectedTool] = useState(null);
  const [flowButtons, setFlowButtons] = useState([
    {
      type: "StartButton",
      id: `StartButton-${Date.now()}`,
    },
  ]);

  const [bubbleData, setBubbleData] = useState({
    TextBubble: "",
    Image: "",
    Video: "",
    Gif: "",
  });
  const inputTexts = {
    TextInput: "Hint : User will input a text on his form",
    Number: "Hint : User will input a number on his form",
    Email: "Hint : User will input a email on his form",
    Phone: "Hint : User will input a phone on his form",
    Date: "Hint : User will select a date",
    Rating: "Hint : User will tap to rate out of 5",
    Time: "Hint : User will select a time",
  };

  const label = {
    TextInput: "Input Text",
    Number: "Input Number",
    Email: "Input Email",
    Phone: "Input Phone",
    Date: "Input Date",
    Rating: "Input Rating",
    TextBubble: "Text",
    Image: "Image",
    Video: "Video",
    Gif: "GIF",
    Time: "Input Time",
    Button: "Button",
  };

  const handleFlowClick = () => {
    setIsFlowClicked(!isFlowClicked);
    setIsResponseClicked(false);
  };

  const handleResponseClick = () => {
    setIsResponseClicked(!isResponseClicked);
    setIsFlowClicked(false);
  };

  const handleCloseForm = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleInputBlur = () => {
    setSelectedForm(currentForm);
    setIsInputSelected(false);
  };

  // Handle toolbox button click to add flow button
  const handleToolBoxButtonClick = (toolType) => {
    setSelectedTool(toolType);
    const newFlowButton = {
      type: toolType,
      id: `${toolType}-${Date.now()}`, // Unique ID based on timestamp for each click
    };

    // Add the new flow button to the flowButtons state
    setFlowButtons((prevButtons) => [...prevButtons, newFlowButton]);
  };

  // Handle delete button for a flow button
  const handleDeleteFlowButton = (id) => {
    setFlowButtons((prevButtons) =>
      prevButtons.filter((button) => button.id !== id)
    );
  };

  const handleInputChange = (e, type) => {
    setBubbleData((prevData) => ({
      ...prevData,
      [type]: e.target.value,
    }));
  };

  const handleSave = () => {
    const payload = flowButtons
      .filter((button) =>
        ["TextBubble", "Image", "Video", "Gif", "TextInput", "Button", "Time", "Date", "Number", "Email", "Phone", "Rating"].includes(
          button.type
        )
      )
      .map((button) => ({
        buttonType: button.type, // Changed to match the backend
        order: flowButtons.indexOf(button),
        content: bubbleData[button.type] || "", // Ensure content is properly assigned
      }));

    console.log("payload", payload, selectedFolder, selectedForm);

    // Send the data to the backend using axios
    api
      .put(`/api/form/${userData._id}`, {
        formName: selectedForm, // Example, make sure you provide the form name dynamically
        folderName: selectedFolder,
        elements: payload, // The elements field should be the array from payload
      })
      .then((response) => {
        console.log("Data saved successfully", response.data);
      })
      .catch((error) => {
        console.error("Error saving data", error);
      });
  };

  return (
    <section className={styles.formEditor}>
      <nav className={styles.navBar}>
        <div className={styles.leftTray}>
          {!isInputSelected ? (
            <h1 onClick={() => setIsInputSelected(true)}>
              {selectedForm}
            </h1>
          ) : (
            <input
              type="text"
              placeholder={selectedForm}
              value={currentForm}
              onChange={(e) => setCurrentForm(e.target.value)}
              onBlur={handleInputBlur}
            />
          )}
        </div>
        <div className={styles.middleTray}>
          <div className={styles.content}>
            <button
              onClick={handleFlowClick}
              className={`${styles.flow} ${
                isFlowClicked ? styles.active : ""
              }`}
            >
              Flow
            </button>
            <button
              onClick={handleResponseClick}
              className={`${styles.responseButton} ${
                isResponseClicked ? styles.active : ""
              }`}
            >
              Response
            </button>
          </div>
        </div>
        <div className={styles.rightTray}>
          <div className={styles.themeSelector}>
            <label htmlFor="basic-switch">Light</label>
            <Switch />
            <label htmlFor="basic-switch">Dark</label>
          </div>
          <button className={styles.share}>Share</button>
          <button
            onClick={handleSave}
            className={`${styles.share} ${styles.save}`}
          >
            Save
          </button>
          <img
            role="button"
            onClick={handleCloseForm}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734971147/close_i1fxoe.svg"
            alt="close"
          />
        </div>
      </nav>
      <main className={styles.main}>
        <div className={styles.toolBox}>
          <div className={styles.content}>
            <div className={styles.bubbles}>
              <h1>Bubbles</h1>
              <div className={styles.bubbleContent}>
                <button
                  onClick={() =>
                    handleToolBoxButtonClick("TextBubble")
                  }
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734976788/Vector_tywr4q.svg"
                    alt="doc icon"
                  />
                  <p>Text</p>
                </button>
                <button
                  onClick={() => {
                    handleToolBoxButtonClick("Image");
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977696/SVG_5_zbkxik.png"
                    alt="image icon"
                  />
                  <p>Image</p>
                </button>
                <button
                  onClick={() => handleToolBoxButtonClick("Video")}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977709/SVG_1_ea3rsy.svg"
                    alt="Video icon"
                  />
                  <p>Video</p>
                </button>
                <button
                  onClick={() => handleToolBoxButtonClick("Gif")}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977701/Container_3_bm6fqv.png"
                    alt="gif icon"
                  />
                  <p>GIF</p>
                </button>
              </div>
            </div>
            <div className={styles.bubbles}>
              <h1>Inputs</h1>
              <div className={styles.bubbleContent}>
                <button
                  onClick={() =>
                    handleToolBoxButtonClick("TextInput")
                  }
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977877/SVG_6_x5vxny.png"
                    alt="doc icon"
                  />
                  <p>Text</p>
                </button>
                <button
                  onClick={() => handleToolBoxButtonClick("Number")}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977951/SVG_3_krlgib.png"
                    alt="number icon"
                  />
                  <p>Number</p>
                </button>
                <button
                  onClick={() => handleToolBoxButtonClick("Email")}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977951/SVG_3_krlgib.png"
                    alt="email icon"
                  />
                  <p>Email</p>
                </button>
                <button
                  onClick={() => handleToolBoxButtonClick("Phone")}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977958/SVG_4_rakedz.png"
                    alt="phone icon"
                  />
                  <p>Phone</p>
                </button>
                <button
                  onClick={() => handleToolBoxButtonClick("Date")}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977961/SVG_5_o1b4ja.png"
                    alt="date icon"
                  />
                  <p>Date</p>
                </button>
                <button
                  onClick={() => handleToolBoxButtonClick("Time")}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977958/SVG_4_rakedz.png"
                    alt="time icon"
                  />
                  <p>Time</p>
                </button>
                <button
                  onClick={() => handleToolBoxButtonClick("Rating")}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977965/SVG_7_snsvsb.png"
                    alt="rating icon"
                  />
                  <p>Rating</p>
                </button>
                <button
                  onClick={() => handleToolBoxButtonClick("Button")}
                >
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977969/SVG_8_ddw6ca.png"
                    alt="buttons icon"
                  />
                  <p>Buttons</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.flowContent}>
          <div className={styles.leftGap}></div>
          <div className={styles.rightGap}>
            <div className={styles.flowDisplay}>
              {flowButtons.map((button, index) => (
                <div
                  key={button.id}
                  className={`${styles.flowButton} ${
                    ["TextBubble", "Image", "Video", "Gif"].includes(
                      button.type
                    )
                      ? styles.bubble
                      : ""
                  } ${
                    button.type === "StartButton" ? styles.start : ""
                  }`}
                  style={{ order: index }}
                >
                  {button.type === "StartButton" && (
                    <img
                      src={
                        theme === "light"
                          ? "https://res.cloudinary.com/dtu64orvo/image/upload/v1735017073/Vector_5_ag2xrt.png"
                          : "https://res.cloudinary.com/dtu64orvo/image/upload/v1735013851/Vector_ivnat6.svg"
                      }
                      alt="start icon"
                      className={styles.startIcon}
                    />
                  )}
                  {button.type !== "StartButton" && (
                    <div className={styles.ellipse}></div>
                  )}
                  {button.type !== "StartButton" && (
                    <img
                      className={styles.deleteIcon}
                      onClick={() =>
                        handleDeleteFlowButton(button.id)
                      }
                      src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734893849/delete_dvkcex.svg"
                      alt="delete"
                    />
                  )}
                  <h1>
                    {button.type === "StartButton"
                      ? "Start"
                      : `${label[button.type]} ${index}`}{" "}
                    {/* Use button's own counter */}
                  </h1>
                  {["TextBubble", "Image", "Video", "Gif"].includes(
                    button.type
                  ) && (
                    <input
                      type="text"
                      placeholder={
                        button.type === "TextBubble"
                          ? "Enter text"
                          : "Click to add link"
                      }
                      className={styles.inputField}
                      value={bubbleData[button.type]}
                      onChange={(e) =>
                        handleInputChange(e, button.type)
                      }
                    />
                  )}
                  {[
                    "TextInput",
                    "Number",
                    "Email",
                    "Phone",
                    "Date",
                    "Time",
                    "Rating",
                    "Button",
                  ].includes(button.type) && (
                    <p>{inputTexts[button.type]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default FormEditor;
