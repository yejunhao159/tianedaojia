"use client";

export function WechatPreview({ content, image }: { content: string; image?: string }) {
  const lines = content.split("\n").filter(Boolean);
  const title = lines[0] ?? "天鹅到家 · 招募公告";
  const body = lines.slice(1).join("\n");

  return (
    <div className="mx-auto flex h-[600px] w-[300px] flex-col overflow-hidden rounded-[2rem] border-[4px] border-gray-300 bg-[#f5f5f5] shadow-xl">
      <div className="flex items-center justify-between bg-[#ededed] px-5 py-2 text-[10px] text-gray-600"><span>9:41</span><span className="font-medium">公众号文章</span><span>···</span></div>
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Cover image */}
        <div className="aspect-[2/1] bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="text-center"><span className="text-2xl">🦢</span><p className="mt-1 text-[10px] text-gray-400">天鹅到家</p></div>
          )}
        </div>
        <div className="space-y-3 p-4">
          {content ? (<>
            <h1 className="text-base font-bold leading-snug">{title}</h1>
            <div className="flex items-center gap-2 text-[10px] text-gray-400"><span>天鹅到家招募</span><span>·</span><span>刚刚</span></div>
            <div className="whitespace-pre-wrap text-[12px] leading-[1.8] text-gray-700">{body}</div>
          </>) : <p className="py-10 text-center text-[13px] text-gray-300">等待AI生成微信公众号文案...</p>}
        </div>
      </div>
      <div className="flex items-center justify-between border-t bg-white px-4 py-2"><div className="flex gap-3 text-[9px] text-gray-400"><span>在看 128</span><span>赞 256</span></div><span className="text-[9px] text-gray-400">留言</span></div>
    </div>
  );
}
