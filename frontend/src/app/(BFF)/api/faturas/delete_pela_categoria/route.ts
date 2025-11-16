// frontend/src/app/(BFF)/api/faturas/clear-category/route.ts
import { NextResponse } from "next/server";

const DJANGO_API_URL = "http://localhost:8000/api/transacoes/clear-by-category";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categoriaId = body.id;

    if (!categoriaId) {
      return new NextResponse("ID da categoria não fornecido", { status: 400 });
    }

    const response = await fetch(DJANGO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoria_id: categoriaId }),
    });

    if (!response.ok) {
      throw new Error(`Erro do Django: ${response.statusText}`);
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    let message = "Erro interno do BFF";
    if (err instanceof Error) message = err.message;
    return new NextResponse(message, { status: 500 });
  }
}
