import type { ChannelConfig, ChannelId } from "./types";

export const CHANNELS: Record<ChannelId, ChannelConfig> = {
  douyin: {
    id: "douyin", name: "抖音", icon: "douyin", maxTextLength: 300,
    imageAspect: "9:16", imageCount: 1, previewWidth: 375,
    toneHint: "活泼吸引、短句爆点、年轻化表达",
    formatRules: "300字以内，开头钩子句抓眼球，大量#标签（至少5个），短句为主每句不超15字，结尾加行动号召",
  },
  moments: {
    id: "moments", name: "朋友圈", icon: "moments", maxTextLength: 600,
    imageAspect: "1:1", imageCount: 9, previewWidth: 375,
    toneHint: "亲切口语、像朋友分享、真实感",
    formatRules: "前6行约100字是折叠前可见内容必须吸引人，口语化表达，emoji穿插使用，图片最多9张建议3/6/9组合",
  },
  "58city": {
    id: "58city", name: "58同城", icon: "58city", maxTextLength: 2000,
    imageAspect: "4:3", imageCount: 3, previewWidth: 375,
    toneHint: "正式招聘、专业规范、信息完整",
    formatRules: "结构化招聘格式必须含【职位名称】【薪资待遇】【工作地点】【岗位职责】【任职要求】【福利待遇】，不使用emoji",
  },
  xiaohongshu: {
    id: "xiaohongshu", name: "小红书", icon: "xiaohongshu", maxTextLength: 1000,
    imageAspect: "3:4", imageCount: 9, previewWidth: 375,
    toneHint: "种草风、生活化分享、亲和力强",
    formatRules: "标题15-20字用|分隔关键词，正文emoji密集每句1-2个，结尾加#标签至少8个，闺蜜推荐口吻",
  },
  wechat: {
    id: "wechat", name: "微信公众号", icon: "wechat", maxTextLength: 2000,
    imageAspect: "1:1", imageCount: 3, previewWidth: 375,
    toneHint: "专业正式、品牌化表达、有温度",
    formatRules: "标题不超30字，正文分段分小标题，专业但有温度体现品牌调性，结尾加引导关注/咨询的行动号召",
  },
  wechat_group: {
    id: "wechat_group", name: "微信群", icon: "wechat_group", maxTextLength: 200,
    imageAspect: "1:1", imageCount: 1, previewWidth: 375,
    toneHint: "简洁直接、信息密集、一眼看完、方便转发",
    formatRules: "200字以内极简格式，第一行岗位+地区+薪资一行概括，中间3-5行要点用✅开头，末尾联系方式+转发引导，不啰嗦不铺垫",
  },
};

export const CHANNEL_LIST = Object.values(CHANNELS);
export const CHANNEL_IDS = Object.keys(CHANNELS) as ChannelId[];
