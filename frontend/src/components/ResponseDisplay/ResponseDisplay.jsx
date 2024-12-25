import styles from "./responsedisplay.module.css";
import { useUserContext } from "../../Contexts/UserContext";
import { useEffect, useState } from "react";

const ResponseDisplay = () => {
  const { flowData } = useUserContext();
  const [count, setCount] = useState({
    TextInput: 0,
    Number: 0,
    Email: 0,
    Phone: 0,
    Date: 0,
    Rating: 0,
    Time: 0,
    TextBubble: 0,
    Image: 0,
    Video: 0,
    Gif: 0,
    Button: 0,
  });

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

  // Update count based on the buttonType
  const getCount = (type) => {
    count[type] += 1;
    return count[type];
  };

  useEffect(() => {

    console.log(flowData); // Log flowData to track its value
  }, [flowData]);



  return (
    <section className={styles.responseDisplay}>
      <div className={styles.viewContainer}>
        <div className={styles.views}>
          <h1>Views</h1>
          <p>0</p>
        </div>
        <div className={styles.views}>
          <h1>Start</h1>
          <p>0</p>
        </div>
      </div>

      {/* 3x3 Table */}
      <div className = {styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th> {/* Empty header for the first column */}
                {flowData.map((item, index) => (
                  <th key={index}>{`${label[item.buttonType]} ${getCount(item.buttonType)}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
          
            </tbody>
          </table>
      </div>
    </section>
  );
};

export default ResponseDisplay;
