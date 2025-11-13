import axiosInstance from "./axiosInstance";

export interface Stats {
  totalClients: number;
  devisAcceptes: number;
  facturesPayees: number;
  revenusTotaux: number;
  evolution: {
    clients: string;
    devis: string;
    factures: string;
    revenus: string;
  };
  ventesMensuelles:any;
}

export const getStats = async (): Promise<Stats> => {
  const { data } = await axiosInstance.get<Stats>("/stats");
  return data;
};
