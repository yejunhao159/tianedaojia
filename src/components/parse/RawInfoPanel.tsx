"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, Phone, Users, Briefcase } from "lucide-react";
import type { InfoSourceType } from "@/types";

const SOURCES: { id: InfoSourceType; name: string; Icon: React.ElementType }[] = [
  { id: "wechat", name: "微信聊天", Icon: MessageCircle },
  { id: "phone", name: "电话记录", Icon: Phone },
  { id: "moments", name: "朋友圈", Icon: Users },
  { id: "agent", name: "中介推荐", Icon: Briefcase },
];

const SAMPLE_DATA: Record<InfoSourceType, string> = {
  wechat: `[李姐 14:32] 我有个阿姨推荐给你，姓王，48岁，四川人，做饭特别好吃，川菜湘菜都拿手，之前在朝阳做了4年，雇主评价都很好

[李姐 14:33] 她有健康证和育婴师证，期望薪资6500-7500，住在大兴但可以到朝阳上班

[李姐 14:35] 对了她还会做面食，包子馒头花卷都会

[你 14:36] 好的，她什么时候方便面试？

[李姐 14:38] 随时都行，她现在没在做，上家做了3年刚结束`,
  phone: `通话记录 - 张阿姨 (138****6789)
时间：2024-03-10 10:30，时长：8分钟

备注：42岁，河南人，6年家政经验，擅长收纳整理和面食，有健康证。希望在海淀或朝阳工作，期望5500-6500/月。之前在一个外企家庭做了3年，会简单英语交流。性格开朗，人很爽快。`,
  moments: `🏠 好阿姨推荐！赵姐，45岁，安徽人，做保洁8年了，干活特别麻利！深度清洁、收纳整理都很专业。现在想找长期钟点工的活，朝阳区优先。联系我推荐～ #保洁阿姨 #家政服务`,
  agent: `天鹅到家中介推荐档案
姓名：孙阿姨
年龄：50岁
籍贯：湖北
工作年限：10年
擅长：照顾老人、做饭、家务全能
证书：高级家政证、养老护理证
期望薪资：7000-8500/月
期望区域：朝阳、东城
备注：性格温和有耐心，之前照顾过卧床老人，经验非常丰富`,
};

interface Props {
  activeSource: InfoSourceType;
  rawText: string;
  onSourceChange: (s: InfoSourceType) => void;
  onRawTextChange: (t: string) => void;
}

export function RawInfoPanel({ activeSource, rawText, onSourceChange, onRawTextChange }: Props) {
  return (
    <div className="glass-card flex h-full flex-col rounded-2xl p-5">
      <h3 className="mb-3 text-[15px] font-bold">原始信息源</h3>

      {/* Source tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-muted/50 p-1">
        {SOURCES.map(({ id, name, Icon }) => (
          <button key={id} onClick={() => { onSourceChange(id); if (!rawText) onRawTextChange(SAMPLE_DATA[id]); }}
            className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-medium transition-all",
              activeSource === id ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            <Icon size={13} strokeWidth={1.6} />{name}
          </button>
        ))}
      </div>

      {/* Text area */}
      <div className="flex-1">
        <textarea
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
          placeholder={SAMPLE_DATA[activeSource]}
          className="h-full w-full resize-none rounded-xl border border-border bg-white p-4 text-[13px] leading-[1.8] outline-none placeholder:text-muted-foreground/30 focus:border-brand/30 focus:ring-2 focus:ring-brand/5"
        />
      </div>

      {/* Load sample button */}
      <button onClick={() => onRawTextChange(SAMPLE_DATA[activeSource])}
        className="mt-3 text-[12px] font-medium text-brand hover:underline">
        加载示例数据
      </button>
    </div>
  );
}
