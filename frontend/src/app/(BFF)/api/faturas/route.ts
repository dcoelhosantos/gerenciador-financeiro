import { Transacao } from "@/types";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://localhost:8000/api/transacoes";

export async function GET() {
  try {
    const response = await fetch(`${DJANGO_API_URL}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erro do Django: ${response.statusText}`);
    }

    const data: Transacao[] = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    let message = "Erro interno do BFF";
    if (err instanceof Error) message = err.message;
    return new NextResponse(message, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${DJANGO_API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erro do Django: ${response.statusText}`);
    }

    revalidatePath("/faturas");
    revalidatePath("/");

    const data: Transacao = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    let message = "Erro interno do BFF";
    if (err instanceof Error) message = err.message;
    return new NextResponse(message, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return new NextResponse("ID da transação não fornecido", { status: 400 });
    }

    const response = await fetch(`${DJANGO_API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new NextResponse("Transação não encontrada", { status: 404 });
      }
      throw new Error(`Erro do Django: ${response.statusText}`);
    }

    revalidatePath("/faturas");
    revalidatePath("/");
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    let message = "Erro interno do BFF";
    if (err instanceof Error) message = err.message;
    return new NextResponse(message, { status: 500 });
  }
}
