import axios from 'axios';


const API_BASE_URL = `http://${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PORT}`; 
const token = localStorage.getItem('token');

export const getAreaById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/area/${id}`, {
        headers: {'Authorization': `Bearer ${token}`,},
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching area by ID:', error);
    throw error;
  }
};

export const getArea = async (filter, skip, take, sortBy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/area`, {
      params: { filter, skip, take, sortBy },headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log("get area: ",response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching areas :', error);
    throw error;
  }
};


export const updateArea = async (id, areaData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/area/${id}`, areaData,{
        headers: { Authorization: `Bearer ${token}` },
      });
    return response.data;
  } catch (error) {
    console.error('Error updating area :', error);
    throw error;
  }
};

export const deleteArea = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/area/${id}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
    return response.data;
  } catch (error) {
    console.error('Error deleting area :', error);
    throw error;
  }
};

export const createArea = async (areaData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/area`, areaData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating area :', error);
      throw error;
    } 
  };