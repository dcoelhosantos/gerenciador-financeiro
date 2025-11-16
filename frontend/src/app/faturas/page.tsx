import { serverApi } from "@/services/api/api.server";
import { FaturasAgrupadas, Transacao } from "@/types";

export default async function Faturas() {
  let faturas: Transacao[] = [];
  let error: string | null = null;

  try {
    faturas = await serverApi.transacoes.list();
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
        <h1 className="text-2xl font-bold mb-8 text-white">Faturas</h1>
      </div>

      {error && (
        <p className="text-red-500 bg-red-100 p-4 rounded my-4">
          Erro ao carregar faturas: {error}
        </p>
      )}

      <div className="mb-8 p-4 border border-blue-500 bg-gray-800 rounded-lg text-center">
        <h2 className="text-lg font-semibold text-blue-300">
          TOTAL GERAL DAS FATURAS
        </h2>
        <p className="text-3xl font-bold text-white">
          R$ {totalGeral.toFixed(2)}
        </p>
      </div>

      <div className="space-y-6">
        {Object.keys(faturasAgrupadas).map((nomeCategoria) => (
          <div
            key={nomeCategoria}
            className="border border-gray-700 rounded p-4"
          >
            <h2 className="text-xl font-bold mb-3 text-green-500">
              --- FATURA DE {nomeCategoria.toUpperCase()} ---
            </h2>

            <ul className="space-py-1">
              {faturasAgrupadas[nomeCategoria].transacoes.map((fatura) => (
                <li key={fatura.id} className="flex justify-between">
                  <span>{fatura.descricao}</span>
                  <span>R$ {parseFloat(fatura.valor).toFixed(2)}</span>
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
    </main>
  );
}
