import { extractRecruitmentInfo } from "@modules/text-service";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  requirement: z.string().min(1, "需求不能为空"),
  scenario: z.enum(["hourly", "nanny", "maternity", "cleaning"]).default("hourly"),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { requirement, scenario } = schema.parse(body);

    const data = await extractRecruitmentInfo(requirement, scenario);
    return Response.json(data);
  },
  { route: "/api/generate/extract", model: "claude-sonnet-4-6-thinking" }
);
