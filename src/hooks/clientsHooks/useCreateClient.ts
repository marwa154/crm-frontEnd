// import { createClient } from "@supabase/supabase-js";
// import { useMutation, useQueryClient } from "@tanstack/react-query";


// export const useCreateClient = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createClient,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["clients"] });
//     },
//   });
// };
