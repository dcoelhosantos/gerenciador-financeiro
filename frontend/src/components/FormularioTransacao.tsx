"use client";

import { clientApi } from "@/services/api/api.client";
import { Categoria } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

//Schema
const transacaoSchema = z.object({
  descricao: z.string().min(1, "A descrição é obrigatória"),
  valor: z.coerce.number().positive("O valor deve ser positivo"),
  categoriaId: z.coerce.number().min(1, "Selecione uma categoria"),
  data: z.string().min(1, "Data é obrigatória"),
});

interface FormularioTransacaoProps {
  categorias: Categoria[];
  tipo?: "fatura" | "gastoPrevisto";
}

export default function FormularioTransacao({
  categorias,
  tipo = "fatura",
}: FormularioTransacaoProps) {
  //ViewModel
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(transacaoSchema),
    defaultValues: {
      descricao: "",
      valor: "" as unknown as number,
      categoriaId: 0,
      data: new Date().toISOString().slice(0, 10),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payloadParaAPI = {
        descricao: data.descricao,
        valor: data.valor,
        data: data.data,
        categoria_id: data.categoriaId,
      };

      if (tipo === "gastoPrevisto") {
        await clientApi.transacoes.createGastoPrevisto(payloadParaAPI);
      } else {
        await clientApi.transacoes.create(payloadParaAPI);
      }

      reset();
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError("root", { message: "Erro ao salvar: " + err.message });
      }
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      {errors.root && (
        <div className="text-red-500 bg-red-500/10 p-2 rounded text-sm">
          {errors.root.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Descrição
          </label>
          <input
            {...register("descricao")}
            type="text"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
            placeholder="Ex: Netflix"
          />
          {errors.descricao && (
            <span className="text-red-400 text-xs">
              {errors.descricao.message}
            </span>
          )}
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Valor (R$)
          </label>
          <input
            {...register("valor")}
            type="number"
            step="0.01"
            placeholder="Ex: 50.00"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
          />
          {errors.valor && (
            <span className="text-red-400 text-xs">{errors.valor.message}</span>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Categoria
          </label>
          <select
            {...register("categoriaId")}
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white outline-none transition focus:border-emerald-500"
          >
            <option value="0" disabled>
              Selecione...
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
          {errors.categoriaId && (
            <span className="text-red-400 text-xs">
              {errors.categoriaId.message}
            </span>
          )}
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-slate-300">
            Data
          </label>
          <input
            {...register("data")}
            type="date"
            className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-white outline-none transition focus:border-emerald-500"
          />
          {errors.data && (
            <span className="text-red-400 text-xs">{errors.data.message}</span>
          )}
        </div>
      </div>

      {/* Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Salvando...
            </>
          ) : (
            "Adicionar Transação"
          )}
        </button>
      </div>
    </form>
  );
}
