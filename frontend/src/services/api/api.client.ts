import { Categoria } from "@/types";

export const clientApi = {
  categorias: {
    create: async (nome: string): Promise<Categoria> => {
      console.log("RODANDO NO CLIENTE: Enviando dados para o BFF...");

      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar categoria via BFF");
      }
      return response.json();
    },

    // (Você poderia ter um 'list' aqui também, se precisasse
    //  buscar do lado do cliente)
  },
};
