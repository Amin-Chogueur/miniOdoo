"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

type LogoutButtonPropsType = {
  onCloseMenu: (arg: boolean) => void;
};

export default function LogoutButton({ onCloseMenu }: LogoutButtonPropsType) {
  const router = useRouter();

  // ✅ Use TanStack Query mutation for logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.get("/api/logout");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Déconnexion réussie");
      router.replace("/signin");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la déconnexion");
    },
  });

  return (
    <button
      disabled={logoutMutation.isPending}
      onClick={() => {
        logoutMutation.mutate();
        onCloseMenu(false);
      }}
      className="disabled:bg-gray-600 mt-auto px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 cursor-pointer flex gap-1 justify-center items-center"
    >
      {logoutMutation.isPending && <FiLoader className="animate-spin" />}
      Logout
    </button>
  );
}
