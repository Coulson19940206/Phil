import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoyuanState } from "../types";
import { Shield, FileWarning, Key, RefreshCw, Trash2, ShieldAlert, Award, ArrowLeft, ArrowRight, Check } from "lucide-react";

interface UnregisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: MoyuanState;
  onChangeState: (updater: (prev: MoyuanState) => MoyuanState) => void;
  onResetApp: () => void;
}

export default function UnregisterModal({ isOpen, onClose, state, onChangeState, onResetApp }: UnregisterModalProps) {
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState("hello@uulex.com");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [wipeProgress, setWipeProgress] = useState(0);

  // Simulated 72-hour cooldown speedup
  const [cooldownPassed, setCooldownPassed] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
    }, 1000);
  };

  const handleFreezeAccount = () => {
    setStep(3);
  };

  const handleSpeedupCooldown = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCooldownPassed(true);
      setStep(4);
      triggerPhysicalWipe();
    }, 1500);
  };

  const triggerPhysicalWipe = () => {
    setIsWiping(true);
    setWipeProgress(0);
    const interval = setInterval(() => {
      setWipeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsWiping(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleCompleteWipe = () => {
    onResetApp();
    setStep(1);
    setCooldownPassed(false);
    onClose();
  };

  const stepDetails = [
    { title: "绑定联系方式", icon: Shield },
    { title: "资产冻结确认", icon: FileWarning },
    { title: "72小时冷却期", icon: RefreshCw },
    { title: "物理级清除", icon: Trash2 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => step !== 4 && onClose()}
            className="fixed inset-0 z-50 bg-black"
          ></motion.div>

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-lg bg-surface-container border border-outline-variant/30 rounded-xl shadow-2xl p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-outline-variant/10 mb-6">
              <div>
                <h3 className="font-headline-lg text-lg text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-error" />
                  账户注销清算模拟器
                </h3>
                <p className="text-xs text-on-surface-variant font-sans">
                  Section IV：根据官方公测准则规范执行账户数据与资产清算
                </p>
              </div>
              {step !== 4 && (
                <button
                  onClick={onClose}
                  className="text-on-surface-variant hover:text-white font-sans text-sm p-1.5"
                >
                  关闭
                </button>
              )}
            </div>

            {/* Stepper Header */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {stepDetails.map((s, idx) => {
                const stepNum = idx + 1;
                const isCompleted = step > stepNum;
                const isActive = step === stepNum;
                const Icon = s.icon;

                return (
                  <div key={idx} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border transition-all ${
                        isCompleted
                          ? "bg-tertiary/20 border-tertiary text-tertiary"
                          : isActive
                          ? "bg-error/20 border-error text-error shadow-[0_0_10px_rgba(255,180,171,0.2)]"
                          : "bg-surface-bright border-outline-variant/20 text-on-surface-variant"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                    </div>
                    <span
                      className={`text-[9px] md:text-[10px] font-sans transition-all ${
                        isActive ? "text-error font-semibold" : isCompleted ? "text-tertiary" : "text-on-surface-variant/70"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Step Body */}
            <div className="space-y-6">
              {/* STEP 1 */}
              {step === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div className="p-4 rounded-lg bg-surface-container-high border border-outline-variant/10 text-xs text-on-surface-variant space-y-2">
                    <p className="font-semibold text-white">步骤 1: 进入“设置-账户安全”，绑定联系方式</p>
                    <p className="leading-relaxed">
                      为了保障账号持有人本人的注销权益，避免恶意误操作，在提交注销前，我们需要验证您绑定的接收联系方式。
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-secondary">安全绑定接收邮箱：</label>
                    <input
                      type="email"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="例如：hello@uulex.com"
                      required
                      className="w-full px-4 py-2 rounded bg-surface-container-low border border-outline-variant/30 text-sm text-white focus:outline-none focus:border-tertiary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2.5 rounded bg-secondary hover:bg-secondary/90 text-on-secondary font-sans font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isVerifying ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        确认绑定并继续
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-error-container/10 border border-error/20 text-xs text-on-surface-variant space-y-2">
                    <p className="font-semibold text-error">步骤 2: 点击“注销账户”，冻结一切数据与资产</p>
                    <p className="leading-relaxed">
                      注销后，您在公测期间累积的所有资产将彻底冻结，并在稍后步骤进行物理销毁，不可找回！请确认：
                    </p>
                  </div>

                  <div className="p-4 rounded bg-surface-container-lowest border border-outline-variant/20 space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">冻结联系人：</span>
                      <span className="text-white">{contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">当前算力资产：</span>
                      <span className="text-white">{state.points} / {state.maxPoints} 墨值</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">当前收益书券：</span>
                      <span className="text-secondary font-bold">{state.tickets} 模拟书券</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">VIP 绿色特权：</span>
                      <span className="text-white">{state.isVip ? "开启中" : "无"}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-2.5 rounded bg-surface-bright text-white hover:bg-surface-bright/80 font-sans text-sm transition-colors cursor-pointer"
                    >
                      返回上一步
                    </button>
                    <button
                      onClick={handleFreezeAccount}
                      className="flex-1 py-2.5 rounded bg-error text-on-error hover:bg-error/90 font-sans font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <FileWarning className="w-4 h-4" />
                      确认注销并冻结
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-surface-container-high border border-outline-variant/10 text-xs text-on-surface-variant space-y-2">
                    <p className="font-semibold text-white">步骤 3: 72小时冷却期安全核验</p>
                    <p className="leading-relaxed">
                      为了保障账号安全，账户已冻结，系统开启了 <strong className="text-white">72小时</strong> 冷却锁定。在此期间，您可以随时一键撤回注销申请，瞬间恢复全部资产。
                    </p>
                  </div>

                  <div className="p-5 text-center border border-outline-variant/15 rounded bg-surface-container-lowest relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 bg-secondary h-full"></div>
                    <div className="font-mono text-2xl text-secondary font-bold mb-1">
                      72:00:00
                    </div>
                    <p className="text-[10px] text-on-surface-variant">
                      冻结倒计时中 (已锁定)
                    </p>
                  </div>

                  <div className="p-4 rounded border border-warning/10 bg-warning/5 text-[11px] text-on-surface-variant/90 leading-relaxed">
                    🚨 <strong>沙盒模拟特权</strong>：为了让您提前体验注销结果，您可以点击下方“加速通过72小时”直接跳转到最终销毁阶段！
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      onClick={() => {
                        setStep(2);
                        // Revoke unregister state
                        alert("撤回成功！您的账户资产已恢复，注销申请已撤销。");
                      }}
                      className="flex-1 py-2 rounded border border-tertiary text-tertiary hover:bg-tertiary/10 font-sans font-semibold text-xs tracking-wider transition-all cursor-pointer"
                    >
                      撤回注销申请
                    </button>
                    <button
                      onClick={handleSpeedupCooldown}
                      disabled={isVerifying}
                      className="flex-1 py-2 rounded bg-secondary text-on-secondary font-sans font-bold text-xs tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-3 animate-spin" />
                      ) : (
                        "加速 72 小时并执行清除"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-error-container/20 border border-error/30 text-xs text-on-surface-variant space-y-2">
                    <p className="font-semibold text-error">步骤 4: 物理级清除完成</p>
                    <p className="leading-relaxed">
                      72小时冷却期已满。墨渊安全机制已对绑定联系人 <strong className="text-white">{contact}</strong> 的所有云端及物理硬盘进行了不可逆的多值重写物理清除，保障绝对安全。
                    </p>
                  </div>

                  {/* Wipe Progress animation display */}
                  <div className="p-4 rounded border border-outline-variant/10 bg-surface-container-lowest font-mono text-[10px] space-y-2">
                    <div className="flex justify-between items-center text-on-surface-variant">
                      <span>物理删除进度：</span>
                      <span className="text-error font-bold">{wipeProgress}%</span>
                    </div>
                    <div className="w-full bg-surface-bright h-2 rounded overflow-hidden">
                      <div className="bg-error h-full transition-all duration-100" style={{ width: `${wipeProgress}%` }}></div>
                    </div>
                    <div className="space-y-1 opacity-80 pt-1 text-[9px] text-on-surface-variant/70">
                      <div>[OK] BLOCK DEVICE /dev/myaidb MAPPED SUCCESSFULLY</div>
                      <div>[OK] DELETING LOCAL COGNITIVE TREE LOGS... Done</div>
                      <div>[OK] DISENGAGING MULTI-MODAL CONTEXT STORAGE... Done</div>
                      <div>[OK] WIPING SHIELDED COMPUTE WALLET TOKEN ID... Done</div>
                      {wipeProgress === 100 && <div className="text-error font-bold">[WIPE_COMPLETE] ALL DATA TOTALLY ERASED FROM SHIELD PHYSICAL CLUSTER.</div>}
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteWipe}
                    disabled={isWiping}
                    className="w-full py-2.5 rounded bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-sans font-bold text-sm flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    重新注册 开启全新探索
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
