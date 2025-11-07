import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/authService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),

    onSuccess: (data) => {
      const { _id, name, email, role, token } = data;
      login({ _id, name, email, role }, token);
      navigate("/dashboard");
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Invalid credentials. Please try again.";
      console.error("Login error:", message);
    },
  });
};
