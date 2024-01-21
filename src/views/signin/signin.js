import { Alert, Grid } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../apis/AuthContext";
import { SignUpRequest } from "../../apis/authentication";
import { LanguageSelector } from "../Navbar/LanguageSelector";
import ForgotPassword from "./ForgotPassword";
import "./signin.css";

const SignIn = () => {
  const login = useLogin();
  const { t } = useTranslation("translation");
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [formSignUp, setFormSignUp] = useState({
    firstName: "",
    lastName: "",
    email: "",
    license: "",
    password: "",
    confirm_password: "",
  });
  const [formSignIn, setFormSignIn] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
    setMessage("");
    setCheckPassword(false);
  };

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setIsRightPanelActive(false);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleChangeSignUp = (e) => {
    const { name, value } = e.target;
    setFormSignUp((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleChangeSignIn = (e) => {
    const { id, value } = e.target;
    setFormSignIn((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const userData = await login(formSignIn, navigate);
    } catch (error) {
      setCheckPassword(true);
      setMessage(error.message);
      setState({ vertical: "top", horizontal: "center", open: true });
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (formSignUp.password !== formSignUp.confirm_password) {
      setCheckPassword(true);
      setMessage("Passwords don't match. Please try again!");
      setState({ vertical: "top", horizontal: "center", open: true });
    }
    try {
      const userData = await SignUpRequest(formSignUp);

      if (userData.success) {
        handleSignInClick();
        setFormSignIn((prevData) => ({
          ...prevData,
          email: formSignUp.email,
          password: formSignUp.password,
        }));
      }
    } catch (error) {
      setCheckPassword(true);
      setMessage(error.message);
      setState({ vertical: "top", horizontal: "center", open: true });
    }
  };

  return (
    <div className="sign">
      {checkPassword ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}

      <Grid
        container
        spacing={12}
        alignItems="center"
        justifyContent="flex-end"
      >
        <Grid item xs={6} md={1}>
          {" "}
        </Grid>
        <Grid item xs={6} md={10}>
          <h4 className="heading">{t("Login.big-title")}</h4>
        </Grid>
        <Grid item xs={6} md={1}>
          <LanguageSelector color="white" />
        </Grid>
      </Grid>
      <br />

      <div
        className={`containers ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        <div
          className={`form-container sign-up-container ${
            isRightPanelActive ? "right-panel-active" : ""
          }`}
        >
          <form onSubmit={handleSignUp}>
            <h3>{t("Signup.title")}</h3>

            <input
              type="text"
              placeholder={t("Signup.first-name")}
              name="firstName"
              required
              value={formSignUp.firstName}
              onChange={handleChangeSignUp}
            />
            <input
              type="text"
              placeholder={t("Signup.last-name")}
              name="lastName"
              required
              value={formSignUp.lastName}
              onChange={handleChangeSignUp}
            />
            <input
              type="email"
              placeholder={t("Signup.email")}
              name="email"
              required
              value={formSignUp.email}
              onChange={handleChangeSignUp}
            />
            <input
              type="text"
              placeholder={t("Signup.license")}
              name="license"
              value={formSignUp.license}
              onChange={handleChangeSignUp}
            />
            <input
              type="password"
              placeholder={t("Signup.password")}
              name="password"
              required
              value={formSignUp.password}
              onChange={handleChangeSignUp}
            />
            <input
              type="password"
              placeholder={t("Signup.confirm-pass")}
              name="confirm_password"
              required
              value={formSignUp.confirm_password}
              onChange={handleChangeSignUp}
            />
            <div className="container ">
              <button type="submit">{t("Signup.button")}</button>
            </div>
          </form>
          <div id="successMessage" className="success-message"></div>
        </div>

        <div
          className={`form-container sign-in-container ${
            !isRightPanelActive ? "right-panel-active" : ""
          }`}
        >
          <form onSubmit={handleSignIn}>
            <h3>{t("Login.title")}</h3>
            <input
              type="email"
              id="email"
              placeholder={t("Login.email")}
              required
              value={formSignIn.email}
              onChange={handleChangeSignIn}
            />
            <input
              type="password"
              id="password"
              placeholder={t("Login.password")}
              required
              value={formSignIn.password}
              onChange={handleChangeSignIn}
            />
            <div className="password-message"></div>
            <a
              href="#"
              className="forgot-password-link"
              onClick={handleForgotPasswordClick}
            >
              {t("Login.forget")}
            </a>
            <button id="btnSignIn" type="submit">
              {t("Login.button")}
            </button>
          </form>

          <div id="errorMessage" className="error-message"></div>
        </div>
        <ForgotPassword
          show={showForgotPassword}
          setShow={setShowForgotPassword}
        />

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left left-panel">
              <h3>{t("Login.welcome")}</h3>
              <p>{t("Login.text")}</p>
              <button className="ghost" id="signIn" onClick={handleSignInClick}>
                {t("Login.button")}
              </button>
            </div>
            <div className="overlay-panel overlay-right right-panel">
              <h3>{t("Signup.welcome")}</h3>
              <p>{t("Signup.text")}</p>
              <button className="ghost" id="signUp" onClick={handleSignUpClick}>
                {t("Signup.button")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
