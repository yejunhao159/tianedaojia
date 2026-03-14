import type { ChannelId } from "./types";

export interface ChannelTemplate {
  channelId: ChannelId;
  name: string;
  structure: string;
  example: string;
  validate: (content: string) => { valid: boolean; errors: string[] };
}

export const CHANNEL_TEMPLATES: Record<ChannelId, ChannelTemplate> = {
  douyin: {
    channelId: "douyin",
    name: "抖音短视频文案",
    structure: `钩子句（1行）
正文（3-5行短句）
行动号召（1行）
#标签（至少5个）`,
    example: `🔥 月薪8000的住家保姆机会来了！
✅ 包吃住 做六休一
✅ 朝阳区高端小区
✅ 会做川菜优先
👉 私信我了解详情
#家政招聘 #住家保姆 #北京招聘 #高薪工作 #天鹅到家`,
    validate: (content) => {
      const errors: string[] = [];
      if (content.length > 300) errors.push(`字数超限：${content.length}/300`);
      const tags = content.match(/#\S+/g) ?? [];
      if (tags.length < 5) errors.push(`标签不足：${tags.length}/5`);
      if (!content.includes("\n")) errors.push("应使用短句分行");
      return { valid: errors.length === 0, errors };
    },
  },

  moments: {
    channelId: "moments",
    name: "朋友圈文案",
    structure: `前6行可见区（约100字，必须吸引人）
---折叠线---
详细信息
联系方式`,
    example: `身边好几个朋友都在找保姆，今天推荐一个靠谱的👇

我们家用了半年的张阿姨要回老家了😢
趁她还没走，帮她介绍个好雇主

✨ 川菜一绝，家里人都胖了
✨ 干净利落，收纳达人
✨ 性格温和，跟老人处得来

坐标朝阳，月薪6-8k，做六休一
有需要的朋友私聊我～`,
    validate: (content) => {
      const errors: string[] = [];
      if (content.length > 600) errors.push(`字数超限：${content.length}/600`);
      const lines = content.split("\n");
      const firstSixLines = lines.slice(0, 6).join("");
      if (firstSixLines.length > 150) errors.push("前6行过长，折叠前内容应控制在100字左右");
      return { valid: errors.length === 0, errors };
    },
  },

  "58city": {
    channelId: "58city",
    name: "58同城招聘帖",
    structure: `【职位名称】
【薪资待遇】
【工作地点】
【岗位职责】
【任职要求】
【福利待遇】
【联系方式】`,
    example: `【职位名称】住家保姆
【薪资待遇】6000-8000元/月
【工作地点】北京市朝阳区望京
【岗位职责】
1. 负责家庭日常三餐制作（擅长川菜优先）
2. 家庭日常保洁、衣物清洗整理
3. 协助照顾老人日常起居
【任职要求】
1. 年龄35-55岁，身体健康
2. 有3年以上家政服务经验
3. 持有健康证
4. 性格开朗，责任心强
【福利待遇】
1. 包吃包住
2. 做六休一
3. 节日红包
4. 天鹅到家平台保障`,
    validate: (content) => {
      const errors: string[] = [];
      const required = ["【职位名称】", "【薪资待遇】", "【工作地点】", "【岗位职责】", "【任职要求】"];
      for (const tag of required) {
        if (!content.includes(tag)) errors.push(`缺少必要字段：${tag}`);
      }
      if (content.length > 2000) errors.push(`字数超限：${content.length}/2000`);
      if (/[\u{1F300}-\u{1FAF8}]/u.test(content)) errors.push("58同城不建议使用emoji");
      return { valid: errors.length === 0, errors };
    },
  },

  xiaohongshu: {
    channelId: "xiaohongshu",
    name: "小红书笔记",
    structure: `标题（15-20字，用|分隔关键词）
正文（emoji密集，闺蜜口吻）
#标签（至少8个）`,
    example: `北京找保姆|住家阿姨|靠谱推荐🏠

姐妹们！！我终于找到靠谱阿姨了😭😭

之前找了好几个都不满意，这次通过天鹅到家平台找的，真的太香了👇

🍳 做饭：川菜绝了！回锅肉我能吃三碗
🧹 保洁：家里从来没这么干净过
👵 照顾老人：我婆婆都说比我贴心

💰 月薪6-8k，包吃住，做六休一
📍 朝阳望京附近

有需要的姐妹赶紧冲！！

#家政 #保姆推荐 #住家保姆 #北京生活 #找保姆 #家政服务 #天鹅到家 #生活好物推荐`,
    validate: (content) => {
      const errors: string[] = [];
      if (content.length > 1000) errors.push(`字数超限：${content.length}/1000`);
      const tags = content.match(/#\S+/g) ?? [];
      if (tags.length < 8) errors.push(`标签不足：${tags.length}/8`);
      const emojiCount = (content.match(/[\u{1F300}-\u{1FAF8}]/gu) ?? []).length;
      if (emojiCount < 3) errors.push("emoji使用过少，小红书风格需要更多emoji");
      const firstLine = content.split("\n")[0];
      if (firstLine.length > 25) errors.push(`标题过长：${firstLine.length}/20`);
      return { valid: errors.length === 0, errors };
    },
  },

  wechat: {
    channelId: "wechat",
    name: "微信公众号文章",
    structure: `标题（不超30字）
导语（1-2句，引出主题）
正文分段（小标题 + 内容）
行动号召（关注/咨询引导）`,
    example: `朝阳区优质住家保姆招聘｜包吃住月薪8000

在快节奏的都市生活中，一位靠谱的住家保姆，是每个家庭的温暖后盾。

【我们在找这样的你】
如果你擅长烹饪（尤其是川菜），热爱整洁的生活环境，善于与老人沟通——那么这份工作非常适合你。

【工作内容】
日常三餐制作、家庭保洁整理、协助照顾老人起居。工作地点位于朝阳区望京，交通便利、环境优雅。

【我们提供】
• 月薪 6000-8000 元
• 包吃包住，独立房间
• 做六休一，节日红包
• 天鹅到家平台全程保障

【联系我们】
扫描下方二维码或点击"阅读原文"，立即报名。
天鹅到家，让专业服务温暖每一个家。`,
    validate: (content) => {
      const errors: string[] = [];
      if (content.length > 2000) errors.push(`字数超限：${content.length}/2000`);
      const firstLine = content.split("\n")[0];
      if (firstLine.length > 35) errors.push(`标题过长：${firstLine.length}/30`);
      if (!content.includes("【") && !content.includes("##")) errors.push("公众号文章建议使用小标题分段");
      return { valid: errors.length === 0, errors };
    },
  },
};

export function getChannelTemplate(channelId: ChannelId): ChannelTemplate {
  return CHANNEL_TEMPLATES[channelId];
}

export function validateContent(channelId: ChannelId, content: string) {
  return CHANNEL_TEMPLATES[channelId].validate(content);
}
