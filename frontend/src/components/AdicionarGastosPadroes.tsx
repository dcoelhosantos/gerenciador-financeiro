"use client";

import { clientApi } from "@/services/api/api.client";
import { GastoPadrao } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { Loader2, ListPlus, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdicionarGastosPadroes({
  gastos,
}: {
  gastos: GastoPadrao[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const total = gastos.reduce((sum, item) => sum + Number(item.valor), 0);

  const adicionar = async () => {
    if (!gastos.length) {
      setError("Cadastre pelo menos um gasto padrão antes de adicioná-los.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await clientApi.transacoes.createGastosPadroes(
        gastos.map((gasto) => ({
          descricao: gasto.descricao,
          valor: Number(gasto.valor),
          categoria_id: 6,
          data: new Date().toISOString().slice(0, 10),
        }))
      );
      router.refresh();
    } catch {
      setError("Não foi possível adicionar os gastos padrão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-700 bg-slate-800/70 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-white">
          <ListPlus className="h-5 w-5 text-emerald-400" />
          <h2 className="font-semibold">Gastos padrão</h2>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          {gastos.length} itens · {formatCurrency(total)} no total. Os lançamentos serão adicionados a esta lista.
        </p>
        {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/padroes#gastos"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-slate-700"
        >
          <Settings2 className="h-4 w-4" />
          Gerenciar padrões
        </Link>
        <button
          type="button"
          onClick={adicionar}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListPlus className="h-4 w-4" />}
          Adicionar à lista
        </button>
      </div>
    </section>
  );
}
