import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(
      "http://127.0.0.1:8001/api/acoes/adicionar-spotify",
      { method: "POST" }
    );
    const body = await response.text();
    if (!response.ok) return new NextResponse(body, { status: response.status });
    revalidatePath("/faturas");
    revalidatePath("/");
    return new NextResponse(body, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Erro interno do BFF", { status: 500 });
  }
}
