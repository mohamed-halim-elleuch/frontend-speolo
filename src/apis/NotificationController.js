import axios from "axios";

const API_BASE_URL = `http://${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PORT}`;
const token = localStorage.getItem("token");

export const getNotificationById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notification/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notification by ID:", error);
    throw error;
  }
};

export const getNotifications = async (filter, skip, take, sortBy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/notification`, {
      params: { filter, skip, take, sortBy },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/*export const createNotification = async (NotificationData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/Notification`,
      NotificationData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating sensor type:", error.response.data.err);
    throw error;
  }
};*/

export const markAsReadNotification = async (ids) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notification/mark-as-read?ids=${ids}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();

    if (response.ok) {
      return { message: "Notifications marked as read successfully" };
    } else {
      return { message: "Error marking notifications as read" };
    }
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error;
  }
};
export const deleteNotification = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/notification/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
