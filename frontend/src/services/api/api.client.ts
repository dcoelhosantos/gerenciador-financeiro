import { Categoria, CreateTransacaoPayload, Transacao } from "@/types";

export const clientApi = {
  saldo: {
    update: async (novoValor: number) => {
      console.log("RODANDO NO CLIENTE: Enviando dados para o BFF...");

      const response = await fetch("/api/saldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: novoValor }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar saldo via BFF");
      }
      return;
    },
  },

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

    createGastoPrevisto: async (
      data: CreateTransacaoPayload
    ): Promise<Transacao> => {
      console.log("RODANDO NO CLIENTE: Enviando dados para o BFF...");

      const response = await fetch("/api/gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar gasto previsto via BFF");
      }
      return response.json();
    },

    createGastosPadroes: async (transacoes: CreateTransacaoPayload[]) => {
      console.log("RODANDO NO CLIENTE: Enviando dados para o BFF...");

      const response = await fetch("/api/gastos/gastos_padroes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transacoes),
      });

      if (!response.ok) {
        throw new Error("Falha ao adicionar gastos padrões via BFF");
      }
      return;
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

    removeGastoPrevisto: async (id: number) => {
      console.log("RODANDO NO CLIENTE: Enviando dados para o BFF...");

      const response = await fetch(`/api/gastos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao remover gasto previsto via BFF");
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

    removeGastosPrevistos: async () => {
      console.log("RODANDO MO CLIENTE: Enviando dados para o BFF...");

      const response = await fetch("/api/gastos/limpar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 6 }),
      });

      if (!response.ok) {
        throw new Error("Falha ao remover gastos previstos via BFF");
      }

      return;
    },
  },
};
