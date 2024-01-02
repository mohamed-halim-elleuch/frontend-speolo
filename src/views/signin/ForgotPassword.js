import React,{useState} from 'react';
import { useTranslation } from 'react-i18next';


const ForgotPassword = ({show,setShow}) => {
  const {t} = useTranslation("translation");

  return (

      <div className={`form-container  ${show ? 'sign-in-container' : ''}`} >
      <form action="#">
      <h3>{t('Forget-pass.title')}</h3>
        <input type="email" id="email" placeholder={t('Forget-pass.email')} required />
        <a href="#" onClick={() => {setShow(false);}}>{t('Forget-pass.login-again')}</a>
        <button id="btnSignIn" onClick={() => {}}>{t('Forget-pass.button')}</button>
      </form>
      <div id="errorMessage" className="error-message"></div>
    </div>
  );
};

export default ForgotPassword;