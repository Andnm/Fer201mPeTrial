import axios from "axios";

const API_URL = "http://localhost:9999";

export const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
};

export const fetchTodoData = async () => {
  try {
    const response = await axios.get(`${API_URL}/todo`);
    return response.data;
  } catch (error) {
    console.error("Error fetching todo data:", error);
    return [];
  }
};

export const updateTodoStatus = async (todoId, item, status) => {
  try {
    const response = await axios.put(`${API_URL}/todo/${todoId}`, {
      ...item,
      completed: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating todo status:", error);
    return null;
  }
};
