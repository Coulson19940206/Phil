import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROMPT_TEMPLATES } from "../data";
import { PromptTemplate, MoyuanState } from "../types";
import { Play, Sparkles, Terminal, Shield, RefreshCw, CheckCircle, Brain, Flame } from "lucide-react";

interface ComputeConsoleProps {
  state: MoyuanState;
  onChangeState: (updater: (prev: MoyuanState) => MoyuanState) => void;
  onAddTicket: (amount: number) => void;
}

export default function ComputeConsole({ state, onChangeState, onAddTicket }: ComputeConsoleProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(PROMPT_TEMPLATES[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isComputing, setIsComputing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState<Array<{ id: string; title: string; prompt: string; timestamp: string }>>([]);

  // Generate random prompt responses if custom prompt is entered
  const handleStartSimulation = () => {
    const cost = isCustomMode ? 10 : selectedTemplate.cost;

    if (state.points < cost) {
      alert(`算力点不足！当前需要 ${cost} 墨值，系统将在公测面板或通过完成共创反馈为您补充。`);
      return;
    }

    // Deduct points
    onChangeState((prev) => ({
      ...prev,
      points: Math.max(0, prev.points - cost),
      totalSimulations: prev.totalSimulations + 1,
    }));

    // Start simulation steps
    setIsComputing(true);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setShowFinalResponse(false);
  };

  const activePromptText = isCustomMode ? customPrompt : selectedTemplate.promptText;
  const activeSteps = isCustomMode
    ? [
        "[思维链第1阶段 - 意图解析] 正在解析自定义算力请求。探测到语义核心，匹配墨渊自研“沉浸式链式思考”模型。",
        "[思维链第2阶段 - 跨维度搜索] 检索知识库。正在过滤潜在的中外知识对齐幻觉，保障历史语境及行业术语的绝对真实度。",
        "[思维链第3阶段 - 逻辑演算] 启动多维神经网络计算。正在为自定义任务生成最佳推理分叉树。",
        "[思维链第4阶段 - 语气契合] 针对中文叙事语境调整文本的情感颗粒度与严谨度..."
      ]
    : selectedTemplate.steps;

  const activeFinalResponse = isCustomMode
    ? `### 墨渊自研推理引擎：自定义请求生成成功\n\n您提交的请求： *“${customPrompt || "墨渊智能，跃迁万象"}”* 已由墨渊大模型完成分布式计算。\n\n**计算报告：**\n- **算力分配**：10 墨值\n- **上下文检索深度**：1,024,000 Tokens 自动对齐\n- **逻辑演绎置信度**：99.87%\n\n**墨渊AI返回内容：**\n\n> 踏入万象之渊，见证智能跃迁。您输入的个性化指令已完美接入公测调度池。在全尺寸链式思考（Chain of Thought）的深度支撑下，模型已完成了复杂的递归图谱推理。我们在极高情感颗粒度与数理严谨度上为您生成了这份公测仿真。欢迎您在“共创与反馈中心”提交您对此回复的看法，携手定义下一代智能边界。`
    : selectedTemplate.finalResponse;

  useEffect(() => {
    if (isComputing && currentStepIndex >= 0 && currentStepIndex < activeSteps.length) {
      const delay = state.isVip ? 800 : 1500; // VIP is faster!
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, activeSteps[currentStepIndex]]);
        setCurrentStepIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else if (isComputing && currentStepIndex === activeSteps.length) {
      setIsComputing(false);
      setShowFinalResponse(true);
      // Give simulated book tickets as a reward for completed simulations!
      const earnedTickets = isCustomMode ? 12 : selectedTemplate.cost * 1.5;
      onAddTicket(Math.round(earnedTickets));
      
      // Save to local history
      const newHistoryItem = {
        id: Date.now().toString(),
        title: isCustomMode ? (customPrompt.substring(0, 15) + "...") : selectedTemplate.title,
        prompt: activePromptText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setSimulationHistory((prev) => [newHistoryItem, ...prev].slice(0, 5));
    }
  }, [isComputing, currentStepIndex, activeSteps, state.isVip]);

  // Helper to parse very simple markdown for rendering
  const renderParsedMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("### ")) {
        return <h4 key={index} className="text-xl font-headline-lg font-bold text-white mt-4 mb-2 border-b border-outline-variant/20 pb-1">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("#### ")) {
        return <h5 key={index} className="text-lg font-headline-lg font-semibold text-tertiary mt-3 mb-1">{line.replace("#### ", "")}</h5>;
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={index} className="font-body-md text-on-surface font-semibold mt-2">{line.replaceAll("**", "")}</p>;
      }
      if (line.startsWith("> ")) {
        return <blockquote key={index} className="border-l-4 border-secondary bg-surface-container-high/40 p-3 italic text-on-surface-variant my-2 rounded-r">{line.replace("> ", "")}</blockquote>;
      }
      if (line.startsWith("$$") && line.endsWith("$$")) {
        return (
          <div key={index} className="my-3 p-3 bg-surface-container-lowest border border-outline-variant/10 rounded font-mono text-center text-secondary overflow-x-auto text-sm">
            {line.replaceAll("$$", "")}
          </div>
        );
      }
      
      // Handle inline bold formatting
      let parsedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-white font-semibold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={index} className="font-body-md text-on-surface-variant leading-relaxed mb-2">
          {parts.length > 0 ? parts : parsedLine}
        </p>
      );
    });
  };

  return (
    <div id="compute-console-section" className="p-6 md:p-8 rounded-xl bg-surface-container/60 backdrop-blur-xl border border-outline-variant/20 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background neon effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-tertiary/10 text-tertiary border border-tertiary/20">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-headline-lg text-lg text-white flex items-center gap-2">
              墨值算力终端
              <span className="text-xs px-2 py-0.5 font-mono rounded bg-surface-container-highest text-secondary border border-secondary/20">
                CoT v1.0.4-beta
              </span>
            </h3>
            <p className="text-xs text-on-surface-variant font-sans">
              自研“沉浸式链式思考”多维推理演练场，实时计算智能跃迁轨迹
            </p>
          </div>
        </div>
        
        {/* Cost details */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center gap-2">
            <Flame className="w-4 h-4 text-secondary" />
            <span>算力池: <strong className="text-white">{state.points}</strong> / {state.maxPoints} 墨值</span>
          </div>
          {state.isVip && (
            <span className="px-2 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20 font-sans font-semibold">
              VIP 极速通道已激活
            </span>
          )}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-1 rounded-lg border border-outline-variant/10">
        <button
          onClick={() => { setIsCustomMode(false); setSelectedTemplate(PROMPT_TEMPLATES[0]); }}
          className={`py-2 px-4 rounded-md font-sans text-sm font-semibold transition-all ${
            !isCustomMode
              ? "bg-surface-bright text-white shadow"
              : "text-on-surface-variant hover:text-white"
          }`}
        >
          标准公测能力演练
        </button>
        <button
          onClick={() => setIsCustomMode(true)}
          className={`py-2 px-4 rounded-md font-sans text-sm font-semibold transition-all ${
            isCustomMode
              ? "bg-surface-bright text-white shadow"
              : "text-on-surface-variant hover:text-white"
          }`}
        >
          自定义推理请求
        </button>
      </div>

      {!isCustomMode ? (
        <div className="space-y-4">
          <label className="text-xs font-mono text-secondary block uppercase tracking-wider">选择公测核心技术能力：</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROMPT_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl)}
                disabled={isComputing}
                className={`p-4 rounded-lg text-left border transition-all flex flex-col justify-between h-32 ${
                  selectedTemplate.id === tpl.id
                    ? "bg-surface-container-high border-tertiary shadow-[0_0_15px_rgba(0,218,243,0.1)]"
                    : "bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/50"
                } disabled:opacity-50`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans font-bold text-sm text-white">{tpl.title}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container-highest text-tertiary">
                      {tpl.category === "logic" && "逻辑推理"}
                      {tpl.category === "creation" && "文学创作"}
                      {tpl.category === "knowledge" && "中文对齐"}
                      {tpl.category === "context" && "长程记忆"}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {tpl.promptText}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono mt-2 text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" />
                    深层 CoT 架构
                  </span>
                  <span className="text-secondary font-semibold">消耗 {tpl.cost} 墨值</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-mono text-secondary block uppercase tracking-wider">输入您的自定义推理课题：</label>
            <span className="text-xs text-on-surface-variant font-mono">消耗: 10 墨值</span>
          </div>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isComputing}
            placeholder="例如：请解析万有引力公式在三维欧几里得空间向高维弯曲空间拓扑演化的数学模型，并描述它的奇点状态..."
            className="w-full h-32 p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/20 focus:border-tertiary focus:outline-none font-sans text-sm text-white placeholder-on-surface-variant/40 resize-none transition-all focus:shadow-[0_0_15px_rgba(0,218,243,0.1)]"
          />
        </div>
      )}

      {/* Control Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-on-surface-variant font-sans">
          {!isComputing && !showFinalResponse && "提示：运行演练可直接累计公测贡献，转化为未来版本的模拟书券和专属返还。"}
          {isComputing && (
            <span className="flex items-center gap-2 text-tertiary animate-pulse font-mono">
              <RefreshCw className="w-4 h-4 animate-spin" />
              正在通过墨渊分布式集群进行深度思维演绎...
            </span>
          )}
          {showFinalResponse && (
            <span className="flex items-center gap-1 text-secondary font-mono">
              <CheckCircle className="w-4 h-4" />
              计算完成！已获得模拟书券返还奖励
            </span>
          )}
        </div>
        
        <button
          onClick={handleStartSimulation}
          disabled={isComputing || (isCustomMode && !customPrompt.trim())}
          className="w-full sm:w-auto px-6 py-3 rounded bg-secondary hover:bg-secondary/90 text-on-secondary font-sans font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          启动沉浸式推理
        </button>
      </div>

      {/* Running steps / Console */}
      <AnimatePresence>
        {(isComputing || completedSteps.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg bg-surface-container-lowest border border-outline-variant/10 p-5 font-mono space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2 mb-3">
              <span className="text-xs text-tertiary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
                墨渊链式思考链路 (Chain of Thought Flow)
              </span>
              <span className="text-[10px] text-on-surface-variant">
                并发算力节点: {state.isVip ? "CLUSTER-01-PRIORITY" : "CLUSTER-04-STANDARD"}
              </span>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              {completedSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-on-surface-variant pl-4 border-l-2 border-tertiary/20 flex gap-2"
                >
                  <span className="text-tertiary font-bold select-none">&gt;</span>
                  <span className="leading-relaxed">{step}</span>
                </motion.div>
              ))}
              
              {isComputing && (
                <div className="pl-4 flex items-center gap-2 text-tertiary/60 animate-pulse text-xs">
                  <span className="animate-spin text-sm">✦</span>
                  正在推理下一阶段决策节点...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output markdown block */}
      <AnimatePresence>
        {showFinalResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg bg-surface-container-low border border-secondary/30 relative"
          >
            {/* Corner badge */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1 sm:translate-x-0 bg-secondary text-on-secondary text-[10px] font-mono px-2 py-0.5 rounded font-bold tracking-widest uppercase">
              MOYUAN RESPONSE
            </div>

            <div className="prose prose-invert max-w-none text-on-surface-variant">
              {renderParsedMarkdown(activeFinalResponse)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Simulation History list */}
      {simulationHistory.length > 0 && (
        <div className="pt-4 border-t border-outline-variant/10">
          <span className="text-xs font-mono text-on-surface-variant block mb-2 uppercase tracking-wider">最近计算轨迹：</span>
          <div className="flex flex-wrap gap-2">
            {simulationHistory.map((item) => (
              <div
                key={item.id}
                className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant/10 text-xs text-on-surface-variant flex items-center gap-2 font-mono"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span className="font-semibold text-white">{item.title}</span>
                <span className="opacity-55">({item.timestamp})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
