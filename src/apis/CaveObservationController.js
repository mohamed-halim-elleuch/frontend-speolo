import axios from 'axios';


const API_BASE_URL = `http://${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PORT}`; 
const token = localStorage.getItem('token');

export const fetchObservationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/caveObservation/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching observation by ID:', error);
    throw error;
  }
};

// Function to search observations
export const searchObservations = async (filter, skip, take, sortBy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/caveObservation`, {
      params: { filter, skip, take, sortBy },headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error searching observations:', error);
    throw error;
  }
};

// Function to create a new observation
export const createObservation = async (observationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/caveObservation/`, observationData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating observation:', error);
    throw error;
  }
};

  // Function to upload a file
export  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API_BASE_URL}/api/caveObservation/upload`, formData, {
        headers: {
            Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


// Function to delete an observation
export const deleteObservation = async (id, force) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/caveObservation/${id}`,{
        params: { force }, headers: { Authorization: `Bearer ${token}` },
      });
    return response.data;
  } catch (error) {
    console.error('Error deleting observation:', error);
    throw error;
  }
};

 // Function to restore observations
 export const restoreObservations = async (ids) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/caveObservation/restore`, { ids , headers: { Authorization: `Bearer ${token}` }});
      return response.data;
    } catch (error) {
      console.error('Error restoring observations:', error);
    }
  };
