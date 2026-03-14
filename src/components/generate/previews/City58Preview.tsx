"use client";

function extract(content: string, field: string) {
  const m = content.match(new RegExp(`【${field}】[：:]?\\s*([\\s\\S]*?)(?=【|$)`));
  return m?.[1]?.trim() ?? "";
}

export function City58Preview({ content, image }: { content: string; image?: string }) {
  const title = extract(content, "职位名称") || "招聘家政服务人员";
  const salary = extract(content, "薪资待遇") || extract(content, "薪资");
  const location = extract(content, "工作地点");
  const duties = extract(content, "岗位职责");
  const reqs = extract(content, "任职要求");

  return (
    <div className="mx-auto flex h-[600px] w-[300px] flex-col overflow-hidden rounded-[2rem] border-[4px] border-gray-200 bg-white shadow-xl">
      <div className="bg-[#ff552e] px-4 py-3"><div className="flex items-center gap-2"><span className="text-lg font-bold text-white">58</span><span className="text-xs text-white/80">同城 · 招聘</span></div></div>
      {/* Banner image */}
      {image && (
        <div className="aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {content ? (<>
          <div><h3 className="text-[15px] font-bold text-gray-900">{title}</h3>{salary && <p className="mt-1 text-base font-bold text-[#ff552e]">{salary}</p>}</div>
          {location && <div className="flex items-center gap-1 text-[11px] text-gray-500">📍 {location}</div>}
          <div className="flex flex-wrap gap-1">{["包住", "包吃", "急招"].map((t) => <span key={t} className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] text-orange-600">{t}</span>)}</div>
          {duties && <div><h4 className="mb-1 text-[11px] font-semibold text-gray-700">岗位职责</h4><p className="whitespace-pre-wrap text-[11px] leading-relaxed text-gray-600">{duties.slice(0, 150)}</p></div>}
          {reqs && <div><h4 className="mb-1 text-[11px] font-semibold text-gray-700">任职要求</h4><p className="whitespace-pre-wrap text-[11px] leading-relaxed text-gray-600">{reqs.slice(0, 150)}</p></div>}
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2.5"><div className="h-7 w-7 rounded bg-brand" /><div><p className="text-[11px] font-semibold">天鹅到家</p><p className="text-[9px] text-gray-400">已认证</p></div></div>
        </>) : <div className="py-10 text-center text-[13px] text-gray-300">等待AI生成58同城文案...</div>}
      </div>
      <div className="border-t px-4 py-2.5"><button className="w-full rounded-lg bg-[#ff552e] py-2 text-center text-[12px] font-semibold text-white">立即沟通</button></div>
    </div>
  );
}
