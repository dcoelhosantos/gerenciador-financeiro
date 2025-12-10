import { Categoria } from "@/types";
import { NextResponse } from "next/server";

const DJANGO_API_URL = "http://127.0.0.1:8001/api/categorias";

export async function GET() {
  try {
    const response = await fetch(`${DJANGO_API_URL}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erro do Django: ${response.statusText}`);
    }

    const data: Categoria[] = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    let message = "Erro interno do BFF";
    if (err instanceof Error) message = err.message;
    return new NextResponse(message, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const data: Categoria = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    let message = "Erro interno do BFF";
    if (err instanceof Error) message = err.message;
    return new NextResponse(message, { status: 500 });
  }
}
