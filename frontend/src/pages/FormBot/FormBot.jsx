import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./formbot.module.css";
import useFetchFlowData from "../../customHooks/useFetchFlowData";
import { useUserContext } from "../../Contexts/UserContext";
import useAuth from "../../customHooks/useAuth";
import { useRef } from "react";

const FormBot = () => {
  useAuth();
  const { flowData, setSelectedFolder, setSelectedForm } =
    useUserContext();
  const location = useLocation();
  const [queryParams, setQueryParams] = useState({
    userId: "",
    formName: "",
    folderName: "",
  });
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(null);
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [tempRating, setTempRating] = useState(0);
  const [hasSentTextInput, setHasSentTextInput] = useState(false);
  const [hasSentDatePicker, setHasSentDatePicker] = useState(false);
  const [hasSentRatingInput, setHasSentRatingInput] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState(
    "Type your message..."
  );
  const [isSubmitButton, setIsSubmitButton] = useState(false);
  const [tempInput, setTempInput] = useState(""); // Temporary input for special types
  const [inputType, setInputType] = useState("text"); // Determines the input type
  const chatDisplayRef = useRef(null);

  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop =
        chatDisplayRef.current.scrollHeight;
    }
  }, [messages]); // Scroll whenever messages update

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId") || "";
    const formName = params.get("formName") || "";
    const folderName = params.get("folderName") || "";

    setQueryParams({ userId, formName, folderName });
    setSelectedFolder(folderName);
    setSelectedForm(formName);
  }, [location.search]);

  useFetchFlowData();

  useEffect(() => {
    if (flowData.length > 0 && currentIndex < flowData.length) {
      processFlowData(currentIndex);
    }
  }, [flowData, currentIndex]);

  const processFlowData = (index) => {
    const currentFlow = flowData[index];
    if (
      !currentFlow ||
      messages.some((msg) => msg.content === currentFlow.content)
    )
      return; // Prevent duplicate messages
    setIsInputDisabled(true);
    switch (currentFlow.buttonType) {
      case "TextBubble":
        setInputPlaceholder("Type your message...");
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: currentFlow.content },
        ]);
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 1000);
        break;
      case "Image":
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: `${currentFlow.content}`,
            isImage: true,
          },
        ]);
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 1000);
        break;
      case "Gif":
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: `${currentFlow.content}`,
            isGif: true,
          },
        ]);
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 1000);
        break;
      case "TextInput":
        if (!hasSentTextInput) {
          setMessages((prev) => [
            ...prev,
            { type: "bot", content: " " },
          ]);
          setHasSentTextInput(true);
          setIsInputDisabled(false);
          setInputPlaceholder("Please enter your response...");
        }
        break;
      case "Date":
        if (!hasSentDatePicker) {
          setMessages((prev) => [
            ...prev,
            { type: "bot", content: "Please select a date." },
          ]);
          setShowDatePicker(true);
          setHasSentDatePicker(true);
          setInputPlaceholder("Select a Date...");
        }
        break;
      case "Rating":
        if (!hasSentRatingInput) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: "Please provide a rating (1 to 5 stars).",
            },
          ]);
          setShowRatingInput(true);
          setHasSentRatingInput(true);
          setIsInputDisabled(false);
        }
        break;
      case "Number":
        setInputType("number");
        setInputPlaceholder("Please enter a number...");
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: "Please enter a number." },
        ]);
        setIsInputDisabled(false);
        break;
      case "Email":
        setInputType("email");
        setInputPlaceholder("Please enter your email...");
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: "Please enter your email." },
        ]);
        setIsInputDisabled(false);
        break;
      case "Phone":
        setInputType("phone");
        setInputPlaceholder("Please enter your phone number...");
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: "Please enter your phone number." },
        ]);
        setIsInputDisabled(false);
        break;
      case "Button":
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: "Please press the Submit Button" }, // Change to "Submit"
        ]);
        setHasSentTextInput(false); // Remove text input for this type
        setInputPlaceholder(""); // Clear the placeholder
        setIsSubmitButton(true);
        break;
      default:
        break;
    }
  };

  const handleUserInput = () => {
    console.log("tempDate", tempDate);

    // Handle Date Picker input
    if (showDatePicker && tempDate) {
      setMessages((prev) => [
        ...prev,
        { type: "user", content: `Selected Date: ${tempDate}` },
      ]);
      setTempDate(null);
      setShowDatePicker(false);
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    // Validate and process input for other button types
    if (!isInputDisabled && userInput.trim()) {
      // Determine button type for current flow step
      const currentFlow = flowData[currentIndex];
      if (currentFlow && currentFlow.buttonType) {
        switch (currentFlow.buttonType) {
          case "Number":
            if (isNaN(userInput) || userInput.trim() === "") {
              alert("Please enter a valid number.");
              return;
            }
            break;

          case "Email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userInput)) {
              alert("Please enter a valid email address.");
              return;
            }
            break;

          case "Phone":
            const phoneRegex = /^[0-9]{10}$/; // Adjust for different formats if necessary
            if (!phoneRegex.test(userInput)) {
              alert("Please enter a valid 10-digit phone number.");
              return;
            }
            break;

          default:
            // No validation needed for other button types
            break;
        }
      }

      // Append user input to messages and proceed
      setMessages((prev) => [
        ...prev,
        { type: "user", content: userInput },
      ]);
      setUserInput("");
      setCurrentIndex((prev) => prev + 1);
      if (currentFlow.buttonType === "TextInput") {
        setHasSentTextInput(false); // Reset flag for TextInput
      }
    }
  };

  const handleDateSelection = (date) => {
    setTempDate(date);
  };

  const handleRatingSelection = (rating) => {
    setTempRating(rating);
  };

  const confirmRatingSelection = () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: `Selected Rating: ${tempRating} Stars`,
      },
    ]);
    setTempRating(0);
    setShowRatingInput(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatDisplay} ref={chatDisplayRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.type === "bot"
                ? styles.botMessage
                : styles.userMessage
            }
          >
            {msg.isImage || msg.isGif ? (
              <img src={msg.content} alt="Media" />
            ) : (
              msg.content
            )}
          </div>
        ))}
      </div>

      {/* Show date picker if requested */}
      {showDatePicker && (
        <div className={styles.datePickerContainer}>
          <input
            type="date"
            onChange={(e) => handleDateSelection(e.target.value)}
          />
        </div>
      )}

      {/* Show rating input if requested */}
      {showRatingInput && (
        <div className={styles.textInputSection}>
          <div className={`${styles.ratingBox} `}>
            <div className={styles.ratingBubbles}>
              {[1, 2, 3, 4, 5].map((number) => (
                <div
                  key={number}
                  className={`${styles.bubble} ${
                    tempRating >= number ? styles.selectedBubble : ""
                  }`}
                  onClick={() => handleRatingSelection(number)}
                >
                  {number}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={confirmRatingSelection}
            className={styles.confirmButton}
          >
            <img
              src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735151031/send.svg"
              alt=""
            />
          </button>
        </div>
      )}

      {/* Input section, shown only when 'Rating' type is not active */}
      {!isSubmitButton && !showRatingInput && (
        <div className={`${styles.textInputSection} `}>
          <input
            className={`${isInputDisabled ? "disabledInput" : ""}`}
            disabled={isInputDisabled}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={inputPlaceholder}
          />
          {showDatePicker ? (
            <button
              disabled={showDatePicker && !tempDate}
              onClick={handleUserInput}
              className={`${styles.submitButton} ${
                isInputDisabled ? styles.disabledInput : ""
              }`}
            >
              <img
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735151031/send.svg"
                alt=""
              />
            </button>
          ) : (
            <button
              disabled={isInputDisabled}
              onClick={handleUserInput}
              className={`${styles.submitButton} ${
                isInputDisabled ? styles.disabledInput : ""
              }`}
            >
              <img
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735151031/send.svg"
                alt=""
              />
            </button>
          )}
        </div>
      )}
      {isSubmitButton && (
        <div className={styles.submitButtonContainer}>
          <button
            disabled={isInputDisabled}
            onClick={handleUserInput}
            className={`${styles.submitButton} ${styles.final}`}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default FormBot;
