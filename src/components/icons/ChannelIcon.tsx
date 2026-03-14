import { Music, MessageCircle, Building2, BookOpen, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChannelId } from "@/types";

const ICON_MAP: Record<ChannelId, React.ElementType> = {
  douyin: Music, moments: MessageCircle, "58city": Building2, xiaohongshu: BookOpen, wechat: Smartphone,
};

export const CHANNEL_COLORS: Record<ChannelId, string> = {
  douyin: "text-gray-900", moments: "text-green-600", "58city": "text-orange-600", xiaohongshu: "text-red-500", wechat: "text-green-700",
};

export const CHANNEL_BGS: Record<ChannelId, string> = {
  douyin: "bg-gray-900/5", moments: "bg-green-600/8", "58city": "bg-orange-500/8", xiaohongshu: "bg-red-500/8", wechat: "bg-green-700/8",
};

interface Props { channelId: ChannelId; size?: number; className?: string; withBg?: boolean }

export function ChannelIcon({ channelId, size = 16, className, withBg }: Props) {
  const Icon = ICON_MAP[channelId];
  const color = CHANNEL_COLORS[channelId];
  if (withBg) {
    return (
      <span className={cn("flex items-center justify-center rounded-lg", CHANNEL_BGS[channelId], className)} style={{ width: size * 2, height: size * 2 }}>
        <Icon size={size} className={color} strokeWidth={1.8} />
      </span>
    );
  }
  return <Icon size={size} className={cn(color, className)} strokeWidth={1.8} />;
}
