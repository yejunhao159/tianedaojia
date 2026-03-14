import { getLogs, getStats } from "@/lib/ai/logger";

export async function GET() {
  return Response.json({
    stats: getStats(),
    recentLogs: getLogs().slice(0, 50),
  });
}
