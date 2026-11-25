import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://127.0.0.1:8001/api/assinaturas";

export async function POST(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return new NextResponse("ID ausente", { status: 400 });
  try {
    const response = await fetch(`${DJANGO_API_URL}/${id}/transferir`, {
      method: "POST",
    });
    revalidatePath("/assinaturas");
    revalidatePath("/faturas");
    revalidatePath("/");
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Erro interno do BFF", { status: 500 });
  }
}
