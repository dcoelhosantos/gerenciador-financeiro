import FormularioTransacao from "@/components/FormularioTransacao";
import FaturasActions from "@/components/FaturasActions";
import ListaDeFaturas from "@/components/ListaDeFaturas";
import { serverApi } from "@/services/api/api.server";
import { Categoria, FaturasAgrupadas, Transacao } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

export const dynamic = "force-dynamic";

export default async function Faturas() {
  let faturas: Transacao[] = [];
  let categorias: Categoria[] = [];
  let error: string | null = null;

  try {
    const [faturasData, categoriasData] = await Promise.all([
      serverApi.transacoes.list(),
      serverApi.categorias.list(),
    ]);

    faturas = faturasData;
    categorias = categoriasData;
  } catch (err) {
    if (err instanceof Error) error = err.message;
  }

  const faturasAgrupadas: FaturasAgrupadas = faturas.reduce((acc, fatura) => {
    const categoria = fatura.categoria.nome;
    const valor = parseFloat(fatura.valor);

    if (!acc[categoria]) {
      acc[categoria] = { transacoes: [], total: 0 };
    }

    acc[categoria].transacoes.push(fatura);
    acc[categoria].total += valor;

    return acc;
  }, {} as FaturasAgrupadas);

  const totalGeral = Object.values(faturasAgrupadas).reduce(
    (acc, infoCategoria) => acc + infoCategoria.total,
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="mb-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-300">Cartões</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Faturas</h1>
          <p className="mt-2 max-w-2xl text-slate-400">Organize os lançamentos por cartão. As assinaturas só entram nesta área quando você as lançar no Daniel.</p>
        </header>

        {error && (
          <p className="rounded-xl border border-rose-800 bg-rose-950/50 p-4 text-rose-200">
            Erro ao carregar faturas: {error}
          </p>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
          <section className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Adicionar lançamento</h2>
            <FormularioTransacao categorias={categorias} />
          </section>

          <div className="flex flex-col gap-4">
            <section className="rounded-2xl border border-sky-400/20 bg-sky-400/10 p-5">
              <p className="text-sm font-medium text-sky-200">Total geral das faturas</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white">{formatCurrency(totalGeral)}</p>
              <p className="mt-1 text-xs text-slate-400">Todas as categorias de cartão, sem os gastos previstos.</p>
            </section>
            <FaturasActions />
          </div>
        </div>

        <ListaDeFaturas faturasAgrupadas={faturasAgrupadas} />
      </div>
    </main>
  );
}
