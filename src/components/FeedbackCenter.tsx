import React, { useState } from "react";
import { Feedback, MoyuanState } from "../types";
import { Send, Star, Shield, Gift, HelpCircle, CheckCircle, MessagesSquare } from "lucide-react";

interface FeedbackCenterProps {
  state: MoyuanState;
  onChangeState: (updater: (prev: MoyuanState) => MoyuanState) => void;
  onAddTicket: (amount: number) => void;
}

const SEED_FEEDBACKS: Feedback[] = [
  {
    id: "f-1",
    name: "李清寒",
    contact: "li.qinghan@outlook.com",
    rating: 5,
    content: "沉浸式链式思考真的非常震撼！用来做量子纠错算法的仿真推导演算时，给出的解题思路非常清晰，逻辑严谨。针对中文常识纠正做得也很到位，大幅减少了生成幻觉。极度期待正式版！",
    timestamp: "2026-07-01 14:32",
    isOfficialCoCreator: true,
  },
  {
    id: "f-2",
    name: "Dr. Zhang",
    contact: "zhang_quantum@tsinghua.edu.cn",
    rating: 5,
    content: "在算力调度策略上建议系统能够对高并发时间段做更自适应的缓冲。VIP通道的体验很好，确实能感觉到高带宽算力在支持，希望能继续扩充超长上下文对齐的记忆记忆模型。",
    timestamp: "2026-07-02 09:15",
    isOfficialCoCreator: true,
  }
];

export default function FeedbackCenter({ state, onChangeState, onAddTicket }: FeedbackCenterProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(SEED_FEEDBACKS);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      name,
      contact: contact || "anonymous@moyuan.ai",
      rating,
      content,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      isOfficialCoCreator: true,
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setName("");
    setContact("");
    setContent("");
    setRating(5);
    setSubmitted(true);

    // Reward for feedback!
    onAddTicket(150);
    
    // Elevate co-creator rank
    onChangeState((prev) => {
      let nextRank = prev.coCreatorRank;
      if (prev.coCreatorRank === "Normal") {
        nextRank = "Contributor";
      } else if (prev.coCreatorRank === "Contributor") {
        nextRank = "Elder";
      } else if (prev.coCreatorRank === "Elder") {
        nextRank = "Supreme Co-Creator";
      }

      return {
        ...prev,
        coCreatorRank: nextRank,
      };
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="p-6 md:p-8 rounded-xl bg-surface-container/60 backdrop-blur-xl border border-outline-variant/20 shadow-2xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded bg-tertiary/10 text-tertiary border border-tertiary/20">
          <MessagesSquare className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-headline-lg text-lg text-white">官方共创与反馈中心</h3>
          <p className="text-xs text-on-surface-variant font-sans">
            您的每一份反馈都将作为未来版本优化、等级划定和权益结算的重要依据
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Submission Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-on-surface-variant block">共创者署名 *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：王教授 / 匿名"
                  className="w-full px-3 py-1.5 rounded bg-surface-container-low border border-outline-variant/20 text-xs text-white placeholder-on-surface-variant/30 focus:outline-none focus:border-tertiary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono text-on-surface-variant block">联系邮箱</label>
                <input
                  type="email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-1.5 rounded bg-surface-container-low border border-outline-variant/20 text-xs text-white placeholder-on-surface-variant/30 focus:outline-none focus:border-tertiary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono text-on-surface-variant">测试体验满意度：</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 text-secondary hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${star <= rating ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-on-surface-variant block">详细描述 / 改进意见 *</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请详细描述您在公测中遇到的 Bug、算力延迟、语义偏差，或对“沉浸式链式思考”模型的改善建议..."
                className="w-full h-32 p-3 rounded bg-surface-container-low border border-outline-variant/20 text-xs text-white placeholder-on-surface-variant/30 focus:outline-none focus:border-tertiary resize-none"
              />
            </div>

            <div className="p-3 rounded bg-secondary/10 border border-secondary/20 text-[11px] text-secondary flex items-start gap-2 leading-relaxed">
              <Gift className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>共创奖励提示</strong>：提交此反馈将为您累计贡献。系统会自动将您的共创者档位跃迁，并向您的资产面板中发放 <strong className="font-mono text-white">150 模拟书券</strong>！
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-sans font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              提交共创意见
            </button>
          </form>

          {submitted && (
            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>提交成功！模拟书券已发放至资产面板，共创等级已跃迁。</span>
            </div>
          )}
        </div>

        {/* Right Column - Existing Feedbacks */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono text-secondary block uppercase tracking-wider">实时共创反馈看板：</span>
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10 space-y-2 relative"
              >
                <div className="flex justify-between items-center border-b border-outline-variant/5 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-xs text-white">{item.name}</span>
                    {item.isOfficialCoCreator && (
                      <span className="text-[9px] px-1.5 py-0.2 font-mono rounded bg-secondary/10 text-secondary border border-secondary/20">
                        官方共创者
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-on-surface-variant/70 font-mono">{item.timestamp}</span>
                </div>

                <div className="flex gap-0.5 text-[10px] text-secondary">
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3 h-3 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
