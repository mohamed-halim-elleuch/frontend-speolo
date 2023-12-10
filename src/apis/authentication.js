
import axios from 'axios';


const ipAddress = process.env.REACT_APP_API_BASE_URL;
const port = process.env.REACT_APP_PORT;

export const SignUpRequest = async (formSignUp) => {
    const email = formSignUp.email;
    const password = formSignUp.password;

    const firstName = formSignUp.firstName;
    const lastName = formSignUp.lastName;
    const license = formSignUp.license;

    
    try {
      const response = await axios.post(`http://${ipAddress}:${port}/api/user/register`, {email,password,firstName,lastName,license,});
      console.log('first ',response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };


  