"use client";

interface Props { content: string; image?: string }

export function WechatGroupPreview({ content, image }: Props) {
  return (
    <div className="w-[320px] overflow-hidden rounded-2xl bg-[#EDEDED] shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 bg-[#EDEDED] px-4 py-2.5">
        <span className="text-[13px] font-semibold text-gray-700">家政招聘群</span>
        <span className="text-[11px] text-gray-400">(128)</span>
      </div>

      {/* Chat area */}
      <div className="min-h-[260px] space-y-3 bg-[#EDEDED] px-3 py-3">
        {/* Message bubble */}
        <div className="flex gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand text-[11px] font-bold text-white">
            天鹅
          </div>
          <div className="max-w-[230px]">
            <p className="mb-1 text-[10px] text-gray-400">天鹅到家-运营</p>
            <div className="rounded-lg bg-white px-3 py-2.5 shadow-sm">
              {content ? (
                <p className="whitespace-pre-wrap text-[12px] leading-[1.7] text-gray-800">{content}</p>
              ) : (
                <p className="text-[12px] text-gray-300">等待生成群消息...</p>
              )}
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" className="mt-2 w-full rounded-md" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-gray-300/50 bg-[#F6F6F6] px-3 py-2.5">
        <div className="flex-1 rounded-md bg-white px-3 py-1.5 text-[11px] text-gray-300">输入消息...</div>
        <span className="text-[11px] text-gray-400">发送</span>
      </div>
    </div>
  );
}
