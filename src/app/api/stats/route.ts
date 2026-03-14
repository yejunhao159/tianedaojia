import { getStats, getLogs } from "@modules/logger";

export async function GET() {
  return Response.json({
    stats: getStats(),
    recentLogs: getLogs().slice(0, 50),
  });
}
