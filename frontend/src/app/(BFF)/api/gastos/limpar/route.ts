import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://127.0.0.1:8001/api/transacoes/clear-by-category";

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(DJANGO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoria_id: 6 }),
    });

    if (!response.ok) {
      throw new Error(`Erro do Django: ${response.statusText}`);
    }

    revalidatePath("/gastos");
    revalidatePath("/");

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    let message = "Erro interno do BFF";
    if (err instanceof Error) message = err.message;
    return new NextResponse(message, { status: 500 });
  }
}
