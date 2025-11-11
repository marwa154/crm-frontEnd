import axiosInstance from "./axiosInstance";

export interface User {
  _id: string; 
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'employee';
}

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axiosInstance.get<User[]>("/users");
  return data;
};

export const createUser = async (
  userData: Omit<User, "_id">
): Promise<User> => {
  const { data } = await axiosInstance.post<User>("/users", userData);
  return data;
};

export const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User> => {
  const { data } = await axiosInstance.put<User>(`/users/${id}`, updates);
  return data;
};


export const deleteUser = async (
  id: string
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete<{ message: string }>(
    `/users/${id}`
  );
  return data;
};
