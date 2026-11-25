"use client";

import { Assinatura, GastoPadrao } from "@/types";
import { clientApi } from "@/services/api/api.client";
import { formatCurrency } from "@/utils/formatCurrency";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function GerenciarPadroes({
  gastosIniciais,
  assinaturasIniciais,
}: {
  gastosIniciais: GastoPadrao[];
  assinaturasIniciais: Assinatura[];
}) {
  const router = useRouter();
  const [gastos, setGastos] = useState(gastosIniciais);
  const [assinaturas, setAssinaturas] = useState(assinaturasIniciais);
  const [gastoEmEdicao, setGastoEmEdicao] = useState<number | null>(null);
  const [assinaturaEmEdicao, setAssinaturaEmEdicao] = useState<number | null>(null);
  const [descricaoGasto, setDescricaoGasto] = useState("");
  const [valorGasto, setValorGasto] = useState("");
  const [nomeAssinatura, setNomeAssinatura] = useState("");
  const [valorAssinatura, setValorAssinatura] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setGastos(gastosIniciais);
    setAssinaturas(assinaturasIniciais);
  }, [gastosIniciais, assinaturasIniciais]);

  const atualizarGasto = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const item = { descricao: descricaoGasto.trim(), valor: Number(valorGasto) };
      if (!item.descricao || item.valor <= 0) throw new Error("Informe descrição e valor positivo.");
      if (gastoEmEdicao === null) await clientApi.gastosPadroes.create(item);
      else await clientApi.gastosPadroes.update(gastoEmEdicao, item);
      setDescricaoGasto("");
      setValorGasto("");
      setGastoEmEdicao(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar gasto padrão.");
    } finally {
      setBusy(false);
    }
  };

  const atualizarAssinatura = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const item = { nome: nomeAssinatura.trim(), valor: Number(valorAssinatura) };
      if (!item.nome || item.valor <= 0) throw new Error("Informe nome e valor positivo.");
      if (assinaturaEmEdicao === null) await clientApi.assinaturas.create(item);
      else await clientApi.assinaturas.update(assinaturaEmEdicao, item);
      setNomeAssinatura("");
      setValorAssinatura("");
      setAssinaturaEmEdicao(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar assinatura.");
    } finally {
      setBusy(false);
    }
  };

  const excluirGasto = async (item: GastoPadrao) => {
    if (!window.confirm(`Remover “${item.descricao}” dos gastos padrão? Os gastos já lançados serão mantidos.`)) return;
    setBusy(true);
    setError("");
    try {
      await clientApi.gastosPadroes.remove(item.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover gasto padrão.");
    } finally {
      setBusy(false);
    }
  };

  const excluirAssinatura = async (item: Assinatura) => {
    if (!window.confirm(`Remover “${item.nome}” dos modelos? Lançamentos já feitos na fatura serão mantidos.`)) return;
    setBusy(true);
    setError("");
    try {
      await clientApi.assinaturas.remove(item.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover assinatura.");
    } finally {
      setBusy(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none";
  const buttonClass = "rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50";
  const rowClass = "flex items-center justify-between gap-4 border-b border-slate-700 py-3 last:border-0";

  return (
    <div className="space-y-8">
      {error && <p className="rounded-xl border border-rose-800 bg-rose-950/50 p-3 text-rose-200">{error}</p>}

      <section id="gastos" className="scroll-mt-20 rounded-2xl border border-slate-700 bg-slate-800/60 p-5 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold text-amber-200">Gastos padrão</h2>
        <form onSubmit={atualizarGasto} className="mb-5 grid gap-3 sm:grid-cols-[1fr_160px_auto]">
          <input className={inputClass} value={descricaoGasto} onChange={(e) => setDescricaoGasto(e.target.value)} placeholder="Descrição" />
          <input className={inputClass} value={valorGasto} onChange={(e) => setValorGasto(e.target.value)} type="number" min="0.01" step="0.01" placeholder="Valor (R$)" />
          <button className={buttonClass} disabled={busy} type="submit">{gastoEmEdicao === null ? "Adicionar" : "Salvar edição"}</button>
        </form>
        <ul>
          {gastos.map((item) => (
            <li className={rowClass} key={item.id}>
              <span>{item.descricao} <span className="text-slate-400">— {formatCurrency(item.valor)}</span></span>
              <span className="flex shrink-0 gap-3">
                <button aria-label={`Editar ${item.descricao}`} onClick={() => { setGastoEmEdicao(item.id); setDescricaoGasto(item.descricao); setValorGasto(String(Number(item.valor))); }}><Pencil className="h-4 w-4 text-blue-300" /></button>
                <button aria-label={`Remover ${item.descricao}`} disabled={busy} onClick={() => excluirGasto(item)}><Trash2 className="h-4 w-4 text-red-400" /></button>
              </span>
            </li>
          ))}
        </ul>
        {gastoEmEdicao !== null && <button className="mt-3 text-sm text-gray-300 underline" onClick={() => { setGastoEmEdicao(null); setDescricaoGasto(""); setValorGasto(""); }}>Cancelar edição</button>}
      </section>

      <section id="assinaturas" className="scroll-mt-20 rounded-2xl border border-slate-700 bg-slate-800/60 p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-violet-200">Assinaturas padrão</h2>
          <Link className="text-sm text-violet-300 underline" href="/assinaturas">Abrir Fatura de Assinaturas</Link>
        </div>
        <form onSubmit={atualizarAssinatura} className="mb-5 grid gap-3 sm:grid-cols-[1fr_160px_auto]">
          <input className={inputClass} value={nomeAssinatura} onChange={(e) => setNomeAssinatura(e.target.value)} placeholder="Nome da assinatura" />
          <input className={inputClass} value={valorAssinatura} onChange={(e) => setValorAssinatura(e.target.value)} type="number" min="0.01" step="0.01" placeholder="Valor (R$)" />
          <button className={buttonClass} disabled={busy} type="submit">{assinaturaEmEdicao === null ? "Adicionar" : "Salvar edição"}</button>
        </form>
        <ul>
          {assinaturas.map((item) => (
            <li className={rowClass} key={item.id}>
              <span>{item.nome} <span className="text-slate-400">— {formatCurrency(item.valor)}</span></span>
              <span className="flex shrink-0 gap-3">
                <button aria-label={`Editar ${item.nome}`} onClick={() => { setAssinaturaEmEdicao(item.id); setNomeAssinatura(item.nome); setValorAssinatura(String(Number(item.valor))); }}><Pencil className="h-4 w-4 text-blue-300" /></button>
                <button aria-label={`Remover ${item.nome}`} disabled={busy} onClick={() => excluirAssinatura(item)}><Trash2 className="h-4 w-4 text-red-400" /></button>
              </span>
            </li>
          ))}
        </ul>
        {assinaturaEmEdicao !== null && <button className="mt-3 text-sm text-gray-300 underline" onClick={() => { setAssinaturaEmEdicao(null); setNomeAssinatura(""); setValorAssinatura(""); }}>Cancelar edição</button>}
      </section>
    </div>
  );
}
