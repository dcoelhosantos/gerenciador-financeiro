import GerenciarPadroes from "@/components/GerenciarPadroes";
import { serverApi } from "@/services/api/api.server";
import { Assinatura, GastoPadrao } from "@/types";

export const dynamic = "force-dynamic";

export default async function Padroes() {
  let gastos: GastoPadrao[] = [];
  let assinaturas: Assinatura[] = [];
  let error = "";
  try {
    [gastos, assinaturas] = await Promise.all([
      serverApi.gastosPadroes.list(),
      serverApi.assinaturas.list(),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Falha ao carregar os padrões.";
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8 text-gray-200">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-2xl font-bold text-white">Gerenciar Padrões</h1>
        <p className="mb-8 text-gray-400">
          Edite os modelos usados pelos botões; alterações aqui não modificam lançamentos já feitos.
        </p>
        {error ? (
          <p className="mb-6 rounded border border-red-700 bg-red-900/20 p-4 text-red-300">{error}</p>
        ) : null}
        <GerenciarPadroes gastosIniciais={gastos} assinaturasIniciais={assinaturas} />
      </div>
    </main>
  );
}
