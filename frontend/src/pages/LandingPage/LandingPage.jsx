import styles from "./landingpage.module.css";
import {useNavigate} from "react-router-dom";

const LandingPage = () => {

  const navigate = useNavigate();

  return (
    <section className={styles.landingPage}>
      <nav className={styles.navBar}>
        <div className={styles.logoContainer}>
          <img src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695019/logo_cgdotu.png" alt="" />
          <h1>FormBot</h1>
        </div>
        <div className={styles.rightContainer}>
          <button 
          onClick={() => navigate("/login")}
          className={styles.signIn}>Sign in</button>
          <button className={styles.createBot}>
            Create a FormBot
          </button>
        </div>
      </nav>
      <body className={styles.body}>
        <div className={styles.description}>
          <img className={styles.svgLeft} src="/svgLeft.png" alt="" />
          <div className={styles.content}>
            <h1>Build advanced chatbots visually</h1>
            <p>
              Typebot gives you powerful blocks to create unique chat
              experiences. Embed them anywhere on your web/mobile apps
              and start collecting results like magic.
            </p>
            <button className={styles.createBotButton}>
              Create a FormBot for free
            </button>
          </div>
          <img
            className={styles.svgRight}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695025/svgRight_yzszlu.png"
            alt=""
          />
        </div>
        <div className={styles.imageContainer}>
          <img
            className={styles.landingpageBanner}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734694634/landingpageBanner_a1elhi.png"
            alt=""
          />
        </div>
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.col1}>
              <h1>
                <img src="/logo.png" alt="" />
                FormBot
              </h1>
              <ul>
                <li>Made with ❤️ by @cuvette</li>
              </ul>
            </div>
            <div className={styles.col2}>
              <ul>
                <h1>Product</h1>
                <li>
                  Status{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt=""
                  />
                </li>
                <li>
                  Documentation{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt=""
                  />
                </li>
                <li>
                  Roadmap
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt=""
                  />
                </li>
                <li>
                  Pricing
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt=""
                  />
                </li>
              </ul>
            </div>
            <div className={styles.col3}>
              <h1>Community</h1>
              <ul>
                <li>
                  Discord{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt=""
                  />
                </li>
                <li>
                  GitHub repository{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt=""
                  />
                </li>
                <li>
                  Twitter{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt=""
                  />
                </li>
                <li>
                  LinkedIn{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt=""
                  />
                </li>
                <li>
                  OSS Friends{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt=""
                  />
                </li>
              </ul>
            </div>
            <div className={styles.col4}>
              <h1>Company</h1>
              <ul>
                <li>About</li>
                <li>Contact</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </section>
  );
};

export default LandingPage;
