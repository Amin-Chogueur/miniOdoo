import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAuth() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await axios.get("/api/me", {
        withCredentials: true, // important: send cookies!
      });
      return res.data.user;
    },
    staleTime: 14400000,
    retry: false,
  });

  return {
    user: data,
    isLoading,
    isError,
  };
}
