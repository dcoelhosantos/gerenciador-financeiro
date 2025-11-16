import { serverApi } from "@/services/api/api.server";

export default async function Home() {
  let saldo: number = 0;
  let saldo_futuro: number = 0;
  let totalFaturaDaniel: number = 0;
  let totalGastosPrevistos: number = 0;
  let error: string | null = null;

  try {
    const [saldoData, faturaData, gastoData] = await Promise.all([
      serverApi.saldo.get(),
      serverApi.transacoes.getValorTotal(1),
      serverApi.transacoes.getValorTotal(6),
    ]);
    saldo = saldoData;
    totalFaturaDaniel = faturaData;
    totalGastosPrevistos = gastoData;
  } catch (err) {
    if (err instanceof Error) error = err.message;
  }

  saldo_futuro = saldo - (totalFaturaDaniel + totalGastosPrevistos);

  return (
    <main className="p-8 bg-gray-900 text-gray-200 min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-8 text-white">
          Gerenciador Financeiro - Dashboard
        </h1>
      </div>

      <div>
        {error && (
          <p className="text-red-500 bg-red-100 p-4 rounded my-4">
            Erro ao carregar o resumo: {error}
          </p>
        )}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="border border-gray-500 p-4 rounded bg-gray-800 text-gray-200">
            <h3 className="font-bold">Saldo atual:</h3>
            <p className="text-2xl">R$ {saldo.toFixed(2)}</p>
          </div>
          <div className="border border-gray-500 p-4 rounded bg-gray-800 text-gray-200">
            <h3 className="font-bold">Fatura:</h3>
            <p className="text-2xl">R$ {totalFaturaDaniel.toFixed(2)}</p>
          </div>
          <div className="border border-gray-500 p-4 rounded bg-gray-800 text-gray-200">
            <h3 className="font-bold">Gastos previstos:</h3>
            <p className="text-2xl">R$ {totalGastosPrevistos.toFixed(2)}</p>
          </div>
          <div className="border border-green-700 p-4 rounded bg-gray-700 text-green-500">
            <h3 className="font-bold">Saldo previsto</h3>
            <p className="text-2xl">R$ {saldo_futuro.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
