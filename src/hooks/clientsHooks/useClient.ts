import { useQuery } from "@tanstack/react-query";
import { getClients } from "../../api/clientService";


export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });
};
