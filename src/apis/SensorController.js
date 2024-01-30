import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token");

export const getSensorById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sensor/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sensor by ID:", error);
    throw error;
  }
};

export const getSensors = async (filter, skip, take, sortBy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sensor`, {
      params: { filter, skip, take, sortBy },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching sensors :", error);
    throw error;
  }
};

export const createSensor = async (sensorData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/sensor`,
      sensorData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating sensor :", error);
    if (error.response && error.response.data && error.response.data.err) {
      throw new Error(error.response.data.err);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const updateSensor = async (id, sensorData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/sensor/${id}`,
      sensorData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating sensor :", error);
    if (error.response && error.response.data && error.response.data.err) {
      throw new Error(error.response.data.err);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const deleteSensor = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/sensor/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting sensor :", error);
    throw error;
  }
};
