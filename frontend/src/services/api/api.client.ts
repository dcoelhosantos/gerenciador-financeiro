import {
  Assinatura,
  Categoria,
  CreateTransacaoPayload,
  GastoPadrao,
  Transacao,
} from "@/types";

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

    createContasSpotify: async () => {
      const response = await fetch("/api/acoes/adicionar-spotify", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Falha ao adicionar as contas Spotify");
      return response.json() as Promise<{ criadas: number }>;
    },
  },

  gastosPadroes: {
    create: async (item: { descricao: string; valor: number }) => {
      const response = await fetch("/api/gastos/padroes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json() as Promise<GastoPadrao>;
    },
    update: async (id: number, item: { descricao: string; valor: number }) => {
      const response = await fetch(`/api/gastos/padroes?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json() as Promise<GastoPadrao>;
    },
    remove: async (id: number) => {
      const response = await fetch(`/api/gastos/padroes?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await response.text());
    },
  },

  assinaturas: {
    create: async (item: { nome: string; valor: number }) => {
      const response = await fetch("/api/assinaturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json() as Promise<Assinatura>;
    },
    update: async (id: number, item: { nome: string; valor: number }) => {
      const response = await fetch(`/api/assinaturas?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json() as Promise<Assinatura>;
    },
    remove: async (id: number) => {
      const response = await fetch(`/api/assinaturas?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await response.text());
    },
    transferir: async (id: number) => {
      const response = await fetch(`/api/assinaturas/transferir?id=${id}`, {
        method: "POST",
      });
      if (!response.ok) {
        let message = await response.text();
        try {
          message = JSON.parse(message).detail ?? message;
        } catch {
          // Mantém o texto original quando a resposta não é JSON.
        }
        if (response.status === 409) {
          throw new Error("Essa assinatura já foi lançada neste mês.");
        }
        throw new Error(message);
      }
      return response.json() as Promise<Transacao>;
    },
  },
};
