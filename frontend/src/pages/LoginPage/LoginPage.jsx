import styles from "./loginpage.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useScreenSize from "../../customHooks/useScreenSize";

import {
  validateEmail,
  validatePassword,
} from "../../errorHandler/inputError";
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const isMobile = useScreenSize(768);
  const [userData, setUserDataState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDataState({
      ...userData,
      [name]: value,
    });
  };

  const handleRegisterLink = () => {
    setIsLogin(!isLogin);
    setErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { email, password } = userData;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    let confirmPasswordError = "";
    if(password!==confirmPassword){
      confirmPasswordError = "Passwords do not match";
    }else confirmPasswordError = "";
    if (emailError || passwordError) {
      setErrors({
        email: emailError.error,
        password: passwordError.error,
        confirmPassword: confirmPasswordError,
      });
    } else {
      navigate("/");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = userData;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
   
    if (emailError || passwordError) {
      setErrors({
        email: emailError.error,
        password: passwordError.error,
      });
    } else {
      navigate("/");
    }
  };

  return (
    <section className={styles.loginPage}>
      <nav>
        <div
          className={styles.arrowBox}
          role="button"
          onClick={() => window.history.back() || navigate("/")}
        >
          <img src="/arrow_back.png" alt="Back Arrow" />
        </div>
      </nav>
      <div className={styles.behindContainer}>
        {!isMobile && (
          <img
            className={styles.leftImage}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695323/Group_2_xyq7d6.png"
            alt="left image"
          />
        )}

        {isMobile && isLogin && (
          <img
            className={styles.leftImage}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695323/Group_2_xyq7d6.png"
            alt="left image"
          />
        )}

        <img
          className={styles.rightImage}
          src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695312/Ellipse_2_2_dqzsgo.png"
          alt="right image"
        />
        <img
          className={styles.bottomImage}
          src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695305/Ellipse_1_fqeayv.png"
          alt="bottom image"
        />
      </div>
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <>
            {!isLogin && (
              <div className={styles.userNameForm}>
                <label htmlFor="">Username</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter a username"
                />
              </div>
            )}

            <div className={styles.emailForm}>
              <label htmlFor="">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <div className={styles.error}>{errors.email}</div>
            </div>
            <div className={styles.passwordForm}>
              <label htmlFor="">Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="xxxxxxxxx"
              />
              <div className={styles.error}>{errors.password}</div>
            </div>

            {!isLogin && (
              <div className={styles.passwordForm}>
                <label htmlFor="">Confirm Password</label>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type="password"
                  name="password"
                  placeholder="xxxxxxxxx"
                />
                 <div className={styles.error}>{errors.confirmPassword}</div>
              </div>
            )}
{isLogin ?(  <button
              onClick={handleLogin}
              className={styles.loginButton}
            >
              Log In 
            </button>):(
                  <button
                  onClick={handleRegister}
                  className={styles.loginButton}
                >
                  Sign Up
                </button>
            )}
          
            <h3 className={styles.orText}>OR</h3>
            <button className={styles.loginButton}>
              <div>
                <img
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695317/Google_Icon_gcxyt5.png"
                  alt="google icon"
                />
              </div>
              Sign In with Google
            </button>
            {!isLogin ? (
              <div className={styles.signUpText}>
                <p>Already have an account ? </p>
                <a
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRegisterLink();
                  }}
                  href=""
                >
                  Login
                </a>
              </div>
            ) : (
              <div className={styles.signUpText}>
                <p>Don’t have an account?</p>
                <a
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRegisterLink();
                  }}
                  href=""
                >
                  Register now
                </a>
              </div>
            )}
          </>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
