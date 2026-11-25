import ListaAssinaturas from "@/components/ListaAssinaturas";
import { serverApi } from "@/services/api/api.server";
import { Assinatura } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FaturaAssinaturas() {
  let assinaturas: Assinatura[] = [];
  let error = "";
  try {
    assinaturas = await serverApi.assinaturas.list();
  } catch (err) {
    error = err instanceof Error ? err.message : "Falha ao carregar assinaturas.";
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-gray-200">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Fatura de Assinaturas</h1>
            <p className="mt-2 text-gray-400">
              Esta base não entra no total geral das faturas. O saldo previsto reserva apenas as assinaturas ainda não lançadas neste mês.
            </p>
          </div>
          <Link href="/padroes#assinaturas" className="rounded border border-gray-600 px-4 py-2 text-sm text-blue-300 hover:bg-gray-800">
            Gerenciar assinaturas
          </Link>
        </div>
        {error ? (
          <p className="rounded border border-red-700 bg-red-900/20 p-4 text-red-300">{error}</p>
        ) : (
          <ListaAssinaturas assinaturas={assinaturas} />
        )}
      </div>
    </main>
  );
}
