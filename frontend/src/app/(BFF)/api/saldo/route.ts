import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const DJANGO_API_URL = "http://localhost:8000/api/saldo/atualizar"; // Endpoint do Django Ninja

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
    return new NextResponse(null, { status: 200 });
  } catch (err) {
    return new NextResponse("Erro interno", { status: 500 });
  }
}
