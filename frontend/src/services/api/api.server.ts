import { Categoria } from "@/types";

const API_URL = "http://localhost:8000/api";

export const serverApi = {
  categorias: {
    list: async (): Promise<Categoria[]> => {
      console.log("RODANDO NO SERVIDOR: Buscando dados do Django...");

      const response = await fetch(`http://localhost:8000/api/categorias/`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar categorias do Django");
      }
      return response.json();
    },

    // adicionar create, update, delete aqui também
  },
};
