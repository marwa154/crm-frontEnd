import { useQuery } from "@tanstack/react-query";
import { getDevis } from "../../api/devisService";

export const useDevis = () => {
  return useQuery({
    queryKey: ["devis"],
    queryFn: getDevis,

  });
};
