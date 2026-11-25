import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://127.0.0.1:8001/api/gastos-padroes";

export async function GET() {
  try {
    const response = await fetch(DJANGO_API_URL, { cache: "no-store" });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Erro interno do BFF", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(DJANGO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
    });
    revalidatePath("/padroes");
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Erro interno do BFF", { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return new NextResponse("ID ausente", { status: 400 });
  try {
    const response = await fetch(`${DJANGO_API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
    });
    revalidatePath("/padroes");
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse("Erro interno do BFF", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return new NextResponse("ID ausente", { status: 400 });
  try {
    const response = await fetch(`${DJANGO_API_URL}/${id}`, { method: "DELETE" });
    revalidatePath("/padroes");
    return new NextResponse(null, { status: response.status });
  } catch {
    return new NextResponse("Erro interno do BFF", { status: 500 });
  }
}
