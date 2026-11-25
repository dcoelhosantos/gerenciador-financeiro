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
    <section className="flex flex-col items-start gap-3 rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
      <div>
        <h2 className="font-semibold text-white">Contas Spotify</h2>
        <p className="mt-1 text-sm text-slate-400">
          Lança quatro contas em Outros e uma em Jakla.
        </p>
      </div>
      <button
        type="button"
        onClick={handleAdicionarSpotify}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Music2 />}
        Adicionar contas Spotify
      </button>
      {message && <p className="text-green-400 text-sm">{message}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </section>
  );
}
