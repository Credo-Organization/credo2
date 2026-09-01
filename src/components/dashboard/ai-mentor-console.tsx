"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Loader2, 
  RotateCcw, 
  Copy, 
  Check,
  Terminal,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { askAiMentor, MentorMessage, MentorContext } from "@/actions/ai-mentor";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AiMentorConsoleProps {
  context: MentorContext;
  initialQuery?: string | null;
}

const TACTICAL_ACTIONS = [
  { 
    label: "🎯 14-Day Gap Plan", 
    prompt: "Give me a step-by-step 14-day study & project roadmap to close my top lagging skill gap.",
    bgClass: "bg-[#FCE7F3] dark:bg-pink-950/40 text-pink-950 dark:text-pink-200 hover:bg-[#FBCFE8] dark:hover:bg-pink-900/60",
  },
  { 
    label: "🏗️ Project Blueprint", 
    prompt: "Generate a production-grade portfolio project blueprint designed to impress hiring managers for my target role.",
    bgClass: "bg-[#FEF9C3] dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 hover:bg-[#FEF08A] dark:hover:bg-amber-900/60",
  },
  { 
    label: "🎙️ Mock Interview", 
    prompt: "Simulate a technical interview for my target role: ask me 3 challenging questions based on my verified skills.",
    bgClass: "bg-[#DCFCE7] dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 hover:bg-[#BBF7D0] dark:hover:bg-emerald-900/60",
  },
  { 
    label: "📦 GitHub Audit", 
    prompt: "How should I structure my GitHub repositories and READMEs to stand out to engineering recruiters?",
    bgClass: "bg-[#E0F2FE] dark:bg-sky-950/40 text-blue-950 dark:text-sky-200 hover:bg-[#BAE6FD] dark:hover:bg-sky-900/60",
  },
];

export function AiMentorConsole({ context, initialQuery }: AiMentorConsoleProps) {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      role: "assistant",
      content: `👋 Hi **${context.studentName || "there"}**! I am your **AI Career Mentor**, grounded directly in your **${context.verifiedSkills?.length || 0} verified skills** and audited GitHub repositories.

I'm ready to help you bridge your lagging gaps for the **${context.careerGoal || "Engineering"}** benchmark. Click a prompt above or ask me about system architecture, projects, or interview prep!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Scoped ref for the chat container to prevent global window scrolling
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll ONLY the internal chat container, NEVER the global document window
  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // Handle external query triggers from clicking gaps in the matrix
  useEffect(() => {
    if (initialQuery) {
      handleSendQuery(`How should I learn and master "${initialQuery}" to meet industry standards for a ${context.careerGoal || "software"} role?`);
    }
  }, [initialQuery]);

  const handleSendQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: MentorMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askAiMentor(trimmed, context, messages);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error: any) {
      toast.error("Failed to connect to AI Mentor. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ I encountered an error connecting to the AI inference engine. Please try asking again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Conversation reset. Ready to analyze your **${context.careerGoal || "career"}** path or architect new portfolio milestones.`,
      },
    ]);
  };

  const handleCopyMessage = (content: string, idx: number) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(content);
      setCopiedIndex(idx);
      toast.success("Copied mentor advice!");
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#FAF9F6] dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_0px_#18181B] dark:shadow-[4px_4px_0px_0px_#000000] p-5 select-none overflow-hidden flex flex-col transition-colors">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-zinc-900 dark:border-zinc-700">
        <div>
          <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-100 tracking-tight flex items-center gap-2">
            AI Career Mentor
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border-2 border-zinc-900 dark:border-zinc-700 text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-800 dark:text-amber-300" />
            Grounded in your passport
          </span>
          <button
            type="button"
            onClick={handleResetChat}
            title="Reset conversation"
            aria-label="Reset mentor conversation"
            className="p-1.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-[#BAE6FD] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Mentor Actions - Tactile Pastel Chips */}
      <div className="my-3">
        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5 select-none font-mono">
          QUICK MENTOR ACTIONS
        </div>

        <div className="flex flex-wrap gap-2">
          {TACTICAL_ACTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendQuery(item.prompt)}
              className={cn(
                "px-3 py-1.5 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] hover:shadow-[3px_3px_0px_0px_#18181B] active:translate-x-[1px] active:translate-y-[1px] text-xs font-black transition-all cursor-pointer disabled:opacity-50",
                item.bgClass
              )}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat History Canvas */}
      <div 
        ref={chatScrollContainerRef}
        role="log"
        aria-live="polite"
        className="h-[210px] overflow-y-auto space-y-3 mb-3 p-4 pr-5 rounded-2xl bg-white dark:bg-zinc-800/80 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000]"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex flex-col gap-1 text-xs w-full",
              msg.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div className="flex items-center gap-1.5 px-1 text-[10px] font-black text-zinc-500 uppercase font-mono">
              {msg.role === "user" ? "YOU" : "AI MENTOR"}
            </div>

            <div
              className={cn(
                "p-3.5 rounded-2xl max-w-[88%] relative group leading-relaxed",
                msg.role === "user"
                  ? "bg-[#BAE6FD] dark:bg-sky-950 text-blue-950 dark:text-sky-100 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] rounded-br-xs mr-1 font-medium"
                  : "bg-[#FAF9F6] dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] text-zinc-950 dark:text-zinc-100 rounded-bl-xs"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-xs max-w-none space-y-2 text-zinc-900 dark:text-zinc-100">
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => <h3 className="text-sm font-black text-zinc-950 dark:text-zinc-100 mt-2 mb-1" {...props} />,
                      h2: ({ ...props }) => <h4 className="text-xs font-black text-zinc-950 dark:text-zinc-100 mt-2 mb-1" {...props} />,
                      h3: ({ ...props }) => <h5 className="text-xs font-black text-zinc-950 dark:text-zinc-100 mt-2 mb-1" {...props} />,
                      p: ({ ...props }) => <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed mb-1.5" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-4 space-y-1 mb-1.5 text-xs text-zinc-800 dark:text-zinc-200" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-1.5 text-xs text-zinc-800 dark:text-zinc-200" {...props} />,
                      li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                      strong: ({ ...props }) => <strong className="font-black text-zinc-950 dark:text-zinc-100" {...props} />,
                      pre: ({ children }) => (
                        <div className="my-2 rounded-xl bg-zinc-950 text-zinc-100 border-2 border-zinc-900 overflow-hidden shadow-2xs">
                          <div className="flex items-center justify-between px-3 py-1 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono">
                            <span className="flex items-center gap-1.5">
                              <Terminal className="w-3 h-3 text-zinc-400" />
                              Code Blueprint
                            </span>
                          </div>
                          <pre className="p-3 overflow-x-auto text-[11px] font-mono leading-relaxed text-emerald-300">{children}</pre>
                        </div>
                      ),
                      code: ({ className, children, ...props }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="px-1.5 py-0.5 rounded bg-[#FEF9C3] dark:bg-amber-950/60 font-mono text-[11px] font-black text-amber-950 dark:text-amber-200 border border-amber-400/80" {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className="font-mono text-emerald-300" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
              )}

              {msg.role === "assistant" && (
                <button
                  type="button"
                  onClick={() => handleCopyMessage(msg.content, idx)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-900 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all cursor-pointer"
                  title="Copy advice"
                  aria-label="Copy message content"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#E0F2FE] dark:bg-sky-950 border-2 border-zinc-900 max-w-sm shadow-[2px_2px_0px_0px_#18181B]">
            <Loader2 className="w-4 h-4 text-blue-800 dark:text-sky-300 animate-spin" aria-hidden="true" />
            <span className="text-xs font-black text-blue-950 dark:text-sky-200 animate-pulse">
              Mentor analyzing your passport & gaps...
            </span>
          </div>
        )}
      </div>

      {/* Input Box with Pastel Feedback */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuery(input);
        }}
        className="flex items-center gap-2 w-full"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask mentor about ${context.careerGoal || "career"} gaps, projects, or prep...`}
          disabled={isLoading}
          aria-label={`Ask mentor about ${context.careerGoal || "career"} gaps`}
          className="flex-1 min-w-0 h-10 px-4 rounded-2xl bg-white dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] text-xs font-medium text-zinc-950 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:shadow-[3px_3px_0px_0px_#18181B] transition-all disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message to AI Mentor"
          className="h-10 px-4 rounded-2xl bg-zinc-950 hover:bg-[#BAE6FD] hover:text-blue-950 text-white font-black text-xs border-2 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#18181B] dark:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </form>

    </div>
  );
}
