"use client";

import { clientApi } from "@/services/api/api.client";
import { Check, DollarSign, LayoutList, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardActions() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showSaldoInput, setShowSaldoInput] = useState(false);
  const [novoSaldo, setNovoSaldo] = useState("");

  const gastosPadroes = [
    {
      descricao: "Contas fixas",
      valor: 252.5,
      categoria_id: 6,
      data: new Date().toISOString().split("T")[0],
    },
    {
      descricao: "Academia",
      valor: 78,
      categoria_id: 6,
      data: new Date().toISOString().split("T")[0],
    },
    {
      descricao: "Energia",
      valor: 40,
      categoria_id: 6,
      data: new Date().toISOString().split("T")[0],
    },
  ];

  const handleAdicionarPadroes = async () => {
    if (loading) return;
    try {
      setLoading("padrao");
      await clientApi.transacoes.createGastosPadroes(gastosPadroes);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar gastos padrões");
    } finally {
      setLoading(null);
    }
  };

  const handleAtualizarSaldo = async () => {
    if (!novoSaldo) return;
    try {
      setLoading("saldo");
      await clientApi.saldo.update(parseFloat(novoSaldo));
      setShowSaldoInput(false);
      setNovoSaldo("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar saldo");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
      <button
        onClick={handleAdicionarPadroes}
        disabled={!!loading}
        className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
      >
        {loading === "padrao" ? (
          <Loader2 className="animate-spin" />
        ) : (
          <LayoutList />
        )}
        Adicionar Gastos Padrões
      </button>

      {showSaldoInput ? (
        <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg border border-gray-600 animate-in fade-in slide-in-from-left-4">
          <input
            type="number"
            step="0.01"
            placeholder="Novo valor..."
            value={novoSaldo}
            onChange={(e) => setNovoSaldo(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded-md outline-none w-32"
            autoFocus
          />
          <button
            onClick={handleAtualizarSaldo}
            disabled={!!loading}
            className="bg-green-600 hover:bg-green-700 p-2 rounded-md text-white"
          >
            {loading === "saldo" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setShowSaldoInput(false)}
            className="bg-red-600/80 hover:bg-red-700 p-2 rounded-md text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowSaldoInput(true)}
          disabled={!!loading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <DollarSign />
          Atualizar Saldo
        </button>
      )}
    </div>
  );
}
