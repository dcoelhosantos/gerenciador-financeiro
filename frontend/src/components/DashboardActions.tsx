"use client";

import { clientApi } from "@/services/api/api.client";
import { formatCurrency } from "@/utils/formatCurrency";
import { Check, DollarSign, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardActions({
  saldoAtual,
}: {
  saldoAtual: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [valor, setValor] = useState(String(saldoAtual));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const salvar = async () => {
    const novoSaldo = Number(valor);
    if (!Number.isFinite(novoSaldo) || novoSaldo < 0) {
      setError("Informe um saldo válido.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await clientApi.saldo.update(novoSaldo);
      setEditing(false);
      router.refresh();
    } catch {
      setError("Não foi possível atualizar o saldo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">Saldo atual</p>
          {!editing && (
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {formatCurrency(saldoAtual)}
            </p>
          )}
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => { setValor(String(saldoAtual)); setEditing(true); }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-400 hover:bg-slate-700"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </button>
        )}
      </div>
      {editing && (
        <div className="mt-4 flex gap-2">
          <label className="relative min-w-0 flex-1">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              type="number"
              min="0"
              step="0.01"
              value={valor}
              onChange={(event) => setValor(event.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 py-2 pl-9 pr-3 text-white outline-none focus:border-emerald-500"
              aria-label="Novo saldo atual"
            />
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={salvar}
            aria-label="Salvar saldo"
            className="rounded-lg bg-emerald-600 px-3 text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => { setEditing(false); setError(""); }}
            aria-label="Cancelar edição do saldo"
            className="rounded-lg border border-slate-600 px-3 text-slate-300 transition hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </section>
  );
}
