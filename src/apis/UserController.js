import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token");

export const fetchUserInfo = async () => {
  try {
    // Get the token from local storage

    // Make a request to the backend to get user information
    const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = response.data.data;
    return userData;
  } catch (error) {
    console.error("Error fetching user information", error);
  }
};

export const getUsers = async (filter, skip, take, sortBy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user`, {
      params: { filter, skip, take, sortBy },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/user`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user :", error);
    throw error;
  }
};

export const handleForgotPassword = async (forgotdata) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/forgot-password`,
      forgotdata
    );
    return response.data;
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    throw error.response.data;
  }
};

export const handleResetPassword = async (resetdata) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/user/reset-password`,
      resetdata
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error.response.data;
  }
};
