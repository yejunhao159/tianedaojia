"use client";

export function DouyinPreview({ content, image }: { content: string; image?: string }) {
  return (
    <div className="relative mx-auto flex h-[600px] w-[300px] flex-col overflow-hidden rounded-[2rem] border-[4px] border-gray-800 bg-black shadow-xl">
      <div className="flex items-center justify-between bg-black px-5 py-2 text-[10px] text-white/70"><span>9:41</span><span>100%</span></div>
      <div className="relative flex-1 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Background image */}
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        )}
        <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5">
          {[{ i: "♥", l: "1.2w" }, { i: "💬", l: "856" }, { i: "★", l: "收藏" }, { i: "→", l: "分享" }].map((a) => (
            <div key={a.l} className="flex flex-col items-center gap-1"><span className="text-lg text-white/80">{a.i}</span><span className="text-[9px] text-white/60">{a.l}</span></div>
          ))}
        </div>
        <div className="absolute right-14 bottom-6 left-4 space-y-2">
          <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-brand" /><span className="text-[11px] font-semibold text-white">@天鹅到家官方</span><span className="rounded-full border border-brand/60 px-1.5 py-px text-[9px] text-brand">+关注</span></div>
          <div className="max-h-[100px] overflow-y-auto text-[11px] leading-relaxed text-white/90">{content || <span className="text-white/30">等待AI生成抖音文案...</span>}</div>
        </div>
      </div>
      <div className="flex items-center justify-around bg-black py-2 text-[9px] text-white/40"><span>首页</span><span>朋友</span><span className="text-lg text-white">+</span><span>消息</span><span className="text-white/70">我</span></div>
    </div>
  );
}
