"use client";

import { clientApi } from "@/services/api/api.client";
import { Transacao } from "@/types";
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
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
      <div className="space-y-6">
        <div className="border border-gray-700 rounded p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold mb-3 text-green-500">
              --- GASTOS PREVISTOS ---
            </h2>

            {gastosPrevistos.length > 0 && (
              <button
                onClick={requestClearCategory}
                className="text-xs bg-red-900/50 text-red-400 border border-red-800 px-3 py-1 rounded flex items-center gap-2 transition-colors hover:bg-red-900/70"
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
                className="flex justify-between items-center"
              >
                <span>{gastoPrevisto.descricao}</span>
                <span className="flex items-center gap-2">
                  R$ {parseFloat(gastoPrevisto.valor).toFixed(2)}
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
