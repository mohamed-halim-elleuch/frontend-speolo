import React,{useState} from 'react';


const ForgotPassword = ({show,setShow}) => {
    

  return (

      <div className={`form-container  ${show ? 'sign-in-container' : ''}`} >
      <form action="#">
      <h3>Login</h3>
        <input type="email" id="email" placeholder="Enter Your Email" required />
        <a href="#" onClick={() => {setShow(false);}}>Login Again</a>
        <button id="btnSignIn" onClick={() => {}}>Reset Password</button>
      </form>
      <div id="errorMessage" className="error-message"></div>
    </div>
  );
};

export default ForgotPassword;