"use client";

import { clientApi } from "@/services/api/api.client";
import { FaturasAgrupadas, Transacao } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { AlertCircle, Eraser, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface ListaDeFaturasProps {
  faturasAgrupadas: FaturasAgrupadas;
}

type DeleteTarget =
  | { type: "single"; id: number }
  | { type: "category"; name: string; firstId: number }
  | null;

export default function ListaDeFaturas({
  faturasAgrupadas,
}: ListaDeFaturasProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [error, setError] = useState<string | null>(null);

  const requestDeleteSingle = (id: number) => {
    setDeleteTarget({ type: "single", id });
  };

  const requestDeleteCategory = (
    nomeCategoria: string,
    transacoes: Transacao[]
  ) => {
    if (!transacoes || transacoes.length === 0) return;
    const categoryId = transacoes[0].categoria.id;
    setDeleteTarget({
      type: "category",
      name: nomeCategoria,
      firstId: categoryId,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsLoading(true);
    setError(null);

    try {
      if (deleteTarget.type === "single") {
        await clientApi.transacoes.remove(deleteTarget.id);
      } else {
        await clientApi.transacoes.removePorCategoria(deleteTarget.firstId);
      }

      router.refresh();
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor. Tente novamente. ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
        title={
          deleteTarget?.type === "category"
            ? "Limpar tudo?"
            : "Apagar transação?"
        }
        description={
          deleteTarget?.type === "category"
            ? `Tem certeza que deseja apagar TODAS as transações de "${deleteTarget.name}"? Essa ação não pode ser desfeita.`
            : "Tem certeza que deseja remover esta transação?"
        }
        confirmText="Sim, apagar"
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-800 bg-rose-950/50 p-3 text-rose-200">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
      <div className="space-y-5">
        {Object.keys(faturasAgrupadas).map((nomeCategoria) => (
          <div
            key={nomeCategoria}
            className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 sm:p-6"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-white">
                Fatura de {nomeCategoria}
              </h2>

              <button
                onClick={() =>
                  requestDeleteCategory(
                    nomeCategoria,
                    faturasAgrupadas[nomeCategoria].transacoes
                  )
                }
                className="flex items-center gap-2 rounded-lg border border-rose-900 bg-rose-950/30 px-3 py-2 text-xs text-rose-300 transition hover:bg-rose-950/60"
              >
                <Eraser className="h-3 w-3" />
                Quitar Dívida Total
              </button>
            </div>

            <ul className="space-y-1">
              {faturasAgrupadas[nomeCategoria].transacoes.map((fatura) => (
                <li
                  key={fatura.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-700/70 py-3 last:border-0"
                >
                  <span>{fatura.descricao}</span>
                  <span className="flex items-center gap-2">
                    {formatCurrency(fatura.valor)}
                    <button onClick={() => requestDeleteSingle(fatura.id)}>
                      <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-400" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex justify-between border-t border-slate-700 pt-4 font-semibold">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white">{formatCurrency(faturasAgrupadas[nomeCategoria].total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
