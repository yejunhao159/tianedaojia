"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid, PenLine, Layers3, Target,
  Send, Settings, Bird,
  PanelLeftClose, PanelLeftOpen, History,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { label: "招募管理", type: "section" as const },
  { href: "/", icon: LayoutGrid, label: "招募中心" },
  { href: "/generate", icon: PenLine, label: "文案生成", prefix: true },
  { href: "/parse", icon: Layers3, label: "信息结构化" },
  { href: "/match", icon: Target, label: "智能匹配" },
  { label: "运营工具", type: "section" as const },
  { href: "/publish", icon: Send, label: "发布管理" },
  { href: "/history", icon: History, label: "历史记录" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("glass flex h-screen shrink-0 flex-col border-r border-sidebar-border transition-all duration-300", collapsed ? "w-[68px]" : "w-[220px]")}>
      <div className={cn("flex items-center gap-3 py-5", collapsed ? "justify-center px-3" : "px-5")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
          <Bird size={20} strokeWidth={1.8} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-[14px] font-bold tracking-tight">天鹅到家</h1>
            <p className="text-[10px] font-medium text-muted-foreground">AI 智能招募</p>
          </div>
        )}
      </div>

      <nav className={cn("flex flex-1 flex-col gap-0.5 overflow-y-auto pb-4", collapsed ? "px-2" : "px-3")}>
        {NAV.map((item, i) => {
          if (item.type === "section") {
            if (collapsed) return null;
            return <p key={i} className="mt-4 mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/40">{item.label}</p>;
          }
          const active = item.prefix ? pathname.startsWith(item.href!) : pathname === item.href;
          const Icon = item.icon!;
          return (
            <Link key={item.href} href={item.href!} title={collapsed ? item.label : undefined}
              className={cn("flex items-center gap-2.5 rounded-xl text-[12.5px] font-medium transition-all", collapsed ? "justify-center p-2.5" : "px-3 py-2",
                active ? "bg-secondary text-brand font-semibold" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}>
              {active && !collapsed && <span className="h-4 w-[3px] rounded-full bg-brand" />}
              <Icon size={16} strokeWidth={active ? 2 : 1.5} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t border-sidebar-border", collapsed ? "px-2 py-2" : "px-3 py-2")}>
        <button onClick={() => setCollapsed(!collapsed)} className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground", collapsed && "justify-center")}>
          {collapsed ? <PanelLeftOpen size={15} strokeWidth={1.5} /> : <><PanelLeftClose size={15} strokeWidth={1.5} /><span>收起</span></>}
        </button>
      </div>

      <div className={cn("border-t border-sidebar-border", collapsed ? "px-2 py-3" : "px-4 py-3")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2.5")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/8 text-[11px] font-semibold text-brand">管</div>
          {!collapsed && (
            <><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-medium">管理员</p></div>
            <button className="rounded-lg p-1 text-muted-foreground hover:bg-muted/60"><Settings size={14} strokeWidth={1.5} /></button></>
          )}
        </div>
      </div>
    </aside>
  );
}
