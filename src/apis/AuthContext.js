import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { fetchUserInfo } from './UserController';


const ipAddress = process.env.REACT_APP_API_BASE_URL;
const port = process.env.REACT_APP_PORT;


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  

  useEffect(() => {
checkAuthentication();
  }, []);

  const login = async (formSignIn,navigate) => {
    const email = formSignIn.email;
    const password = formSignIn.password;
    axios.post(`http://${ipAddress}:${port}/api/user/login`, { email ,  password })
    .then(response => {
      console.log(response);
      // Assuming the response contains a success status indicating successful login
      const data = response.data;
      if (data.success) {

      // Check to see if we stored our cookie's JWT

        // Retrieve the bearer token from the response
       const token = data.data.token;
        // Save the token to local storage or session storage for future authenticated requests
      localStorage.setItem('token', token);

        setIsAuthenticated(true);
        // Redirect to the user's dashboard
        
        navigate('user-profile');
        window.location.reload();
       
        return data;
      } else {
        // Display error message for wrong login credentials
        alert('Incorrect email or password. Please try again.');
      }
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error(error);
    });

};

  const logout = () => {
    localStorage.removeItem('token');

    // Perform your logout logic and set isAuthenticated to false
    setIsAuthenticated(false);
  };

  const register = async (formSignUp) => {
    const email = formSignUp.email;
    const password = formSignUp.password;
    const confirm_password = formSignUp.confirm_password;
    const firstName = formSignUp.firstName;
    const lastName = formSignUp.lastName;
    const license = formSignUp.license;

    
    try {
      const response = await axios.post(`http://${ipAddress}:${port}/api/user/register`, {email,password,firstName,lastName,license,});
      console.log(response.data);
      return response.data,"ok";
    } catch (error) {
      console.error(error);
    }
  };

  const checkAuthentication = () => {
    const authToken = localStorage.getItem('token');

    if (authToken) {

      setIsAuthenticated(true);
      return true;
    } else {
   
      setIsAuthenticated(false);
      return false;
    }

};

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout,checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);

export const useLogin = () => {
    const { login } = useAuth();
    return login;
  };

export const useCheckAuthentication = () => {
  const { checkAuthentication } = useAuth();
  return checkAuthentication;
};

export const useRegister = () => {
  const { register } = useAuth();
  return register;
};

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};


  /*const AuthenticatedComponent = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateUser = async () => {
      const isAuthenticated = await checkAuthentication();
      setAuthenticated(isAuthenticated);
    };

    authenticateUser();
  }, []);*/

  /*res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Ensure secure in production (requires HTTPS)
  sameSite: 'None', // Adjust according to your needs
});*/


/*  const { cookie } = req.headers;

  // Check to see if we got our cookies
  console.log(cookie);   
  
  // Handle this as you please
  if (cookie == undefined) return;
  
  const token = cookie.split("token=")[1].split(";")[0];   // Yep, it's a string
  console.log(token);    // Check to see if we stored our cookie's JWT

  // Some middleware:

  jwt.verify(token, process.env.TOKEN, (err, user) => {
    // if success upon verification,
    // issue new 'token' and 'checkToken'
  });*/