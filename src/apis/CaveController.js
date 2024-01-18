import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem("token");

export const getCaveById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/cave/search/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching cave by ID:", error);
    throw error;
  }
};

export const searchCaves = async (name, country) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/cave/search`, {
      params: { name, country },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching caves:", error);
    throw error;
  }
};

// Function to fetch caves by geolocation coordinates
export const fetchCavesByGeolocation = async (swLat, swLng, neLat, neLng) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/cave/coordinates/geolocation?sw_lat=${swLat}&sw_lng=${swLng}&ne_lat=${neLat}&ne_lng=${neLng}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching caves by geolocation coordinates:", error);
  }
};

// Function to fetch caves by geolocation coordinates
export const fetchCaveDataByGeolocation = async (
  swLat,
  swLng,
  neLat,
  neLng
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/cave/data/geolocation?sw_lat=${swLat}&sw_lng=${swLng}&ne_lat=${neLat}&ne_lng=${neLng}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching caves by geolocation coordinates:", error);
  }
};
