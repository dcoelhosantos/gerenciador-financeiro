"use client";

import { Assinatura } from "@/types";
import { clientApi } from "@/services/api/api.client";
import { formatCurrency } from "@/utils/formatCurrency";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ListaAssinaturas({
  assinaturas,
}: {
  assinaturas: Assinatura[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const transferir = async (assinatura: Assinatura) => {
    setLoadingId(assinatura.id);
    setError("");
    try {
      await clientApi.assinaturas.transferir(assinatura.id);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível transferir a assinatura."
      );
    } finally {
      setLoadingId(null);
    }
  };

  const total = assinaturas.reduce((sum, item) => sum + Number(item.valor), 0);
  const pendente = assinaturas
    .filter((item) => !item.lancada_no_mes)
    .reduce((sum, item) => sum + Number(item.valor), 0);

  return (
    <section className="space-y-6">
      {error && (
        <p className="rounded-xl border border-rose-800 bg-rose-950/50 p-3 text-rose-200">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
          <h2 className="font-semibold text-violet-300">Total mensal cadastrado</h2>
          <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(total)}</p>
        </div>
        <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-5">
          <h2 className="font-semibold text-violet-200">Ainda a lançar no Daniel</h2>
          <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(pendente)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700">
        <ul className="divide-y divide-slate-700">
          {assinaturas.map((assinatura) => (
            <li
              key={assinatura.id}
              className="flex flex-col gap-3 bg-slate-800/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-white">{assinatura.nome}</p>
                <p className="text-sm text-slate-400">
                  {formatCurrency(assinatura.valor)}
                </p>
              </div>
              {assinatura.lancada_no_mes ? (
                  <span className="text-sm text-emerald-300">
                  Já lançada na Fatura de Daniel neste mês
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => transferir(assinatura)}
                  disabled={loadingId !== null}
                  className="rounded-lg border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/25 disabled:opacity-50"
                >
                  {loadingId === assinatura.id ? (
                    <Loader2 className="inline h-4 w-4 animate-spin" />
                  ) : (
                    "Lançar na Fatura de Daniel"
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>
        {assinaturas.length === 0 && (
          <p className="bg-slate-800 p-6 text-center text-slate-300">
            Nenhuma assinatura cadastrada. Adicione modelos em Gerenciar Padrões.
          </p>
        )}
      </div>
    </section>
  );
}
