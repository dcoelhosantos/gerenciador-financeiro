"use client";

import { clientApi } from "@/services/api/api.client";
import { FaturasAgrupadas, Transacao } from "@/types";
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
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
      <div className="space-y-6">
        {Object.keys(faturasAgrupadas).map((nomeCategoria) => (
          <div
            key={nomeCategoria}
            className="border border-gray-700 rounded p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold mb-3 text-green-500">
                --- FATURA DE {nomeCategoria.toUpperCase()} ---
              </h2>

              <button
                onClick={() =>
                  requestDeleteCategory(
                    nomeCategoria,
                    faturasAgrupadas[nomeCategoria].transacoes
                  )
                }
                className="text-xs bg-red-900/50 text-red-400 border border-red-800 px-3 py-1 rounded flex items-center gap-2 transition-colors"
              >
                <Eraser className="h-3 w-3" />
                Quitar Dívida Total
              </button>
            </div>

            <ul className="space-y-1">
              {faturasAgrupadas[nomeCategoria].transacoes.map((fatura) => (
                <li
                  key={fatura.id}
                  className="flex justify-between items-center"
                >
                  <span>{fatura.descricao}</span>
                  <span className="flex items-center gap-2">
                    R$ {parseFloat(fatura.valor).toFixed(2)}
                    <button onClick={() => requestDeleteSingle(fatura.id)}>
                      <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-400" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <hr className="my-3 border-gray-600" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total gasto:</span>
              <span>R$ {faturasAgrupadas[nomeCategoria].total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
