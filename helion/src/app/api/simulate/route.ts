import { NextRequest } from "next/server";
import { simulate } from "@/libs/engine";
import { SEHIRLER } from "@/libs/constants";
import type { SimulationInput } from "@/libs/types";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const input = body as Partial<SimulationInput>;

  if (!input.sehir || !SEHIRLER.includes(input.sehir)) {
    return Response.json({ error: "Geçersiz şehir" }, { status: 400 });
  }
  if (!input.gun || input.gun < 1 || input.gun > 31) {
    return Response.json({ error: "Gün 1-31 arasında olmalıdır" }, { status: 400 });
  }
  if (!input.tuketim || input.tuketim <= 0) {
    return Response.json({ error: "Tüketim 0'dan büyük olmalıdır" }, { status: 400 });
  }
  if (input.bataryaYuzde === undefined || input.bataryaYuzde < 0 || input.bataryaYuzde > 100) {
    return Response.json({ error: "Batarya doluluk 0-100 arasında olmalıdır" }, { status: 400 });
  }
  if (!input.panelSayisi || input.panelSayisi < 1) {
    return Response.json({ error: "Panel sayısı en az 1 olmalıdır" }, { status: 400 });
  }
  if (input.turbineSayisi === undefined || input.turbineSayisi < 0) {
    return Response.json({ error: "Türbin sayısı negatif olamaz" }, { status: 400 });
  }

  const result = simulate(input as SimulationInput);
  return Response.json(result);
}
