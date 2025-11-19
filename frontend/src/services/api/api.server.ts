import { Categoria, Saldo, Transacao } from "@/types";

const API_URL = "http://localhost:8000/api";

export const serverApi = {
  categorias: {
    get: async (id: number): Promise<Categoria> => {
      console.log("RODANDO NO SERVIDOR: Buscando dados do Django...");

      const response = await fetch(`${API_URL}/categorias/${id}`);

      if (!response.ok) {
        throw new Error("Falha ao buscar categoria do Django");
      }

      return response.json();
    },
    list: async (): Promise<Categoria[]> => {
      console.log("RODANDO NO SERVIDOR: Buscando dados do Django...");

      const response = await fetch(`${API_URL}/categorias?exclude_id=6`);

      if (!response.ok) {
        throw new Error("Falha ao buscar categorias do Django");
      }
      return response.json();
    },
  },

  saldo: {
    get: async (): Promise<number> => {
      console.log("RODANDO NO SERVIDOR: Buscando dados do Django...");

      const response = await fetch(`${API_URL}/saldo`);

      if (!response.ok) {
        throw new Error("Falha ao buscar saldo do Django");
      }

      const data: Saldo = await response.json();

      return parseFloat(data.valor_atual);
    },
  },

  transacoes: {
    list: async (): Promise<Transacao[]> => {
      console.log("RODANDO NO SERVIDOR: Buscando dados do Django...");

      const response = await fetch(
        `${API_URL}/transacoes?exclude_categoria_id=6`
      );

      if (!response.ok) {
        throw new Error("Falha ao buscar transações do Django");
      }

      return response.json();
    },

    listGastosPrevistos: async (): Promise<Transacao[]> => {
      console.log("RODANDO NO SERVIDOR: Buscando dados do Django...");

      const response = await fetch(`${API_URL}/transacoes?categoria_id=6`);

      if (!response.ok) {
        throw new Error("Falha ao buscar gastos previstos do Django");
      }

      return response.json();
    },

    getValorTotal: async (categoria_id: number): Promise<number> => {
      console.log("RODANDO NO SERVIDOR: Buscando dados do Django...");

      const response = await fetch(
        `${API_URL}/transacoes?categoria_id=${categoria_id}`
      );

      if (!response.ok) {
        throw new Error("Falha ao buscar transações do Django");
      }

      const data: Transacao[] = await response.json();

      const total: number = data.reduce(
        (totalAcumulado, transacao) =>
          totalAcumulado + parseFloat(transacao.valor),
        0
      );

      return total;
    },
  },
};
