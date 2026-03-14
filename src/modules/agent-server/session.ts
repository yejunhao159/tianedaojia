import type { ConversationSession, AgentMessage } from "./types";

const sessions = new Map<string, ConversationSession>();
const SESSION_TTL = 30 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.lastActiveAt > SESSION_TTL) sessions.delete(id);
  }
}, 5 * 60 * 1000);

export function createSession(agentId: string): ConversationSession {
  const session: ConversationSession = {
    id: crypto.randomUUID(),
    agentId,
    messages: [],
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): ConversationSession | null {
  const s = sessions.get(id);
  if (s) s.lastActiveAt = Date.now();
  return s ?? null;
}

export function deleteSession(id: string): boolean {
  return sessions.delete(id);
}

export function addMessage(sessionId: string, message: Omit<AgentMessage, "timestamp">): AgentMessage | null {
  const session = getSession(sessionId);
  if (!session) return null;

  const msg: AgentMessage = { ...message, timestamp: Date.now() };
  session.messages.push(msg);
  return msg;
}

export function getHistory(sessionId: string): AgentMessage[] {
  return getSession(sessionId)?.messages ?? [];
}

export function listSessions(): ConversationSession[] {
  return [...sessions.values()].sort((a, b) => b.lastActiveAt - a.lastActiveAt);
}
