import { AxiosError } from "axios";
import apiService from "./apiService";

const getUserProfile = async () => {
  return await apiService.get("/user/me");
};

const updateUserProfile = async (userData: any) => {
  return await apiService.patch("/user/me", userData);
};

const getOtherUserProfile = async (userId: string) => {
  try {
    return await apiService.get(`/user/${userId}`);
  } catch (error) {
    return (error as AxiosError).response;
  }
};

// Add more user-related methods as needed

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getUserProfile,
  updateUserProfile,
  getOtherUserProfile,
  // Export other methods
};
