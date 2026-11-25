import DashboardActions from "@/components/DashboardActions";
import { serverApi } from "@/services/api/api.server";
import { GastoPadrao } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { ArrowDownRight, ArrowRight, CreditCard, ListChecks, Music2, Wallet } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  let saldo = 0;
  let totalFaturaDaniel = 0;
  let totalGeralFaturas = 0;
  let totalGastosPrevistos = 0;
  let totalAssinaturasPendentes = 0;
  let gastosPadroes: GastoPadrao[] = [];
  let error: string | null = null;

  try {
    const [saldoData, faturaDaniel, faturas, gastos, assinaturas, padroes] =
      await Promise.all([
        serverApi.saldo.get(),
        serverApi.transacoes.getValorTotal(1),
        serverApi.transacoes.list(),
        serverApi.transacoes.getValorTotal(6),
        serverApi.assinaturas.totalPendente(),
        serverApi.gastosPadroes.list(),
      ]);
    saldo = saldoData;
    totalFaturaDaniel = faturaDaniel;
    totalGeralFaturas = faturas.reduce(
      (total, item) => total + Number(item.valor),
      0
    );
    totalGastosPrevistos = gastos;
    totalAssinaturasPendentes = assinaturas;
    gastosPadroes = padroes;
  } catch (err) {
    if (err instanceof Error) error = err.message;
  }

  const saldoPrevisto =
    saldo - totalFaturaDaniel - totalGastosPrevistos - totalAssinaturasPendentes;

  const atalhos = [
    {
      title: "Faturas",
      description: "Veja e organize os lançamentos dos cartões.",
      value: formatCurrency(totalGeralFaturas),
      valueLabel: "total geral",
      href: "/faturas",
      icon: CreditCard,
      color: "text-sky-300",
      iconBg: "bg-sky-400/10",
    },
    {
      title: "Gastos previstos",
      description: "Acompanhe seus gastos e adicione os padrões.",
      value: formatCurrency(totalGastosPrevistos),
      valueLabel: `${gastosPadroes.length} padrões configurados`,
      href: "/gastos",
      icon: ListChecks,
      color: "text-amber-300",
      iconBg: "bg-amber-400/10",
    },
    {
      title: "Assinaturas",
      description: "Lance cada assinatura na fatura quando chegar.",
      value: formatCurrency(totalAssinaturasPendentes),
      valueLabel: "ainda a lançar neste mês",
      href: "/assinaturas",
      icon: Music2,
      color: "text-violet-300",
      iconBg: "bg-violet-400/10",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">Seu dinheiro, em contexto</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Resumo financeiro</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Acompanhe o que já está comprometido e o que ainda falta lançar, tudo em um só lugar.
              </p>
            </div>
            <section className="min-w-[240px] rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                <ArrowDownRight className="h-4 w-4" />
                Saldo previsto
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white">{formatCurrency(saldoPrevisto)}</p>
              <p className="mt-1 text-xs text-slate-400">Após a fatura de Daniel, gastos previstos e assinaturas a lançar.</p>
            </section>
          </div>
        </header>

        {error && (
          <p className="rounded-xl border border-rose-800 bg-rose-950/50 p-4 text-rose-200">
            Não foi possível carregar todos os dados: {error}
          </p>
        )}

        <section aria-label="Resumo dos valores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardActions saldoAtual={saldo} />
          <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-400">Fatura de Daniel</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{formatCurrency(totalFaturaDaniel)}</p>
            <p className="mt-2 text-xs text-slate-500">Valor considerado no saldo previsto</p>
          </article>
          <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-400">Gastos previstos</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{formatCurrency(totalGastosPrevistos)}</p>
            <p className="mt-2 text-xs text-slate-500">Lançamentos na lista de gastos</p>
          </article>
          <article className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-400">Assinaturas a lançar</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{formatCurrency(totalAssinaturasPendentes)}</p>
            <p className="mt-2 text-xs text-slate-500">Reserva atual da base de assinaturas</p>
          </article>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Acesso rápido</h2>
              <p className="mt-1 text-sm text-slate-400">Abra uma área para ver os detalhes e as ações correspondentes.</p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {atalhos.map((atalho) => {
              const Icon = atalho.icon;
              return (
                <Link
                  key={atalho.href}
                  href={atalho.href}
                  className="group rounded-2xl border border-slate-700 bg-slate-800/60 p-5 transition hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-800"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`rounded-xl p-3 ${atalho.iconBg}`}><Icon className={`h-5 w-5 ${atalho.color}`} /></span>
                    <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{atalho.title}</h3>
                  <p className="mt-1 min-h-10 text-sm text-slate-400">{atalho.description}</p>
                  <div className="mt-5 border-t border-slate-700 pt-4">
                    <p className="font-semibold text-slate-100">{atalho.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{atalho.valueLabel}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
