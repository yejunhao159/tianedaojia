import Link from "next/link";
import { GlassCard } from "@/components/layout/GlassCard";
import { PenLine, Layers3, Target, FileText, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const STATS = [
  { label: "今日发布文案", value: "128", change: "+23%", Icon: FileText },
  { label: "结构化档案", value: "356", change: "+15%", Icon: Layers3 },
  { label: "成功匹配", value: "89", change: "+42%", Icon: CheckCircle2 },
  { label: "平均匹配时间", value: "2.5h", change: "-35%", Icon: Clock },
];

const MODULES = [
  { title: "招募文案生成", desc: "输入模糊需求，AI自动生成专业招募文案\n支持多语气切换 + 多渠道适配发布", href: "/generate", gradient: "from-red-500 to-orange-500", Icon: PenLine, tags: ["微信", "抖音", "小红书", "58同城"] },
  { title: "信息结构化", desc: "碎片化信息源自动解析为结构化档案\n多步LLM流水线：分类→抽取→合并", href: "/parse", gradient: "from-red-500 to-pink-500", Icon: Layers3, tags: ["微信", "电话", "朋友圈", "中介推荐"] },
  { title: "智能匹配", desc: "加权算法+LLM混合匹配\n硬指标快速过滤 → AI精排推荐", href: "/match", gradient: "from-red-600 to-purple-600", Icon: Target, tags: ["雷达图对比", "权重可调"] },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">总控仪表盘</h1>
        <p className="text-sm text-muted-foreground">欢迎回来，查看今日招募进度与数据概览</p>
      </div>

      <GlassCard className="flex items-center justify-between">
        {[
          { n: "1", title: "需求发布", desc: "文案生成 + 多渠道发布", active: true },
          null,
          { n: "2", title: "结构化初筛", desc: "信息抽取 + 档案生成", active: false },
          null,
          { n: "3", title: "智能匹配", desc: "多维匹配 + AI推荐", active: false },
        ].map((step, i) => {
          if (!step) return <svg key={i} className="h-5 w-5 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold ${step.active ? "bg-brand text-white" : "bg-brand/10 text-brand/60"}`}>{step.n}</div>
              <div><p className="text-sm font-semibold">{step.title}</p><p className="text-xs text-muted-foreground">{step.desc}</p></div>
            </div>
          );
        })}
      </GlassCard>

      <div className="grid grid-cols-4 gap-4">
        {STATS.map((s) => (
          <GlassCard key={s.label} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-600">{s.label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/6"><s.Icon size={16} className="text-brand" strokeWidth={1.8} /></span>
            </div>
            <p className="text-3xl font-extrabold tracking-tight">{s.value}</p>
            <div className="flex items-center gap-1.5 text-xs"><TrendingUp size={12} className="text-green-600" /><span className="font-semibold text-green-600">{s.change}</span><span className="text-slate-500">较上周</span></div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {MODULES.map((m) => (
          <Link key={m.href} href={m.href}>
            <GlassCard className="group h-full space-y-4 transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${m.gradient} text-white`}><m.Icon size={20} strokeWidth={1.8} /></div>
                <h2 className="text-base font-bold">{m.title}</h2>
              </div>
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">{m.desc}</p>
              <div className="flex flex-wrap gap-1.5">{m.tags.map((t) => <span key={t} className="rounded-full bg-brand/6 px-2.5 py-1 text-[11px] font-medium text-brand">{t}</span>)}</div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
