import FormularioCategoria from "@/components/FormularioCategoria";
import { serverApi } from "@/services/api/api.server";
import { Categoria } from "@/types";

export default async function Home() {
  let categorias: Categoria[] = [];
  let error: string | null = null;

  try {
    // Chama a camada "Model" para buscar os dados
    categorias = await serverApi.categorias.list();
  } catch (err) {
    if (err instanceof Error) error = err.message;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gerenciador Financeiro</h1>

      <h2 className="text-xl">Adicionar Nova Categoria</h2>

      <FormularioCategoria />

      <hr className="my-6" />

      <h2 className="text-xl">Categorias Existentes</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.id}>{categoria.nome}</li>
        ))}
      </ul>
    </main>
  );
}
