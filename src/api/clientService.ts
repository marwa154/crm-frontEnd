// api/clientService.ts
import axiosInstance from "./axiosInstance";

// 👇 Define your Client type once (adjust fields as needed)
export interface Client {
  nomComplet: string;
  société: string;
  email: string;
  téléphone: string;
  adresse: string;
  ville: string;
  codePostal: string;
}

export const getClients = async (): Promise<Client[]> => {
  const { data } = await axiosInstance.get<Client[]>("/clients");
  return data;
};

// 👇 Create a new client
export const createClient = async (clientData: Omit<Client, "_id">): Promise<Client> => {
  const { data } = await axiosInstance.post<Client>("/clients", clientData);
  return data;
};

// 👇 Update a client
export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
  const { data } = await axiosInstance.put<Client>(`/clients/${id}`, updates);
  return data;
};

// 👇 Delete a client
export const deleteClient = async (id: string): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete<{ message: string }>(`/clients/${id}`);
  return data;
};
