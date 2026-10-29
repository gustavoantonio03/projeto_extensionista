import { NextResponse } from "next/server";
import { seedInitialUsers } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await seedInitialUsers();
    return NextResponse.json(result, { status: result.success ? 200 : 207 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Erro desconhecido ao executar seed",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
