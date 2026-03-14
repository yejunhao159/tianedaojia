import type { RawDataInput, CleanedRecord } from "./types";

export function parseTextInput(input: RawDataInput): CleanedRecord[] {
  const lines = input.content.split(/\n+/).filter(Boolean);
  return lines.map((line, i) => ({
    id: `text-${i}`,
    fields: { raw: line.trim() },
    confidence: 0.5,
    source: input.source,
    warnings: [],
    rawSnippet: line.trim().slice(0, 100),
  }));
}

export function parseWechatChat(input: RawDataInput): CleanedRecord[] {
  const messagePattern = /^(.+?)\s*[：:]\s*(.+)$/gm;
  const records: CleanedRecord[] = [];
  let match;
  let i = 0;

  while ((match = messagePattern.exec(input.content)) !== null) {
    records.push({
      id: `wechat-${i++}`,
      fields: {
        sender: match[1].trim(),
        content: match[2].trim(),
      },
      confidence: 0.7,
      source: "wechat_chat",
      warnings: [],
      rawSnippet: match[0].slice(0, 100),
    });
  }

  if (records.length === 0) {
    return parseTextInput(input);
  }

  return records;
}

export function getParser(source: RawDataInput["source"]) {
  switch (source) {
    case "wechat_chat": return parseWechatChat;
    case "text":
    default: return parseTextInput;
  }
}
