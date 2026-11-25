"use client";

import { clientApi } from "@/services/api/api.client";
import { Transacao } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { AlertCircle, Eraser, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface ListaDeGastosPrevistosProps {
  gastosPrevistos: Transacao[];
}

type DeleteTarget =
  | { type: "single"; id: number }
  | { type: "category" }
  | null;

export default function ListaDeGastosPrevistos({
  gastosPrevistos,
}: ListaDeGastosPrevistosProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [error, setError] = useState<string | null>(null);

  const requestDeleteSingle = (id: number) => {
    setDeleteTarget({ type: "single", id });
  };

  const requestClearCategory = () => {
    setDeleteTarget({ type: "category" });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsLoading(true);
    setError(null);

    try {
      if (deleteTarget.type === "single") {
        await clientApi.transacoes.removeGastoPrevisto(deleteTarget.id);
      } else {
        await clientApi.transacoes.removeGastosPrevistos();
      }

      router.refresh();
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor. Tente novamente.");
      setDeleteTarget(null);
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
          deleteTarget?.type === "category" ? "Limpar gastos?" : "Apagar gasto?"
        }
        description={
          deleteTarget?.type === "category"
            ? "Tem certeza que deseja apagar TODOS os gastos previstos? Essa ação não pode ser desfeita."
            : "Tem certeza que deseja remover este gasto previsto?"
        }
        confirmText="Sim, apagar"
        isDestructive={true}
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-800 bg-rose-950/50 p-3 text-rose-200">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-white">
              Lançamentos previstos
            </h2>

            {gastosPrevistos.length > 0 && (
              <button
                onClick={requestClearCategory}
                className="flex items-center gap-2 rounded-lg border border-rose-900 bg-rose-950/30 px-3 py-2 text-xs text-rose-300 transition hover:bg-rose-950/60"
              >
                <Eraser className="h-3 w-3" />
                Limpar Gastos Previstos
              </button>
            )}
          </div>

          <ul className="space-y-1">
            {gastosPrevistos.map((gastoPrevisto) => (
              <li
                key={gastoPrevisto.id}
                className="flex items-center justify-between gap-4 border-b border-slate-700/70 py-3 last:border-0"
              >
                <span>{gastoPrevisto.descricao}</span>
                <span className="flex items-center gap-2">
                  {formatCurrency(gastoPrevisto.valor)}
                  <button onClick={() => requestDeleteSingle(gastoPrevisto.id)}>
                    <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-400" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
