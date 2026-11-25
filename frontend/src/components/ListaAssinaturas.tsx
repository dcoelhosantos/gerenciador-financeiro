"use client";

import { Assinatura } from "@/types";
import { clientApi } from "@/services/api/api.client";
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
        <p className="rounded border border-red-700 bg-red-900/20 p-3 text-red-300">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <h2 className="font-semibold text-green-400">Total mensal cadastrado</h2>
          <p className="text-2xl font-bold text-white">R$ {total.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <h2 className="font-semibold text-green-400">Ainda a lançar no Daniel</h2>
          <p className="text-2xl font-bold text-white">R$ {pendente.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-700">
        <ul className="divide-y divide-gray-700">
          {assinaturas.map((assinatura) => (
            <li
              key={assinatura.id}
              className="flex flex-col gap-3 bg-gray-800 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-white">{assinatura.nome}</p>
                <p className="text-sm text-gray-300">
                  R$ {Number(assinatura.valor).toFixed(2)}
                </p>
              </div>
              {assinatura.lancada_no_mes ? (
                <span className="text-sm text-green-400">
                  Já lançada na Fatura de Daniel neste mês
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => transferir(assinatura)}
                  disabled={loadingId !== null}
                  className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
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
          <p className="bg-gray-800 p-6 text-center text-gray-300">
            Nenhuma assinatura cadastrada. Adicione modelos em Gerenciar Padrões.
          </p>
        )}
      </div>
    </section>
  );
}
