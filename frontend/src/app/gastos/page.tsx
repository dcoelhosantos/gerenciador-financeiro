import AdicionarGastosPadroes from "@/components/AdicionarGastosPadroes";
import FormularioTransacao from "@/components/FormularioTransacao";
import ListaDeGastosPrevistos from "@/components/ListaDeGastosPrevistos";
import { serverApi } from "@/services/api/api.server";
import { Categoria, GastoPadrao, Transacao } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

export const dynamic = "force-dynamic";

export default async function Gastos() {
  let gastosPrevistos: Transacao[] = [];
  let categorias: Categoria[] = [];
  let gastosPadroes: GastoPadrao[] = [];
  let error: string | null = null;

  try {
    const [gastosPrevistosData, categoriaData, gastosPadroesData] = await Promise.all([
      serverApi.transacoes.listGastosPrevistos(),
      serverApi.categorias.get(6),
      serverApi.gastosPadroes.list(),
    ]);
    gastosPrevistos = gastosPrevistosData;
    categorias.push(categoriaData);
    gastosPadroes = gastosPadroesData;
  } catch (err) {
    if (err instanceof Error) error = err.message;
  }

  const totalGastosPrevistos = gastosPrevistos.reduce(
    (acc, gastoPrevisto) => acc + parseFloat(gastoPrevisto.valor),
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="mb-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Planejamento</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Gastos previstos</h1>
          <p className="mt-2 max-w-2xl text-slate-400">Registre despesas que ainda vão sair do saldo e carregue seus padrões diretamente nesta lista.</p>
        </header>

        {error && (
          <p className="rounded-xl border border-rose-800 bg-rose-950/50 p-4 text-rose-200">
            Erro ao carregar gastos: {error}
          </p>
        )}

        <AdicionarGastosPadroes gastos={gastosPadroes} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
          <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 sm:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Sua lista</h2>
                <p className="mt-1 text-sm text-slate-400">O total atualiza o saldo previsto.</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
                <p className="text-xl font-bold text-amber-200">{formatCurrency(totalGastosPrevistos)}</p>
              </div>
            </div>
            <ListaDeGastosPrevistos gastosPrevistos={gastosPrevistos} />
          </section>

          <section className="h-fit rounded-2xl border border-slate-700 bg-slate-800/60 p-5 sm:p-6">
            <h2 className="mb-1 text-xl font-semibold text-white">Novo gasto</h2>
            <p className="mb-4 text-sm text-slate-400">Adicione um lançamento individual à lista.</p>
            <FormularioTransacao categorias={categorias} tipo="gastoPrevisto" />
          </section>
        </div>
      </div>
    </main>
  );
}
