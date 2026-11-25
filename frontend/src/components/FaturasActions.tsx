"use client";

import { clientApi } from "@/services/api/api.client";
import { Loader2, Music2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FaturasActions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAdicionarSpotify = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const result = await clientApi.transacoes.createContasSpotify();
      setMessage(`${result.criadas} lançamentos Spotify adicionados.`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao adicionar Spotify.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleAdicionarSpotify}
        disabled={loading}
        className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Music2 />}
        Adicionar contas Spotify
      </button>
      {message && <p className="text-green-400 text-sm">{message}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <p className="text-xs text-gray-400">
        Adiciona quatro contas em Outros e uma em Jakla.
      </p>
    </div>
  );
}
