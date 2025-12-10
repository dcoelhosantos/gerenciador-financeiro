import FormularioTransacao from "@/components/FormularioTransacao";
import ListaDeGastosPrevistos from "@/components/ListaDeGastosPrevistos";
import { serverApi } from "@/services/api/api.server";
import { Categoria, Transacao } from "@/types";

export const dynamic = "force-dynamic";

export default async function Gastos() {
  let gastosPrevistos: Transacao[] = [];
  let categorias: Categoria[] = [];
  let error: string | null = null;

  try {
    const [gastosPrevistosData, categoriaData] = await Promise.all([
      serverApi.transacoes.listGastosPrevistos(),
      serverApi.categorias.get(6),
    ]);
    gastosPrevistos = gastosPrevistosData;
    categorias.push(categoriaData);
  } catch (err) {
    if (err instanceof Error) error = err.message;
  }

  const totalGastosPrevistos = gastosPrevistos.reduce(
    (acc, gastoPrevisto) => acc + parseFloat(gastoPrevisto.valor),
    0
  );

  return (
    <main className="p-8 bg-gray-900 text-gray-200 min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-8 text-white">
          MEUS GASTOS PREVISTOS
        </h1>
      </div>

      <div className="mb-8">
        <FormularioTransacao categorias={categorias} tipo="gastoPrevisto" />
      </div>

      {error && (
        <p className="text-red-500 bg-red-100 p-4 rounded my-4">
          Erro ao carregar gastos: {error}
        </p>
      )}

      <div className="mb-8 p-4 border border-gray-700 bg-gray-800 rounded-lg text-center">
        <h2 className="text-lg font-semibold text-green-500">
          --- TOTAL GASTOS PREVISTOS ---
        </h2>
        <p className="text-3xl font-bold text-white">
          R$ {totalGastosPrevistos.toFixed(2)}
        </p>
      </div>

      <ListaDeGastosPrevistos gastosPrevistos={gastosPrevistos} />
    </main>
  );
}
