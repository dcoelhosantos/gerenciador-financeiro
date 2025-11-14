// frontend/src/components/FormularioCategoria.tsx
"use client"; // <-- Isso é um Componente Cliente

import { useState } from "react";
import { clientApi } from "@/services/api/api.client"; // <-- Importa o Model (Client)
import { useRouter } from "next/navigation";

// Esta é uma "View" (o JSX) e uma "ViewModel" (a lógica de estado)
// para o LADO DO CLIENTE.
export default function FormularioCategoria() {
  // --- Lógica de ViewModel ---
  const [nome, setNome] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Para atualizar a página

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;

    setLoading(true);
    setError(null);

    try {
      // Chama a camada "Model" do cliente
      await clientApi.categorias.create(nome);

      // Sucesso! Limpa o campo e atualiza a página
      setNome("");
      router.refresh(); // <-- MÁGICA: O Next.js vai re-buscar os dados no page.tsx
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização da View ---
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da categoria"
        className="border p-2 rounded text-black" // Tailwind
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Salvando..." : "Adicionar"}
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
}
