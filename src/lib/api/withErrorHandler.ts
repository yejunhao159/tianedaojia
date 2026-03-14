import { addLog } from "@/lib/ai/logger";

interface HandlerOptions {
  route?: string;
  model?: string;
}

export function withErrorHandler(
  handler: (req: Request) => Promise<Response>,
  options?: HandlerOptions
) {
  return async (req: Request) => {
    const start = Date.now();

    try {
      const response = await handler(req);

      if (options?.route) {
        addLog({
          route: options.route,
          model: options.model ?? "unknown",
          durationMs: Date.now() - start,
          success: response.ok,
          error: response.ok ? undefined : `HTTP ${response.status}`,
        });
      }

      return response;
    } catch (error) {
      const durationMs = Date.now() - start;
      const message = error instanceof Error ? error.message : "Internal error";

      if (options?.route) {
        addLog({
          route: options.route,
          model: options.model ?? "unknown",
          durationMs,
          success: false,
          error: message,
        });
      }

      console.error(`[API Error] ${options?.route ?? "unknown"}:`, error);
      return Response.json({ error: message }, { status: 500 });
    }
  };
}
