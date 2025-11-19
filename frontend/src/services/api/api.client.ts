import { Categoria, CreateTransacaoPayload, Transacao } from "@/types";

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
  },

  transacoes: {
    create: async (data: CreateTransacaoPayload): Promise<Transacao> => {
      console.log("RODANDO NO CLIENTE: Enviando dados para o BFF...");

      const response = await fetch("/api/faturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar transacão via BFF");
      }
      return response.json();
    },
    remove: async (id: number) => {
      console.log("RODANDO NO CLIENTE: Enviando dados para o BFF...");

      const response = await fetch(`/api/faturas?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao remover transação via BFF");
      }

      return;
    },

    removePorCategoria: async (categoria_id: number) => {
      console.log("RODANDO NO CLIENTE: Enviando dados para o BFF...");

      const response = await fetch("/api/faturas/delete_pela_categoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoria_id }),
      });

      if (!response.ok) {
        throw new Error("Falha ao remover transações via BFF");
      }

      return;
    },
  },
};
