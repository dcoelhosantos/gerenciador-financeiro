import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const DJANGO_API_URL = "http://127.0.0.1:8001/api/transacoes/batch";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(DJANGO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Erro no Django");

    revalidatePath("/");
    revalidatePath("/gastos");
    return new NextResponse(null, { status: 201 });
  } catch (err) {
    return new NextResponse("Erro interno", { status: 500 });
  }
}
