import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClient } from "../../api/clientService";


export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
