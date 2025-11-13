import axiosInstance from "./axiosInstance";

export interface LigneDevis {
  description: string;
  quantite: number;
  prixUnitaire: number;
  totalLigne: number;
}

export interface Devis {
  _id: string;
  codeUnique: string;
  clientId: {
    _id: string;
    fullName: string;
  };
  userId: string;
  status: "brouillon" | "envoyé" | "accepté" | "refusé";
  lignes: LigneDevis[];
  totalHT: number;
  tva: number;
  totalTTC: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const getDevis = async (): Promise<Devis[]> => {
  const { data } = await axiosInstance.get<Devis[]>("/devis");
  return data;
};

export const getDevisById = async (id: string): Promise<Devis> => {
  const { data } = await axiosInstance.get<Devis>(`/devis/${id}`);
  return data;
};

export const createDevis = async (
  devisData: Omit<Devis, "_id" | "createdAt" | "updatedAt">
): Promise<Devis> => {
  const { data } = await axiosInstance.post<Devis>("/devis", devisData);
  return data;
};

export const updateDevis = async (
  id: string,
  updates: Partial<Devis>
): Promise<Devis> => {
  const { data } = await axiosInstance.put<Devis>(`/devis/${id}`, updates);
  return data;
};

export const deleteDevis = async (id: string): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete<{ message: string }>(
    `/devis/${id}`
  );
  return data;
};
