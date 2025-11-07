import axiosInstance from "./axiosInstance";

export const loginUser = async (email: string, password: string) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return data;
};
