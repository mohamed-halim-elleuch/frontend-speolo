import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const SignUpRequest = async (formSignUp) => {
  const email = formSignUp.email;
  const password = formSignUp.password;

  const firstName = formSignUp.firstName;
  const lastName = formSignUp.lastName;
  const license = formSignUp.license;

  try {
    const response = await axios.post(`${API_BASE_URL}/api/user/register`, {
      email,
      password,
      firstName,
      lastName,
      license,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
