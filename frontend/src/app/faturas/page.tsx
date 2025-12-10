import FormularioTransacao from "@/components/FormularioTransacao";
import ListaDeFaturas from "@/components/ListaDeFaturas";
import { serverApi } from "@/services/api/api.server";
import { Categoria, FaturasAgrupadas, Transacao } from "@/types";

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
    <main className="p-8 bg-gray-900 text-gray-200 min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-8 text-white">
          MEU GERENCIADOR DE FATURAS
        </h1>
      </div>

      <div className="mb-8">
        <FormularioTransacao categorias={categorias} />
      </div>

      {error && (
        <p className="text-red-500 bg-red-100 p-4 rounded my-4">
          Erro ao carregar faturas: {error}
        </p>
      )}

      <div className="mb-8 p-4 border border-gray-700 bg-gray-800 rounded-lg text-center">
        <h2 className="text-lg font-semibold text-green-500">
          --- TOTAL GERAL DAS FATURAS ---
        </h2>
        <p className="text-3xl font-bold text-white">
          R$ {totalGeral.toFixed(2)}
        </p>
      </div>

      <ListaDeFaturas faturasAgrupadas={faturasAgrupadas} />
    </main>
  );
}
