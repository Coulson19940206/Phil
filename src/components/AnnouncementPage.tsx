import React, { useState } from "react";
import { ArrowLeft, Share, Sparkles, Wallet, Trash2, Calendar, AlertTriangle, Infinity, ChevronUp, Copy, Check } from "lucide-react";
import { MoyuanState } from "../types";
import ComputeConsole from "./ComputeConsole";
import AssetPanel from "./AssetPanel";
import UnregisterModal from "./UnregisterModal";
import FeedbackCenter from "./FeedbackCenter";

interface AnnouncementPageProps {
  state: MoyuanState;
  onChangeState: (updater: (prev: MoyuanState) => MoyuanState) => void;
  onResetApp: () => void;
}

export default function AnnouncementPage({ state, onChangeState, onResetApp }: AnnouncementPageProps) {
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [isUnregisterOpen, setIsUnregisterOpen] = useState(false);

  // Helper to add tickets and update co-creator rank if appropriate
  const handleAddTicket = (amount: number) => {
    onChangeState((prev) => ({
      ...prev,
      tickets: prev.tickets + amount,
    }));
  };

  // Helper to trigger "Sign-in" and replenish compute points
  const handleRefillPoints = () => {
    onChangeState((prev) => {
      if (prev.points >= prev.maxPoints) {
        alert("您的墨值算力点已充足，每24小时或通过完成反馈任务可以持续获取补给！");
        return prev;
      }
      alert(`每日公测签到补给成功！已自动为您补足基础算力点。`);
      return {
        ...prev,
        points: prev.maxPoints,
      };
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 3000);
    });
  };

  const handleBack = () => {
    alert("您已处于『墨渊AI』官方公测主站首发页面。踏入万象之渊，见证智能跃迁。");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen ink-abyss-gradient selection:bg-secondary selection:text-on-secondary pb-16 relative">
      {/* Top App Bar Header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-1.5 rounded hover:bg-surface-bright/50 text-on-surface transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-sans font-bold text-base md:text-lg text-white tracking-tight">官方公告</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <button
            onClick={handleShare}
            className="p-1.5 rounded hover:bg-surface-bright/50 text-on-surface-variant transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
          >
            {isShareCopied ? (
              <>
                <Check className="w-4 h-4 text-secondary" />
                <span className="text-secondary">链接已复制</span>
              </>
            ) : (
              <>
                <Share className="w-4 h-4" />
                <span>分享公告</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-16">
        {/* Section: Header with High-Fantasy Portal */}
        <section className="relative w-full h-[55vh] flex items-center justify-center overflow-hidden">
          {/* Background Portal Image */}
          <img
            alt="Moyuan AI Portal"
            className="absolute inset-0 w-full h-full object-cover select-none"
            src="https://lh3.googleusercontent.com/aida/AP1WRLvA_iQh0nP2ZPOq9Am0Rw0s9H0OPIZm-seuEMB22IKp_74Dv7Gxa3aWaHtLzW9LzANw3jDFsK5HQZ-EEzOJNwyj62oCpd1YaPgUsVy0tOuCVbkeibw65Yd1BPnsgr5U1gUEjd_9TIzy6v_Rh7F8J8PAwGqIZsQj7aXDH5pM0N1FuzIGANlIhtr-dr08Tl_XbbAWyX2uP9JShlwcZsEk3M4K9tgNwQTVxGihgXaVfrPw22kWtj-ZHEFQrYP3"
            referrerPolicy="no-referrer"
          />
          {/* Overlay Dark Shader */}
          <div className="absolute inset-0 portal-overlay"></div>
          
          <div className="relative z-10 text-center px-6 max-w-2xl mx-auto space-y-4">
            <div className="inline-block px-4 py-1.5 border border-tertiary/40 bg-tertiary/10 rounded-full backdrop-blur-md">
              <span className="font-mono text-xs text-tertiary tracking-[0.2em] uppercase">
                Moyuan AI • Deep Origin
              </span>
            </div>
            <h1 className="font-sans font-bold text-3xl md:text-5xl text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] leading-tight">
              墨渊AI软件官方公测公告
            </h1>
            <p className="font-serif text-base md:text-lg text-on-surface-variant italic drop-shadow-lg">
              踏入万象之渊，见证智能跃迁。
            </p>
          </div>
        </section>

        {/* Main Article Content Area */}
        <article className="max-w-4xl mx-auto px-6 pb-24 -mt-16 relative z-10 space-y-12">
          
          {/* Intro Paragraph Card */}
          <div className="p-6 md:p-8 rounded-xl bg-surface-container/60 backdrop-blur-xl border border-outline-variant/20 shadow-2xl space-y-3">
            <p className="font-serif text-base md:text-lg text-on-surface leading-relaxed">
              尊敬的用户，欢迎参与墨渊AI软件的官方公开测试。本公告旨在为您清晰呈现此次测试的核心愿景、功能范围及公测期间的运行准则。我们诚邀您与我们共同探索通用人工智能在文字创作与逻辑推理领域的边界。
            </p>
          </div>

          {/* Table of Quick Contents */}
          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/15 flex flex-wrap gap-2 md:gap-4 justify-center items-center text-xs font-mono">
            <span className="text-on-surface-variant">快速导航：</span>
            <button onClick={() => scrollToSection("sec-1")} className="text-secondary hover:underline cursor-pointer">I.核心能力</button>
            <span className="text-outline-variant">|</span>
            <button onClick={() => scrollToSection("sec-2")} className="text-secondary hover:underline cursor-pointer">II.算力调度</button>
            <span className="text-outline-variant">|</span>
            <button onClick={() => scrollToSection("sec-3")} className="text-secondary hover:underline cursor-pointer">III.权益结算</button>
            <span className="text-outline-variant">|</span>
            <button onClick={() => scrollToSection("sec-4")} className="text-secondary hover:underline cursor-pointer">IV.注销清算</button>
            <span className="text-outline-variant">|</span>
            <button onClick={() => scrollToSection("sec-5")} className="text-secondary hover:underline cursor-pointer">V.正式安排</button>
            <span className="text-outline-variant">|</span>
            <button onClick={() => scrollToSection("sec-6")} className="text-secondary hover:underline cursor-pointer">VI.重要提示</button>
          </div>

          {/* Section I: 公测核心能力说明 */}
          <section id="sec-1" className="space-y-6 pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-tertiary" />
              <h2 className="font-sans font-bold text-xl md:text-2xl text-white">
                Section I: 公测核心能力说明
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:border-tertiary/20 transition-all">
                <h3 className="font-mono text-xs text-secondary font-bold mb-2">01. 逻辑深度推理</h3>
                <p className="font-serif text-sm text-on-surface-variant leading-relaxed">
                  集成墨渊自研“沉浸式链式思考”架构，擅长处理复杂的数理逻辑及多轮次的技术文档剖析。
                </p>
              </div>

              <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:border-tertiary/20 transition-all">
                <h3 className="font-mono text-xs text-secondary font-bold mb-2">02. 跨维度文体创作</h3>
                <p className="font-serif text-sm text-on-surface-variant leading-relaxed">
                  从意识流文学到标准科研综述，提供极具深度和情感颗粒度的文字生成服务。
                </p>
              </div>

              <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:border-tertiary/20 transition-all">
                <h3 className="font-mono text-xs text-secondary font-bold mb-2">03. 知识图谱对齐</h3>
                <p className="font-serif text-sm text-on-surface-variant leading-relaxed">
                  针对中文语境下的历史常识与行业术语进行深度优化，减少生成幻觉。
                </p>
              </div>

              <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/10 hover:border-tertiary/20 transition-all">
                <h3 className="font-mono text-xs text-secondary font-bold mb-2">04. 个性化语境记忆</h3>
                <p className="font-serif text-sm text-on-surface-variant leading-relaxed">
                  支持超长上下文记忆，能够精准捕捉用户偏好的语气与叙事节奏。
                </p>
              </div>
            </div>
          </section>

          <div className="ethereal-divider"></div>

          {/* Section II: 关于算力资源与提交机制 & ACTIVE COMPUTER CONSOLE */}
          <section id="sec-2" className="space-y-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-tertiary"></div>
              <h2 className="font-sans font-bold text-xl md:text-2xl text-white">
                Section II: 关于算力资源与提交机制
              </h2>
            </div>
            
            <p className="font-serif text-sm md:text-base text-on-surface-variant leading-relaxed">
              公测期间，为了确保平台在高并发下的稳定性，我们将实行动态算力调度。系统每24小时为活跃账户自动补足基础“墨值”算力点。
            </p>

            {/* Simulated VIP Channel Card */}
            <div className="p-6 rounded-lg bg-surface-container-highest/40 border border-secondary/20 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-2">
                <span className="font-sans font-semibold text-xs text-secondary uppercase tracking-wider">VIP 绿色通道</span>
                <span className="text-secondary font-bold text-sm">已开启优先权</span>
              </div>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed italic opacity-90">
                持有早期邀请码或特定贡献勋章的用户将自动关联VIP算力池，享受高峰期无延迟提交与无限次重试机制。可在右下角资产面板激活。
              </p>
            </div>

            {/* INTERACTIVE COMPUTE SANDBOX */}
            <div className="pt-4">
              <span className="text-xs font-mono text-secondary block mb-3 uppercase tracking-wider">【公测互动体验】算力仿真终端：</span>
              <ComputeConsole state={state} onChangeState={onChangeState} onAddTicket={handleAddTicket} />
            </div>
          </section>

          <div className="ethereal-divider"></div>

          {/* Section III: 关于公测期间书券及结算安排 */}
          <section id="sec-3" className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-tertiary" />
              <h2 className="font-sans font-bold text-xl md:text-2xl text-white">
                Section III: 关于公测期间书券及结算安排
              </h2>
            </div>
            
            <p className="font-serif text-sm md:text-base text-on-surface-variant leading-relaxed">
              为回馈公测共创者，公测期间产生的所有“模拟书券”消费记录将作为未来版本“成就积分”的参考。正式版上线后，参与公测的用户将根据贡献维度获得 1.5 倍至 2 倍的公测权益返还，详情可于个人资产面板实时追踪。
            </p>

            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10 flex items-center justify-between text-xs">
              <span className="font-sans text-on-surface-variant">当前模拟书券累计数：<strong className="text-secondary font-mono text-sm">{state.tickets}</strong></span>
              <button
                onClick={() => scrollToSection("compute-console-section")}
                className="text-tertiary hover:underline font-mono"
              >
                前往演练 赚取书券 &gt;&gt;
              </button>
            </div>
          </section>

          <div className="ethereal-divider"></div>

          {/* Section IV: 关于注销结算申请 */}
          <section id="sec-4" className="space-y-6 pt-6">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-error" />
              <h2 className="font-sans font-bold text-xl md:text-2xl text-white">
                Section IV: 关于注销结算申请
              </h2>
            </div>

            <p className="font-serif text-sm md:text-base text-on-surface-variant leading-relaxed">
              如您不再参与公测，需按以下步骤完成账户清算：
            </p>

            {/* Stepper overview */}
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
              <li className="flex items-start gap-3 p-4 rounded bg-surface-container border border-outline-variant/10">
                <span className="w-6 h-6 rounded-full bg-surface-bright flex items-center justify-center font-mono text-xs text-tertiary border border-tertiary/20 shrink-0">1</span>
                <span className="text-xs leading-relaxed text-on-surface-variant">进入“设置-账户安全”，确认已绑定有效的接收联系方式。</span>
              </li>
              <li className="flex items-start gap-3 p-4 rounded bg-surface-container border border-outline-variant/10">
                <span className="w-6 h-6 rounded-full bg-surface-bright flex items-center justify-center font-mono text-xs text-tertiary border border-tertiary/20 shrink-0">2</span>
                <span className="text-xs leading-relaxed text-on-surface-variant">点击“注销账户”，系统将冻结该账户剩余的所有算力点与勋章。</span>
              </li>
              <li className="flex items-start gap-3 p-4 rounded bg-surface-container border border-outline-variant/10">
                <span className="w-6 h-6 rounded-full bg-surface-bright flex items-center justify-center font-mono text-xs text-tertiary border border-tertiary/20 shrink-0">3</span>
                <span className="text-xs leading-relaxed text-on-surface-variant">进行为期 72 小时的冷却期确认，在此期间可随时撤回注销申请。</span>
              </li>
              <li className="flex items-start gap-3 p-4 rounded bg-surface-container border border-outline-variant/10">
                <span className="w-6 h-6 rounded-full bg-surface-bright flex items-center justify-center font-mono text-xs text-tertiary border border-tertiary/20 shrink-0">4</span>
                <span className="text-xs leading-relaxed text-on-surface-variant">注销成功，所有对话数据将执行物理级清除。</span>
              </li>
            </ol>

            {/* Interactive Simulator trigger */}
            <div className="p-4 rounded-lg bg-surface-container-high border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-semibold text-white block">需要注销清算或体验安全销毁机制？</span>
                <span className="text-[10px] text-on-surface-variant font-mono">模拟全自动流程，可随时撤回</span>
              </div>
              <button
                onClick={() => setIsUnregisterOpen(true)}
                className="px-4 py-2 rounded bg-error/10 hover:bg-error/20 text-error border border-error/20 font-sans font-bold text-xs tracking-wider transition-colors cursor-pointer"
              >
                启动注销清算模拟
              </button>
            </div>
          </section>

          <div className="ethereal-divider"></div>

          {/* Section V: 公测性质及正式上线安排 */}
          <section id="sec-5" className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-tertiary" />
              <h2 className="font-sans font-bold text-xl md:text-2xl text-white">
                Section V: 公测性质及正式上线安排
              </h2>
            </div>
            
            <p className="font-serif text-sm md:text-base text-on-surface-variant leading-relaxed">
              本次测试为“有限删档不限量公测”。我们预计将在 2024 年第一季度完成所有核心组件的安全性审计并启动正式运营。公测期间的基础服务将保持免费，增值服务将以邀请制方式定向开放体验。
            </p>
          </section>

          <div className="ethereal-divider"></div>

          {/* Section VI: 重要提示 */}
          <section id="sec-6" className="p-6 md:p-8 rounded-xl bg-error-container/10 border border-error/20 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-error" />
              <h2 className="font-sans font-bold text-lg md:text-xl text-error">
                Section VI: 重要提示
              </h2>
            </div>
            
            <ul className="space-y-3 font-serif text-sm text-on-surface-variant">
              <li className="flex gap-2.5">
                <span className="text-error font-bold">•</span>
                <span>AI生成的内容仅供参考，请勿在医疗、法律等高风险领域直接使用。</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-error font-bold">•</span>
                <span>请严守国家法律法规，禁止生成违法、淫秽或侵权信息。</span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-error font-bold">•</span>
                <span>墨渊官方不会以公测为名向您索要支付密码或验证码，请警惕诈骗。</span>
              </li>
            </ul>
          </section>

          {/* Ethereal Divider before co-creation feedback */}
          <div className="ethereal-divider"></div>

          {/* FEEDBACK CENTER FOR CO-CREATORS */}
          <FeedbackCenter state={state} onChangeState={onChangeState} onAddTicket={handleAddTicket} />

          {/* Footer of Announcement */}
          <footer className="mt-16 pt-12 border-t border-outline-variant/10 text-center space-y-6">
            <div className="flex flex-col items-center gap-3">
              <Infinity className="w-8 h-8 text-tertiary opacity-40" />
              <div className="space-y-1">
                <p className="font-sans font-bold text-lg text-white">墨渊AI官方团队</p>
                <p className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase">
                  Moyuan AI Labs • 2023.11.24
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-6 text-xs font-mono">
              <a href="#" onClick={(e) => { e.preventDefault(); alert("《墨渊AI 隐私政策及数据处理安全协议》正在载入..."); }} className="text-on-surface-variant hover:text-tertiary transition-colors">隐私协议</a>
              <span className="text-outline-variant/50">|</span>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("《墨渊AI 用户守则与伦理合规准则》正在载入..."); }} className="text-on-surface-variant hover:text-tertiary transition-colors">用户准则</a>
              <span className="text-outline-variant/50">|</span>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection("sec-6"); }} className="text-on-surface-variant hover:text-tertiary transition-colors">反馈中心</a>
            </div>

            <p className="font-mono text-[9px] text-on-surface-variant/40 tracking-widest uppercase">
              © 2023 MOYUAN AI LABS. ALL RIGHTS RESERVED.
            </p>
          </footer>
        </article>
      </main>

      {/* FLOATING ASSETS TRACKER PANEL */}
      <AssetPanel state={state} onChangeState={onChangeState} onRefill={handleRefillPoints} />

      {/* ACCOUNT UNREGISTER DETAILED STEP MODAL */}
      <UnregisterModal
        isOpen={isUnregisterOpen}
        onClose={() => setIsUnregisterOpen(false)}
        state={state}
        onChangeState={onChangeState}
        onResetApp={onResetApp}
      />
    </div>
  );
}
