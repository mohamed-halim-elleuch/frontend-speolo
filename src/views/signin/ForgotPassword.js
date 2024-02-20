import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  handleForgotPassword,
  handleResetPassword,
} from "../../apis/UserController";
import ShowMessage from "../common/ShowMessage";

const ForgotPassword = ({ show, setShow }) => {
  const { t } = useTranslation("translation");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleButtonClick = async () => {
    setMessage("");
    // Here you can access the email value stored in the state (variable 'email')
    try {
      const res = await handleForgotPassword({ email: email });
      setSuccess(res.success);
      setMessage(res.message);
    } catch (error) {
      // Handle any errors that occur during the request
      //console.log("error", error.err);

      setSuccess(error.success);
      setMessage(error.err);
    }
  };

  const handleButtonClick2 = async () => {
    setMessage("");
    try {
      const res = await handleResetPassword({
        otp: otp,
        newPassword: newPassword,
      });
      setSuccess(res.success);
      setMessage(res.data);
      if (res.success) {
        setShow(false);
      }
    } catch (error) {
      // Handle any errors that occur during the request
      //console.log("error", error.err);
      setSuccess(error.success);
      setMessage(error.err);
    }
  };

  return (
    <div className={`form-container  ${show ? "sign-in-container" : ""}`}>
      {message && (
        <ShowMessage
          openvalue={true}
          message={message}
          status={success ? "success" : "error"}
        />
      )}
      {success ? (
        <form action="#">
          <h3>{t("New Password")}</h3>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            placeholder={t("Your Verification Code")}
            required
          />
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder={t("New Password")}
            required
          />
          <a
            href="#"
            onClick={() => {
              setShow(false);
            }}
          >
            {t("Forget-pass.login-again")}
          </a>
          <button id="btnSignIn" onClick={handleButtonClick2}>
            {t("Forget-pass.button")}
          </button>
        </form>
      ) : (
        <form action="#">
          <h3>{t("Forget-pass.title")}</h3>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder={t("Forget-pass.email")}
            required
          />
          <a
            href="#"
            onClick={() => {
              setShow(false);
            }}
          >
            {t("Forget-pass.login-again")}
          </a>
          <button id="btnSignIn" onClick={handleButtonClick}>
            {t("Send verification code")}
          </button>
        </form>
      )}
      <div id="errorMessage" className="error-message"></div>
    </div>
  );
};

export default ForgotPassword;
