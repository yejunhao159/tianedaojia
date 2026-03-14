"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHANNEL_LIST } from "@modules/publish-service";
import { ChannelIcon } from "@/components/icons/ChannelIcon";
import { cn } from "@/lib/utils";
import type { ChannelId } from "@/types";

interface Props { statuses: Record<ChannelId, "idle" | "generating" | "done" | "error"> }

export function ChannelNav({ statuses }: Props) {
  const pathname = usePathname();
  const active = CHANNEL_LIST.find((ch) => pathname === `/generate/${ch.id}`)?.id;

  return (
    <nav className="flex gap-1 rounded-xl border border-border/50 bg-white/50 p-1">
      {CHANNEL_LIST.map((ch) => {
        const a = active === ch.id;
        const st = statuses[ch.id];
        return (
          <Link key={ch.id} href={`/generate/${ch.id}`}
            className={cn("relative flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-medium transition-all",
              a ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <ChannelIcon channelId={ch.id} size={14} /><span>{ch.name}</span>
            {st === "generating" && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 animate-pulse rounded-full bg-brand" />}
            {st === "done" && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500" />}
          </Link>
        );
      })}
    </nav>
  );
}
