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
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-300">Base mensal</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Fatura de Assinaturas</h1>
            <p className="mt-2 max-w-2xl text-slate-400">
              Esta base não entra no total geral das faturas. O saldo previsto reserva apenas as assinaturas ainda não lançadas neste mês.
            </p>
          </div>
          <Link href="/padroes#assinaturas" className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-slate-700">
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
