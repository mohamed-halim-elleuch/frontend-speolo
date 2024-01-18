import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token");

export const getSensorTypeById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sensorType/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sensor type by ID:", error);
    throw error;
  }
};

export const getSensorTypes = async (filter, skip, take, sortBy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sensorType`, {
      params: { filter, skip, take, sortBy },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching sensor types 2:", error);
    throw error;
  }
};

export const createSensorType = async (sensorTypeData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/sensorType`,
      sensorTypeData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating sensor type:", error.response.data.err);
    throw error;
  }
};

export const updateSensorType = async (id, sensorTypeData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/sensorType/${id}`,
      sensorTypeData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating sensor type:", error);
    throw error;
  }
};

export const deleteSensorType = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/sensorType/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting sensor type:", error);
    throw error;
  }
};
