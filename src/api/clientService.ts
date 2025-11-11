import axiosInstance from "./axiosInstance";
export interface Client {
   _id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
}

export const getClients = async (): Promise<Client[]> => {
  const { data } = await axiosInstance.get<Client[]>("/clients");
  return data;
};

export const createClient = async (
  clientData: Omit<Client, "_id">
): Promise<Client> => {
  const { data } = await axiosInstance.post<Client>("/clients", clientData);
  return data;
};

export const updateClient = async (
  id: string,
  updates: Partial<Client>
): Promise<Client> => {
  const { data } = await axiosInstance.put<Client>(`/clients/${id}`, updates);
  return data;
};

export const deleteClient = async (
  id: string
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete<{ message: string }>(
    `/clients/${id}`
  );
  return data;
};
