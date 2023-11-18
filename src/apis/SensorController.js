import axios from 'axios';


const API_BASE_URL = 'http://127.0.0.1:8083'; 
const token = localStorage.getItem('token');

export const getSensorById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sensor/${id}`, {
        headers: {Authorization: `Bearer ${token}` },
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching sensor by ID:', error);
    throw error;
  }
};

export const getSensors = async (filter, skip, take, sortBy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sensor`, {
      params: { filter, skip, take, sortBy },headers: {
        Authorization: `Bearer ${token}` },
    });
    console.log("get sensor: ",response);
    return response.data;
  } catch (error) {
    console.error('Error fetching sensors :', error);
    throw error;
  }
};

export const createSensor = async (sensorData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/sensor`, sensorData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating sensor :', error);
    throw error;
  } 
};

export const updateSensor = async (id, sensorData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/sensor/${id}`, sensorData,{
        headers: { Authorization: `Bearer ${token}` },
      });
    return response.data;
  } catch (error) {
    console.error('Error updating sensor :', error);
    throw error;
  }
};

export const deleteSensor = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/sensor/${id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
    return response.data;
  } catch (error) {
    console.error('Error deleting sensor :', error);
    throw error;
  }
};