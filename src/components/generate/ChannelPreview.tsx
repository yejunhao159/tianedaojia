"use client";

import { DouyinPreview } from "./previews/DouyinPreview";
import { MomentsPreview } from "./previews/MomentsPreview";
import { City58Preview } from "./previews/City58Preview";
import { XiaohongshuPreview } from "./previews/XiaohongshuPreview";
import { WechatPreview } from "./previews/WechatPreview";
import { WechatGroupPreview } from "./previews/WechatGroupPreview";
import type { ChannelId } from "@/types";

interface Props {
  channelId: ChannelId;
  content: string;
  image?: string;
}

export function ChannelPreview({ channelId, content, image }: Props) {
  if (channelId === "douyin") return <DouyinPreview content={content} image={image} />;
  if (channelId === "moments") return <MomentsPreview content={content} image={image} />;
  if (channelId === "58city") return <City58Preview content={content} image={image} />;
  if (channelId === "xiaohongshu") return <XiaohongshuPreview content={content} image={image} />;
  if (channelId === "wechat") return <WechatPreview content={content} image={image} />;
  if (channelId === "wechat_group") return <WechatGroupPreview content={content} image={image} />;
  return null;
}
