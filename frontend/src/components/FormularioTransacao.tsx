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
      className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4 max-w-xzl mx-auto"
    >
      {errors.root && (
        <div className="text-red-500 bg-red-500/10 p-2 rounded text-sm">
          {errors.root.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Descrição
          </label>
          <input
            {...register("descricao")}
            type="text"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
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
          <label className="block text-sm font-medium text-gray-300">
            Valor (R$)
          </label>
          <input
            {...register("valor")}
            type="number"
            step="0.01"
            placeholder="Ex: 50.00"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
          />
          {errors.valor && (
            <span className="text-red-400 text-xs">{errors.valor.message}</span>
          )}
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Categoria
          </label>
          <select
            {...register("categoriaId")}
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
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
          <label className="block text-sm font-medium text-gray-300">
            Data
          </label>
          <input
            {...register("data")}
            type="date"
            className="mt-1 w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-green-500 outline-none"
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
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold mt-6 py-2 px-4 rounded transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
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
