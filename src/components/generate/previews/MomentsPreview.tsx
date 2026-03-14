"use client";

export function MomentsPreview({ content, image }: { content: string; image?: string }) {
  return (
    <div className="mx-auto flex h-[600px] w-[300px] flex-col overflow-hidden rounded-[2rem] border-[4px] border-gray-300 bg-white shadow-xl">
      <div className="flex items-center justify-between bg-[#ededed] px-5 py-2 text-[10px] text-gray-600"><span>9:41</span><span className="font-medium">朋友圈</span><span>📷</span></div>
      <div className="flex-1 bg-white p-4 overflow-y-auto">
        <div className="flex gap-3">
          <div className="h-10 w-10 shrink-0 rounded-md bg-brand" />
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-sm font-semibold text-blue-800">天鹅到家招募</p>
            <div className="text-[12px] leading-relaxed text-gray-800">{content ? <p className="whitespace-pre-wrap">{content.slice(0, 300)}{content.length > 300 && "..."}</p> : <p className="text-gray-300">等待AI生成朋友圈文案...</p>}</div>
            {/* Image grid */}
            <div className="grid grid-cols-3 gap-1">
              {image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="col-span-2 row-span-2 aspect-square w-full rounded object-cover" />
                  <div className="aspect-square rounded bg-gray-100" />
                  <div className="aspect-square rounded bg-gray-100" />
                </>
              ) : (
                [1, 2, 3].map((i) => <div key={i} className="aspect-square rounded bg-gray-100" />)
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-400"><span>刚刚</span><div className="flex gap-3"><span>赞</span><span>评论</span></div></div>
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-100" /><div className="h-12 bg-white" />
    </div>
  );
}
