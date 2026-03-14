"use client";

import { GlassCard } from "@/components/layout/GlassCard";
import { Database, FileText, Image, MessageSquare, Upload } from "lucide-react";

const DATA_SOURCES = [
  { name: "文本输入", desc: "直接粘贴阿姨信息、聊天记录等文本", icon: FileText, color: "text-blue-500 bg-blue-50" },
  { name: "微信聊天", desc: "解析微信对话格式，自动提取发送人和内容", icon: MessageSquare, color: "text-green-500 bg-green-50" },
  { name: "图片识别", desc: "上传证书、简历照片，AI OCR 提取信息", icon: Image, color: "text-purple-500 bg-purple-50" },
  { name: "文件导入", desc: "支持 Excel、PDF、Word 批量导入档案", icon: Upload, color: "text-amber-500 bg-amber-50" },
];

export default function DataPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">数据管理</h1>
        <p className="text-sm text-muted-foreground">多源数据清洗、结构化处理与多模态信息提取</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DATA_SOURCES.map((src) => (
          <GlassCard key={src.name} hover index={0} className="flex items-start gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${src.color}`}>
              <src.icon size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[14px] font-bold">{src.name}</h3>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{src.desc}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="space-y-3">
        <h3 className="text-[14px] font-bold">清洗管道</h3>
        <div className="flex items-center gap-3">
          {["数据输入", "空白规范化", "空值过滤", "内容去重", "结构化输出"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted-foreground/30">→</span>}
              <span className="rounded-lg bg-white/80 px-3 py-1.5 text-[11px] font-medium ring-1 ring-border/30">{step}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">自动化数据清洗管道，支持自定义步骤扩展</p>
      </GlassCard>
    </div>
  );
}
