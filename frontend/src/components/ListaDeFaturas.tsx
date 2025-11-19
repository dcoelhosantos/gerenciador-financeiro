"use client";

interface ListaDeFaturasProps {
  faturasAgrupadas: FaturasAgrupadas;
}

import { clientApi } from "@/services/api/api.client";
import { FaturasAgrupadas } from "@/types";
import { AlertCircle, Loader2, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ListaDeFaturas({
  faturasAgrupadas,
}: ListaDeFaturasProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (loadingId) return;

    setError(null);

    try {
      setLoadingId(id);
      await clientApi.transacoes.remove(id);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setLoadingId(null);
    }
  };
  return (
    <div>
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
            <h2 className="text-xl font-bold mb-3 text-green-500">
              --- FATURA DE {nomeCategoria.toUpperCase()} ---
            </h2>

            <ul className="space-y-1">
              {faturasAgrupadas[nomeCategoria].transacoes.map((fatura) => (
                <li
                  key={fatura.id}
                  className="flex justify-between items-center"
                >
                  <span>{fatura.descricao}</span>
                  <span className="flex items-center gap-2">
                    R$ {parseFloat(fatura.valor).toFixed(2)}
                    <button
                      onClick={() => handleDelete(fatura.id)}
                      disabled={loadingId === fatura.id}
                    >
                      {loadingId === fatura.id ? (
                        <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                      ) : (
                        <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-400" />
                      )}
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
