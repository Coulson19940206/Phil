import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoyuanState } from "../types";
import { Coins, Zap, ShieldAlert, Award, ChevronRight, Gift, Key, Check } from "lucide-react";

interface AssetPanelProps {
  state: MoyuanState;
  onChangeState: (updater: (prev: MoyuanState) => MoyuanState) => void;
  onRefill: () => void;
}

export default function AssetPanel({ state, onChangeState, onRefill }: AssetPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState(false);

  // Rewards multipliers based on simulations completed and co-creator rank
  const getMultiplier = () => {
    if (state.coCreatorRank === "Supreme Co-Creator") return 2.0;
    if (state.coCreatorRank === "Elder") return 1.8;
    if (state.coCreatorRank === "Contributor") return 1.6;
    return 1.5;
  };

  const multiplier = getMultiplier();
  const estimatedReturn = Math.round(state.tickets * multiplier);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError("");
    setCodeSuccess(false);

    const code = promoCode.trim().toUpperCase();

    if (code === "MOYUAN_VIP_2024" || code === "DEEP_ORIGIN" || code === "AI_STUDIO_BETA") {
      onChangeState((prev) => {
        let newRank = prev.coCreatorRank;
        if (code === "MOYUAN_VIP_2024") {
          newRank = "Supreme Co-Creator";
        } else if (prev.coCreatorRank === "Normal") {
          newRank = "Contributor";
        }

        return {
          ...prev,
          isVip: true,
          points: prev.maxPoints,
          tickets: prev.tickets + (code === "MOYUAN_VIP_2024" ? 1000 : 500),
          coCreatorRank: newRank as any,
          vipCode: code,
        };
      });
      setCodeSuccess(true);
      setPromoCode("");
    } else {
      setCodeError("无效的邀请码，请尝试：MOYUAN_VIP_2024 或 DEEP_ORIGIN");
    }
  };

  return (
    <>
      {/* Floating Pill on the bottom-right for quick entry */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-secondary hover:bg-secondary/90 text-on-secondary px-4 py-2.5 rounded-full font-sans font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(233,195,73,0.3)] border border-secondary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Coins className="w-4 h-4" />
        个人资产面板 & 权益追踪
      </motion.button>

      {/* Slide-out Sidebar Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            ></motion.div>

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-surface-container border-l border-outline-variant/30 shadow-2xl overflow-y-auto p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-secondary" />
                    <h3 className="font-headline-lg text-lg text-white">个人公测资产面板</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-on-surface-variant hover:text-white p-1 hover:bg-surface-bright rounded transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Banner / Info */}
                <div className="p-4 rounded-lg bg-surface-container-high border border-outline-variant/10 text-xs text-on-surface-variant space-y-1">
                  <p className="font-semibold text-white">公测共创资产实时追踪：</p>
                  <p className="leading-relaxed">
                    公测期间进行的能力演练、提交的反馈和签到，都将自动累计为您在此面板中的公测资产。正式上线后，系统将自动核算。
                  </p>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-on-surface-variant font-sans">基础墨值算力</span>
                      <Zap className="w-4 h-4 text-tertiary" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-mono text-white font-bold">{state.points}</span>
                      <span className="text-[10px] text-on-surface-variant font-mono">/ {state.maxPoints} 点</span>
                    </div>
                    <button
                      onClick={onRefill}
                      className="mt-3 w-full text-center py-1 rounded bg-tertiary/10 hover:bg-tertiary/20 text-tertiary border border-tertiary/20 text-[10px] font-mono transition-colors"
                    >
                      点击签到 补足墨值
                    </button>
                  </div>

                  <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-on-surface-variant font-sans">模拟书券收益</span>
                      <Coins className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-mono text-secondary font-bold">{state.tickets}</span>
                      <span className="text-[10px] text-on-surface-variant font-mono">书券</span>
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-3">
                      进行算力模拟或反馈可得
                    </div>
                  </div>
                </div>

                {/* Return Calculator card */}
                <div className="p-5 rounded-lg bg-surface-container-high border border-secondary/20 space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-secondary" />
                    <h4 className="font-headline-lg text-sm text-white">公测权益正式版返还核算</h4>
                  </div>
                  
                  <div className="space-y-3 text-xs border-t border-b border-outline-variant/10 py-3">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">共创贡献档位</span>
                      <span className="text-white font-bold font-mono">
                        {state.coCreatorRank === "Normal" && "普通共创者"}
                        {state.coCreatorRank === "Contributor" && "核心贡献者"}
                        {state.coCreatorRank === "Elder" && "墨渊元老"}
                        {state.coCreatorRank === "Supreme Co-Creator" && "至高共创官"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">结算权益返还系数</span>
                      <span className="text-secondary font-bold font-mono">{multiplier} 倍</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">算力演练累计次数</span>
                      <span className="text-white font-bold font-mono">{state.totalSimulations} 次</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-on-surface-variant block">预计正式版返还书券</span>
                      <span className="text-xs text-secondary/70 italic block">估值实时变动</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-mono text-secondary font-bold">~{estimatedReturn}</span>
                      <span className="text-[11px] text-on-surface-variant font-sans block">正版书券</span>
                    </div>
                  </div>
                </div>

                {/* VIP Invite Code */}
                <div className="space-y-2 p-5 rounded-lg bg-surface-container-lowest border border-outline-variant/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Key className="w-4 h-4 text-tertiary" />
                    <h4 className="font-headline-lg text-xs text-white">VIP 绿色通道激活码</h4>
                  </div>
                  
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mb-3">
                    持有早期邀请码（如：<code className="text-secondary font-mono">MOYUAN_VIP_2024</code> 或 <code className="text-secondary font-mono">DEEP_ORIGIN</code>）可直接绑定VIP绿色通道。
                  </p>

                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setCodeError(""); }}
                      placeholder="输入激活码"
                      className="flex-1 px-3 py-1.5 rounded bg-surface-container border border-outline-variant/20 focus:border-tertiary focus:outline-none text-xs font-mono text-white placeholder-on-surface-variant/30"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-sans font-bold text-xs transition-colors cursor-pointer"
                    >
                      绑定
                    </button>
                  </form>

                  {codeError && <p className="text-[10px] text-error font-sans">{codeError}</p>}
                  {codeSuccess && (
                    <p className="text-[10px] text-secondary font-sans flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-secondary" />
                      绑定成功！VIP 特权已激活，已赠送书券及重置算力
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom legal notice */}
              <div className="pt-6 border-t border-outline-variant/10 text-[10px] text-on-surface-variant/60 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  公测资产核算完全在链上进行，严禁恶意刷算力等作弊行为。账户一经注销，其对应的资产将永久物理清除。
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
