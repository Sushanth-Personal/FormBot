import styles from "./formeditor.module.css";
import { useUserContext } from "../../Contexts/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "../../components/Switch/Switch";
import { api } from "../../api/api";
import useAuth from "../../customHooks/useAuth";
import useFetchFlowData from "../../customHooks/useFetchFlowData";
import ResponseDisplay from "../../components/ResponseDisplay/ResponseDisplay";
const FormEditor = () => {
  useAuth();
  useFetchFlowData();
  const navigate = useNavigate();
  const {
    theme,
    userData,
    selectedForm,
    setSelectedForm,
    selectedFolder,
    setSelectedFolder,
    flowData,
    setFlowData,
  } = useUserContext();
  const [isInputSelected, setIsInputSelected] = useState(false);
  const [currentForm, setCurrentForm] = useState(selectedForm);
  const [isFlowClicked, setIsFlowClicked] = useState(true);
  const [isResponseClicked, setIsResponseClicked] = useState(false);
  const [error, setError] = useState("Required field");
  const [selectedTool, setSelectedTool] = useState(null);
  const count = {
    TextInput: 0,
    Number: 0,
    Email: 0,
    Phone: 0,
    Date: 0,
    Rating: 0,
    TextBubble: 0,
    Image: 0,
    Video: 0,
    Gif: 0,
    Button: 0,
  };
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
    Button: "Button",
  };

  const getCount = (type) => {
    count[type] += 1;
    return count[type];
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
    console.log(flowData);
    const formName = sessionStorage.getItem("selectedForm");
    if (formName) {
      setCurrentForm(formName);
      setSelectedForm(formName);
    }
    const folderName = sessionStorage.getItem("selectedFolder");
    if (folderName) {
      setSelectedFolder(folderName);
    }
  }, [flowData]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleInputBlur = () => {
    changeFormName();
  };

  const changeFormName = async () => {
    const folderForms =
    JSON.parse(localStorage.getItem("folderForms")) || [];
  if (
    Object.values(folderForms).some((forms) =>
      forms.includes(currentForm)
    )
  ) {
    console.log("Form with this name already exists");
    alert("Form with this name already exists");
    setCurrentForm(selectedForm);
    return;
  }

    try {
      const response = await api.put(`/protected/form/${userData._id}`, {
        formName: selectedForm,
        folderName: selectedFolder,
        newFormName: currentForm,
      });
    
      console.log(response);
      if (response.status === 200) {
        console.log(response);
        setSelectedForm(currentForm);
        sessionStorage.setItem("selectedForm", currentForm);
        setIsInputSelected(false);
      }
    } catch (error) {
      console.error("error updating formName", error);
    }
  };

  // Handle toolbox button click to add flow button
  const handleToolBoxButtonClick = (toolType) => {
    setSelectedTool(toolType);

    const newFlowData = {
      buttonType: toolType,
      id: `${toolType}-${Date.now()}`, // Unique ID based on timestamp for each click
      content: "", // Default content
      order: flowData.length + 1, // Assign order based on existing buttons
    };

    // Append the new flow button to the flowData state
    setFlowData((prevFlowData) => {
      const updatedFlowData = Array.isArray(prevFlowData)
        ? [...prevFlowData, newFlowData]
        : [newFlowData]; // Handle case where flowData is not an array
      return updatedFlowData;
    });
  };

  // Handle delete button for a flow button
  const handleDeleteFlowButton = (id) => {
    console.log("id", id);
    // Step 1: Filter out the button being deleted
    const updatedFlowData = flowData.filter(
      (button) => button.id !== id
    );
    console.log(updatedFlowData);
    // Step 2: Reassign the order to the remaining buttons (1, 2, 3, ...)
    const updatedFlowDataWithOrder = updatedFlowData.map(
      (button, index) => ({
        ...button,
        order: index + 1, // Ensure order starts from 1
      })
    );

    // Step 3: Update the flow data with the new order
    setFlowData(updatedFlowDataWithOrder);
  };

  // Handle input change for specific button type
  const handleInputChange = (e, buttonType, buttonId) => {
    const { value } = e.target;
    console.log(value);
    // Update the content of the flowData for the specific button
    setFlowData((prevFlowData) =>
      prevFlowData.map((button) =>
        button.id === buttonId
          ? {
              ...button,
              content: value, // Update content with the new input value
            }
          : button
      )
    );
  };

  const handleSave = () => {
    // Ensure StartButton with order: 1 exists
    console.log(flowData);
    // Prepare the payload
    const payload = flowData
      .filter((button) =>
        [
          "TextBubble",
          "Image",
          "Video",
          "Gif",
          "TextInput",
          "Button",
          "Date",
          "Number",
          "Email",
          "Phone",
          "Rating",
          "StartButton",
        ].includes(button.buttonType)
      )
      .map((button) => {
        const content =
          button.buttonType !== "StartButton"
            ? button.content || "" // Ensure content is properly assigned
            : ""; // StartButton may not have content, you can adjust as needed
        console.log(flowData);
        return {
          buttonType: button.buttonType,
          id: button.id,
          order:
            flowData.findIndex(
              (flowButton) => flowButton.id === button.id
            ) + 1, // Ensure proper order
          content: content, // Add content to the payload
        };
      });

    console.log("payload", payload, selectedFolder, selectedForm);

    // Send the data to the backend using axios
    api
      .put(`/protected/form/${userData._id}`, {
        formName: selectedForm,
        folderName: selectedFolder,
        elements: payload, // Send the updated flow data to backend
      })
      .then((response) => {
        console.log("Data saved successfully", response.data);
        // Optionally, show success message, navigate, etc.
      })
      .catch((error) => {
        console.error("Error saving data", error);
        // Optionally, show error message
      });
  };

  const handleShare = () => {
    // Construct a URL with minimal query parameters
    const link = `${window.location.origin}/formbot?formName=${selectedForm}&folderName=${selectedFolder}&userId=${userData._id}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
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
          <button onClick={handleShare} className={styles.share}>
            Share
          </button>
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
        {isFlowClicked && (
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
                      src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734977948/SVG_2_qze36e.png"
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
        )}

        {isFlowClicked && (
          <div className={styles.flowContent}>
            <div className={styles.leftGap}></div>
            <div className={styles.rightGap}>
              <div className={styles.flowDisplay}>
                <div
                  className={`${styles.flowButton} ${styles.start}`}
                  style={{ order: 0 }}
                >
                  <img
                    src={
                      theme === "light"
                        ? "https://res.cloudinary.com/dtu64orvo/image/upload/v1735017073/Vector_5_ag2xrt.png"
                        : "https://res.cloudinary.com/dtu64orvo/image/upload/v1735013851/Vector_ivnat6.svg"
                    }
                    alt="start icon"
                    className={styles.startIcon}
                  />
                  <h1>Start</h1>
                </div>
                {flowData?.map?.(
                  (button, index) =>
                    button.buttonType !== "StartButton" && (
                      <div
                        key={button._id || index}
                        className={`${styles.flowButton} ${
                          [
                            "TextBubble",
                            "Image",
                            "Video",
                            "Gif",
                          ].includes(button.buttonType)
                            ? styles.bubble
                            : ""
                        } ${
                          button.buttonType === "StartButton"
                            ? styles.start
                            : ""
                        }`}
                        style={{ order: index + 1 }} // Ensure StartButton stays at the top
                      >
                        {button.buttonType !== "StartButton" && (
                          <div className={styles.ellipse}></div>
                        )}
                        {button.buttonType !== "StartButton" && (
                          <img
                            className={styles.deleteIcon}
                            onClick={() =>
                              handleDeleteFlowButton(
                                button.id || index
                              )
                            }
                            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734893849/delete_dvkcex.svg"
                            alt="delete"
                          />
                        )}
                        <h1>
                          {button.buttonType === "Button"
                            ? "Finish"
                            : `${label[button.buttonType]} ${getCount(
                                button.buttonType
                              )}`}
                        </h1>

                        {[
                          "TextBubble",
                          "Image",
                          "Video",
                          "Gif",
                        ].includes(button.buttonType) && (
                          <input
                            type="text"
                            placeholder={
                              button.buttonType === "TextBubble"
                                ? "Enter text"
                                : "Click to add link"
                            }
                            className={styles.inputField}
                            value={button.content || ""} // Bind the input value to the button's content
                            onChange={
                              (e) =>
                                handleInputChange(
                                  e,
                                  button.buttonType,
                                  button.id
                                ) // Pass button.id to handleInputChange
                            }
                          />
                        )}
                        {[
                          "TextInput",
                          "Number",
                          "Email",
                          "Phone",
                          "Date",
                          "Rating",
                          "Button",
                        ].includes(button.buttonType) && (
                          <p>{inputTexts[button.buttonType]}</p>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        )}

        {!isFlowClicked && isResponseClicked && <ResponseDisplay />}
      </main>
    </section>
  );
};

export default FormEditor;
