import { searchByText, getVectorStore } from "@modules/multimodal-service";
import { z } from "zod/v4";

const schema = z.object({
  query: z.string().min(1, "搜索内容不能为空"),
  topK: z.number().min(1).max(20).default(5),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, topK } = schema.parse(body);

    const results = await searchByText(query, topK);

    return Response.json({
      results,
      totalRecords: getVectorStore().length,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: msg }, { status: 400 });
  }
}

export async function GET() {
  const store = getVectorStore();
  return Response.json({
    totalRecords: store.length,
    records: store.slice(0, 20).map((r) => ({
      id: r.id,
      mediaId: r.mediaId,
      text: r.text.slice(0, 100),
      createdAt: r.createdAt,
    })),
  });
}
