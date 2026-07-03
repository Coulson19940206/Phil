/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MoyuanState } from "./types";
import AnnouncementPage from "./components/AnnouncementPage";

const LOCAL_STORAGE_KEY = "moyuan_app_state_v1";

const DEFAULT_STATE: MoyuanState = {
  points: 100,
  maxPoints: 100,
  tickets: 0,
  isVip: false,
  vipCode: "",
  coCreatorRank: "Normal",
  totalSimulations: 0,
};

export default function App() {
  const [state, setState] = useState<MoyuanState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local storage state", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save local storage state", e);
    }
  }, [state, isLoaded]);

  // Handle a complete app reset (triggered by unregistration procedure)
  const handleResetApp = () => {
    setState(DEFAULT_STATE);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to remove local storage state", e);
    }
    alert("注销数据物理删除成功！已为您创建全新的初始公测账户。");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-sans text-sm text-tertiary">
        <div className="flex flex-col items-center gap-3">
          <span className="animate-spin text-2xl">✦</span>
          <span>正在加载墨渊 AI 官方分布式公测终端...</span>
        </div>
      </div>
    );
  }

  return (
    <AnnouncementPage
      state={state}
      onChangeState={setState}
      onResetApp={handleResetApp}
    />
  );
}
