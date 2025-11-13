"use client";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  User,
  Send,
  Loader2,
  Trash2,
  Search,
  RefreshCw,
} from "lucide-react";

type Msg = {
  id: number;
  sender: string;
  content: string;
  created_at: string;
};

type Session = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  last_message: string;
  message_count: number;
  messages?: Msg[];
};

export default function MedicalChatPage() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("token") : null
  );

  // Keep token in state in case user logs in while this page is mounted
  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("token");
    setToken(t);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") setToken(e.newValue);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  // Create a new session
  const createSession = async (title = "Medical Consultation") => {
    try {
      setLoading(true);
      setBackendAvailable(true);
      const authHeaderValue = token
        ? token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`
        : null;

      const res = await fetch(api(`/api/chat/sessions/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeaderValue ? { Authorization: authHeaderValue } : {}),
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        console.error("Create session failed", res.status, txt);
        setError(
          (txt && txt.toString()) ||
            `Failed to create chat session (status ${res.status})`
        );
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      let data: any = null;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const txt = await res.text().catch(() => null);
        console.error("Create session returned non-JSON", res.status, txt);
        setError((txt && txt.toString()) || "Failed to create chat session");
        return;
      }

      if (data.success) {
        setSessionId(data.session.id);
        setError("");
        setMessages([]);
        // refresh session list
        await fetchSessions();
      } else {
        setError(data.message || "Failed to create session");
      }
    } catch (err) {
      console.error(err);
      setBackendAvailable(false);
      setError("Chat backend unreachable");
    } finally {
      setLoading(false);
    }
  };

  // Fetch list of sessions (previous chats)
  const fetchSessions = async () => {
    try {
      const t =
        typeof window !== "undefined" ? localStorage.getItem("token") : token;
      const authHeader = t
        ? t.startsWith("Bearer ")
          ? t
          : `Bearer ${t}`
        : null;

      const res = await fetch(api(`/api/chat/sessions/`), {
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch sessions:", res.status);
        setError(`Failed to load chat sessions (status ${res.status})`);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        console.error("Unexpected non-JSON response for sessions");
        setError("Invalid response format from server");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);

        // Auto-select the first session if none selected and we have sessions
        if (!sessionId && data.sessions && data.sessions.length > 0) {
          const firstSessionId = data.sessions[0].id;
          setSessionId(firstSessionId);
          await fetchMessages(firstSessionId);
        }

        // If no sessions exist, create one automatically
        if (data.sessions && data.sessions.length === 0) {
          await createSession();
        }
      } else {
        console.error("Failed to fetch sessions:", data.message);
        setError(data.message || "Failed to load chat sessions");
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setBackendAvailable(false);
      setError("Unable to load chat sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMessages = async (sid: number) => {
    setMessagesLoading(true);
    setMessages([]);
    try {
      const t =
        typeof window !== "undefined" ? localStorage.getItem("token") : token;
      const authHeader = t
        ? t.startsWith("Bearer ")
          ? t
          : `Bearer ${t}`
        : null;

      const res = await fetch(api(`/api/chat/sessions/${sid}/messages/`), {
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      });

      if (!res.ok) {
        console.error(
          `Failed to fetch messages for session ${sid}:`,
          res.status
        );
        setError(`Failed to load messages (status ${res.status})`);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        console.error("Unexpected non-JSON response for messages");
        setError("Invalid response format from server");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
        setError("");
      } else {
        setError(data.message || "Failed to load messages");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Unable to load messages");
      setBackendAvailable(false);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Avoid an automatic jump when the page first loads (e.g. when navigating
  // to the chat page). Only auto-scroll on subsequent message updates.
  const initialScrollRef = React.useRef(true);
  useEffect(() => {
    if (initialScrollRef.current) {
      initialScrollRef.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSessionSelect = async (selectedSessionId: number) => {
    setSessionId(selectedSessionId);
    await fetchMessages(selectedSessionId);
    setSearchQuery(""); // Clear search when switching sessions
  };

  const handleSend = async () => {
    if (!backendAvailable) {
      setError("Chat backend is unavailable. Please retry later.");
      return;
    }
    if (!input.trim() || !sessionId || loading) return;

    const content = input.trim();
    const tempUser: Msg = {
      id: Date.now(),
      sender: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((m) => [...m, tempUser]);
    setInput("");
    setLoading(true);
    setIsTyping(true);
    setError("");

    try {
      const authH = token
        ? token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`
        : null;

      const res = await fetch(
        api(`/api/chat/sessions/${sessionId}/messages/`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(authH ? { Authorization: authH } : {}),
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const errData = await res.json().catch(() => null);
          setError(
            (errData && (errData.message || JSON.stringify(errData))) ||
              "Server error"
          );
        } else {
          const txt = await res.text().catch(() => null);
          setError(txt || "Server error");
        }
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const txt = await res.text().catch(() => "");
        setError(txt || "Unexpected response from server");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setMessages((m) => [
          ...m.filter((mm) => mm.id !== tempUser.id),
          data.user_message,
          data.assistant_message,
        ]);
        // Refresh sessions to update last message and timestamps
        await fetchSessions();
      } else {
        setError(data.message || "Failed to send");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to send message");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = async () => {
    if (!backendAvailable) {
      setError("Chat backend is unavailable. Cannot start a new chat.");
      return;
    }
    await createSession("New Medical Consultation");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) =>
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const medicalPrompts = [
    "What are common symptoms of flu?",
    "How to manage stress and anxiety?",
    "What foods help boost immunity?",
    "When should I see a doctor for a headache?",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-[700px] flex">
        {/* Sidebar - Fixed Search and Chat History */}
        <div className="w-60 bg-white border-r border-gray-200 flex flex-col min-h-0">
          {/* Fixed Header */}
          <div className="px-3 py-2 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800 truncate whitespace-nowrap overflow-hidden">
                Medical Chats
              </h2>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSessions}
                  className="flex items-center space-x-1"
                  title="Refresh chats"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                  className="flex items-center space-x-1"
                  title="New chat"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Fixed Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Chat History List */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <div className="text-xs text-gray-500 px-3 py-4 text-center">
                  No previous conversations
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => createSession()}
                    className="mt-2 w-full"
                  >
                    Start New Chat
                  </Button>
                </div>
              ) : (
                sessions.map((s: Session) => {
                  const active = sessionId === s.id;
                  const lastMsg = s.last_message || "No messages yet";
                  const updatedAt = s.updated_at
                    ? new Date(s.updated_at)
                    : null;
                  const messageCount = s.message_count || 0;

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSessionSelect(s.id)}
                      className={`p-3 rounded-lg cursor-pointer flex flex-col border transition-colors ${
                        active
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50 border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium text-sm text-gray-800 truncate flex-1">
                          {s.title || `Conversation ${s.id}`}
                        </div>
                        {updatedAt && (
                          <div className="text-[10px] text-gray-400 whitespace-nowrap">
                            {updatedAt.toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-gray-600 truncate flex-1">
                          {lastMsg}
                        </div>
                        {messageCount > 0 && (
                          <div className="text-[10px] bg-gray-200 text-gray-600 px-1 rounded ml-2">
                            {messageCount}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 justify-start">
          <Card className="flex flex-col shadow-sm border border-gray-200 h-[600px] w-full">
            <CardHeader className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Medical Assistant
                  </CardTitle>
                  <p className="text-xs text-gray-600">
                    Providing general medical information
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-1 flex flex-col min-h-0">
              {/* Offline banner */}
              {!backendAvailable && (
                <div className="p-2 bg-yellow-50 border-b border-yellow-200 text-yellow-800 flex items-center justify-between">
                  <div className="text-sm">
                    Chat backend is unavailable. Messages cannot be sent or
                    loaded right now.
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setBackendAvailable(true);
                      fetchSessions();
                    }}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Chat Messages Area - This will scroll */}
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <ScrollArea className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-3 space-y-4 pb-24">
                    {/* reserve space for sticky input */}
                    {messagesLoading && (
                      <div className="text-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-500" />
                        <div className="text-sm text-gray-500 mt-2">
                          Loading messages...
                        </div>
                      </div>
                    )}
                    {!messagesLoading && messages.length === 0 && (
                      <div className="text-center py-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Bot className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Welcome to Medical Assistant
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                          I'm here to provide general health information and
                          answer your medical questions. Remember, I'm not a
                          substitute for professional medical advice.
                        </p>

                        <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                          {medicalPrompts.map((prompt, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="justify-start h-auto py-2 px-3 text-left hover:bg-blue-50 hover:border-blue-200 text-sm font-normal"
                              onClick={() => setInput(prompt)}
                            >
                              {prompt}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {(searchQuery ? filteredMessages : messages).map((m) => (
                        <div
                          key={m.id}
                          className={`flex gap-3 ${
                            m.sender === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <Avatar
                            className={`w-7 h-7 ${
                              m.sender === "user"
                                ? "bg-blue-600"
                                : "bg-green-600"
                            }`}
                          >
                            <AvatarFallback className="bg-transparent">
                              {m.sender === "user" ? (
                                <User className="w-3.5 h-3.5 text-white" />
                              ) : (
                                <Bot className="w-3.5 h-3.5 text-white" />
                              )}
                            </AvatarFallback>
                          </Avatar>

                          <div
                            className={`flex-1 max-w-[70%] ${
                              m.sender === "user" ? "text-right" : "text-left"
                            }`}
                          >
                            <div
                              className={`inline-block p-3 rounded-xl ${
                                m.sender === "user"
                                  ? "bg-blue-600 text-white rounded-br-none"
                                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                              }`}
                            >
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {formatMessage(m.content)}
                              </div>
                            </div>
                            <div
                              className={`text-xs text-gray-500 mt-1 ${
                                m.sender === "user" ? "text-right" : "text-left"
                              }`}
                            >
                              {new Date(m.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex gap-3">
                          <Avatar className="w-7 h-7 bg-green-600">
                            <AvatarFallback className="bg-transparent">
                              <Bot className="w-3.5 h-3.5 text-white" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white border border-gray-200 rounded-xl rounded-bl-none p-3">
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={bottomRef} />
                    </div>
                  </div>
                </ScrollArea>
              </div>

              {/* Input Area - sticky at the bottom so it doesn't push messages when textarea resizes */}
              <div className="border-t border-gray-200 bg-white p-3 flex-shrink-0 sticky bottom-0 bg-white/95 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto">
                  {error && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-800">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about symptoms, medications, or general health advice..."
                        className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[44px] max-h-[100px] bg-white"
                        rows={1}
                        disabled={loading}
                      />
                    </div>

                    <Button
                      onClick={handleSend}
                      disabled={loading || !input.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-[44px] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 text-center mt-2">
                    Medical Assistant provides general information only. For
                    medical emergencies, contact your healthcare provider
                    immediately.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
