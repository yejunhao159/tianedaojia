"use client";

export function XiaohongshuPreview({ content, image }: { content: string; image?: string }) {
  const lines = content.split("\n").filter(Boolean);
  const title = lines[0] ?? "";
  const body = lines.slice(1).join("\n");
  const tags = content.match(/#[^\s#]+/g) ?? [];

  return (
    <div className="mx-auto flex h-[600px] w-[300px] flex-col overflow-hidden rounded-[2rem] border-[4px] border-gray-300 bg-white shadow-xl">
      <div className="flex items-center justify-between bg-white px-5 py-2 text-[10px] text-gray-500"><span>9:41</span><span>100%</span></div>
      {/* Cover image */}
      <div className="aspect-[3/4] bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-3xl opacity-30">📕</span>
        )}
      </div>
      <div className="flex-1 space-y-2.5 overflow-y-auto p-3.5">
        {content ? (<>
          <div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-brand" /><span className="text-[11px] font-semibold">天鹅到家</span><span className="rounded-full bg-brand px-1.5 py-px text-[9px] text-white">关注</span></div>
          <h3 className="text-[13px] font-bold leading-tight">{title}</h3>
          <p className="whitespace-pre-wrap text-[11px] leading-relaxed text-gray-700">{body.slice(0, 300)}</p>
          {tags.length > 0 && <div className="flex flex-wrap gap-1">{tags.slice(0, 6).map((t, i) => <span key={i} className="text-[10px] text-blue-500">{t}</span>)}</div>}
        </>) : <p className="py-6 text-center text-[12px] text-gray-300">等待AI生成小红书笔记...</p>}
      </div>
      <div className="flex items-center justify-around border-t py-2 text-[9px] text-gray-400"><span>♥ 2.1w</span><span>★ 8563</span><span>💬 1204</span><span>分享</span></div>
    </div>
  );
}
