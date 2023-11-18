import '../css/signin.css';
import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';
import { SignInRequest, SignUpRequest } from '../../apis/authentication';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { useLogin } from '../../apis/AuthContext';

const SignIn = () => {
  const login = useLogin();
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [checkPassword, setCheckPassword] = useState(false);
    const [formSignUp, setFormSignUp] = useState({firstName: '',lastName: '',email: '',license:'',password:'',confirm_password:''});
    const [formSignIn, setFormSignIn] = useState({email:'' ,password:''});
    const navigate = useNavigate();
   
    const [state, setState] = React.useState({open: false,vertical: 'top',horizontal: 'center',});
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
      setState({ ...state, open: false });
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
      setFormSignUp((prevData) => ({...prevData,[name]: value,}));
    };
    const handleChangeSignIn = (e) => {
      const { id, value } = e.target;
      setFormSignIn((prevData) => ({...prevData,[id]: value,}));
    };

    const handleSignIn = async (event) => {
      event.preventDefault();
      try {
        const userData = login(formSignIn,navigate);
        console.log('User data:', userData);
      } catch (error) {
        console.error('Login failed', error);
      }
    };

    const handleSignUp = async (event) => {
      event.preventDefault();
      if (formSignUp.password !== formSignUp.confirm_password) {
        setCheckPassword(true);
        setState({vertical: 'top',horizontal: 'center',  open: true });
        console.log('check password', checkPassword);
      }
      try {
        const userData = await SignUpRequest(formSignUp);
        
        if (userData.success){
        handleSignInClick();
        setFormSignIn((prevData) => ({...prevData,"email": formSignUp.email,"password":formSignUp.password}));
        
      } 
      } catch (error) {
        console.error('Login failed', error);
      }
    };


  return (
    <div className="sign">
                {checkPassword ?       <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} onClose={handleClose} message="Passwords don't match. Please try again!" key={vertical + horizontal} >
                                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>Passwords don't match. Please try again!
                                            </Alert></Snackbar> : <></>}
            <h4 className="heading">WELCOME TO THE DATABASE DEDICATED TO CAVING</h4>
              <div className={`containers ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
                <div className={`form-container sign-up-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
                  
        <form onSubmit={handleSignUp}>
          <h3>Create Account</h3>

          <input type="text" placeholder="First Name" name="firstName" required value={formSignUp.firstName} onChange={handleChangeSignUp}/>
          <input type="text" placeholder="Last Name" name="lastName" required value={formSignUp.lastName} onChange={handleChangeSignUp}/>
          <input type="email" placeholder="Email" name="email" required value={formSignUp.email} onChange={handleChangeSignUp}/>
          <input type="text" placeholder="License" name="license" value={formSignUp.license} onChange={handleChangeSignUp} />
          <input type="password" placeholder="Password" name="password" required value={formSignUp.password} onChange={handleChangeSignUp}/>
          <input type="password" placeholder="Confirm Password" name="confirm_password" required value={formSignUp.confirm_password} onChange={handleChangeSignUp}/>
          <div className="container ">
            <button type="submit" >Sign Up</button>
          </div>
        </form>
                  <div id="successMessage" className="success-message"></div>
                </div>

  <div className={`form-container sign-in-container ${!isRightPanelActive ? 'right-panel-active' : ''}`}>

        <form onSubmit={handleSignIn}>
        <h3>Login</h3>
          <input type="email" id="email" placeholder="Enter Your Email" required value={formSignIn.email} onChange={handleChangeSignIn}/>
          <input type="password" id="password" placeholder="Enter Your Password" required value={formSignIn.password} onChange={handleChangeSignIn}/>
          <div className="password-message"></div>
          <a href="#" className="forgot-password-link" onClick={handleForgotPasswordClick}>Forgot your password?</a>
          <button id="btnSignIn" type="submit" >Sign In</button>
        </form>

    <div id="errorMessage" className="error-message"></div>
  </div>
  <ForgotPassword show={showForgotPassword} setShow={setShowForgotPassword}/>

  <div className="overlay-container">
    <div className="overlay">
      <div className="overlay-panel overlay-left left-panel">
        <h3>Welcome Back!</h3>
        <p>To keep connected with us please login with your details</p>
        <button className="ghost" id="signIn" onClick={handleSignInClick}>
          Sign In
        </button>
      </div>
      <div className="overlay-panel overlay-right right-panel">
        <h3>Create Your Account</h3>
        <p>Enter your details and start a journey as a caver</p>
        <button className="ghost" id="signUp" onClick={handleSignUpClick}>
          Sign Up
        </button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default SignIn;
