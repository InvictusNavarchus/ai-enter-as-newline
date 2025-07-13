// ==UserScript==
// @name         AI Enter as Newline
// @name:zh-TW   AI Enter 換行
// @name:zh-CN   AI Enter 换行
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Enable Enter key for newline in AI chat input, use Cmd+Enter (Mac) or Ctrl+Enter (Windows) to send message.
// @description:zh-TW  讓 AI 聊天輸入區的 Enter 鍵可換行，使用 Cmd+Enter（Mac）或 Ctrl+Enter（Windows）送出訊息。
// @description:zh-CN  让 AI 聊天输入区的 Enter 键可换行，使用 Cmd+Enter（Mac）或 Ctrl+Enter（Windows）发送消息。
// @author       windofage
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @match        https://www.perplexity.ai/*
// @match        https://felo.ai/*
// @match        https://chat.deepseek.com/*
// @match        https://grok.com/*
// @match        https://duckduckgo.com/*
// @include      http://192.168.*.*:*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531913/AI%20Enter%20as%20Newline.user.js
// @updateURL https://update.greasyfork.org/scripts/531913/AI%20Enter%20as%20Newline.meta.js
// ==/UserScript==

(() => {
  "use strict";

  // ----- 設定管理 -----

  // 預設設定
  const defaultConfig = {
    enabled: true, // 啟用 Ctrl+Enter 功能
  };

  // 多語系翻譯字典（簡化版）
  const translations = {
    en: {
      toggleOn: "AI Enter Newline Mode: ON (Ctrl+Enter to send)",
      toggleOff: "AI Enter Newline Mode: OFF (Enter to send)",
    },
    "zh-tw": {
      toggleOn: "AI Enter 換行模式：開啟 (Ctrl+Enter 發送)",
      toggleOff: "AI Enter 換行模式：關閉 (Enter 發送)",
    },
    "zh-cn": {
      toggleOn: "AI Enter 换行模式：开启 (Ctrl+Enter 发送)",
      toggleOff: "AI Enter 换行模式：关闭 (Enter 发送)",
    },
  };

  // 偵測瀏覽器語言偏好
  function detectBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang.startsWith("zh")) {
      if (lang.includes("TW") || lang.includes("HK") || lang.includes("MO")) {
        return "zh-tw";
      } else {
        return "zh-cn";
      }
    } else {
      return "en";
    }
  }

  // 取得目前使用的語言
  function getCurrentLanguage() {
    return detectBrowserLanguage();
  }

  // 取得翻譯文字
  function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang]?.[key] || translations.en[key] || key;
  }

  // 載入使用者設定
  function loadConfig() {
    try {
      const savedConfig = GM_getValue("aiEnterConfig");
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        return {
          enabled: config.enabled !== undefined ? config.enabled : defaultConfig.enabled,
        };
      }
    } catch (error) {
      console.error("載入設定時發生錯誤:", error);
    }
    return defaultConfig;
  }

  // 儲存設定
  function saveConfig(config) {
    try {
      GM_setValue("aiEnterConfig", JSON.stringify(config));
      return true;
    } catch (error) {
      console.error("儲存設定時發生錯誤:", error);
      return false;
    }
  }

  // 建立切換按鈕 UI
  function createToggleButton() {
    // 避免重複建立按鈕
    if (document.getElementById("ai-enter-toggle")) {
      return;
    }

    const config = loadConfig();
    
    // 偵測深色模式
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    // 建立切換按鈕
    const toggleButton = document.createElement("button");
    toggleButton.id = "ai-enter-toggle";
    toggleButton.title = config.enabled 
      ? t("toggleOn")
      : t("toggleOff");
    
    // 按鈕樣式
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.right = "10px";
    toggleButton.style.zIndex = "9999";
    toggleButton.style.width = "40px";
    toggleButton.style.height = "40px";
    toggleButton.style.borderRadius = "50%";
    toggleButton.style.border = "2px solid #4caf50";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.fontSize = "16px";
    toggleButton.style.display = "flex";
    toggleButton.style.alignItems = "center";
    toggleButton.style.justifyContent = "center";
    toggleButton.style.transition = "all 0.3s ease";
    toggleButton.style.fontFamily = "monospace";
    toggleButton.style.fontWeight = "bold";
    
    // 根據狀態設定按鈕外觀
    function updateButtonAppearance() {
      const currentConfig = loadConfig();
      if (currentConfig.enabled) {
        toggleButton.style.backgroundColor = "#4caf50";
        toggleButton.style.color = "white";
        toggleButton.textContent = "⏎";
        toggleButton.title = t("toggleOn");
      } else {
        toggleButton.style.backgroundColor = isDarkMode ? "#2d2d2d" : "white";
        toggleButton.style.color = isDarkMode ? "#e0e0e0" : "#666";
        toggleButton.textContent = "⏎";
        toggleButton.title = t("toggleOff");
      }
    }
    
    updateButtonAppearance();
    
    // 點擊事件
    toggleButton.onclick = () => {
      const loadedConfig = loadConfig();
      const newConfig = { enabled: !loadedConfig.enabled };
      
      if (saveConfig(newConfig)) {
        // 更新全域的 currentConfig
        currentConfig = newConfig;
        updateButtonAppearance();
        console.log("AI Enter 設定已更新:", newConfig);
      }
    };
    
    document.body.appendChild(toggleButton);
  }

  // 移除舊的設定介面函數
  function createConfigInterface() {
    // 舊版設定介面已移除，改為使用切換按鈕
    console.log("請使用右上角的切換按鈕來控制 AI Enter 功能");
  }

  // 載入設定
  let currentConfig = loadConfig();

  // 註冊設定選單（保留舊的介面相容性）
  GM_registerMenuCommand("⚙️ Toggle AI Enter", () => {
    const newConfig = { enabled: !currentConfig.enabled };
    if (saveConfig(newConfig)) {
      currentConfig = newConfig;
      console.log("AI Enter 設定已更新:", currentConfig);
      // 更新按鈕外觀
      const toggleButton = document.getElementById("ai-enter-toggle");
      if (toggleButton) {
        const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (currentConfig.enabled) {
          toggleButton.style.backgroundColor = "#4caf50";
          toggleButton.style.color = "white";
          toggleButton.title = t("toggleOn");
        } else {
          toggleButton.style.backgroundColor = isDarkMode ? "#2d2d2d" : "white";
          toggleButton.style.color = isDarkMode ? "#e0e0e0" : "#666";
          toggleButton.title = t("toggleOff");
        }
      }
    }
  });

  // 初始化切換按鈕
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createToggleButton);
  } else {
    createToggleButton();
  }

  // 監聽頁面變化，確保按鈕存在
  const observer = new MutationObserver(() => {
    if (!document.getElementById("ai-enter-toggle")) {
      createToggleButton();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

  // 輸出啟動資訊至 console
  console.log(
    "AI Enter Newline UserScript loaded. Current config:",
    currentConfig
  );

  // 輔助函數：取得事件目標元素
  function getEventTarget(e) {
    return e.composedPath ? e.composedPath()[0] || e.target : e.target;
  }

  // 輔助函數：檢查是否正在進行中文輸入
  function isChineseInputMode(e) {
    return e.isComposing || e.keyCode === 229;
  }

  // 輔助函數：檢查是否在 ChatGPT 輸入框內
  function isInChatGPTTextarea(target) {
    return (
      target.id === "prompt-textarea" ||
      target.closest("#prompt-textarea") ||
      (target.getAttribute && target.getAttribute("contenteditable") === "true")
    );
  }

  /**
   * 檢查按鍵組合是否為發送快捷鍵 (Ctrl+Enter)
   * @param {KeyboardEvent} e - 鍵盤事件
   * @returns {boolean} 是否為發送快捷鍵組合
   */
  function isSendShortcut(e) {
    if (e.key !== "Enter") return false;
    return e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey;
  }

  // ChatGPT 特殊處理：尋找送出按鈕
  let findChatGPTSubmitButton = () => {
    return document.querySelector('button[data-testid="send-button"]');
  };

  // 監聽 keydown 事件，攔截非預期的 Enter 按下事件，避免在輸入元件內誤觸送出
  window.addEventListener(
    "keydown",
    (e) => {
      // 如果功能未啟用，不處理任何事件
      if (!currentConfig.enabled) {
        return;
      }

      // ChatGPT 網站特殊處理
      if (window.location.href.includes("chatgpt.com")) {
        // 如果正在進行中文輸入法選字，不干擾原生行為
        if (isChineseInputMode(e)) {
          return;
        }

        // 如果是 Enter 鍵且沒有按下其他修飾鍵
        if (
          e.key === "Enter" &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          const target = getEventTarget(e);
          // 檢查是否在 prompt-textarea 或其他輸入區域
          if (isInChatGPTTextarea(target)) {
            e.stopPropagation();
            e.preventDefault();

            // 更可靠的換行方法：模擬 Shift+Enter 按鍵事件
            const shiftEnterEvent = new KeyboardEvent("keydown", {
              key: "Enter",
              code: "Enter",
              shiftKey: true,
              bubbles: true,
              cancelable: true,
            });
            target.dispatchEvent(shiftEnterEvent);

            // 如果上述方法無效，嘗試使用 insertParagraph 命令
            if (!shiftEnterEvent.defaultPrevented) {
              document.execCommand("insertParagraph");
            }

            return;
          }
        }

        // 使用 Ctrl+Enter 觸發送出
        if (isSendShortcut(e)) {
          // 同樣，如果正在中文輸入，不處理
          if (isChineseInputMode(e)) {
            return;
          }

          const target = getEventTarget(e);
          if (isInChatGPTTextarea(target)) {
            const submitButton = findChatGPTSubmitButton();
            if (submitButton && !submitButton.disabled) {
              e.preventDefault();
              e.stopPropagation();
              submitButton.click();
            }
          }
        }

        // 阻止 Ctrl+Enter 的原生行為
        if (isSendShortcut(e)) {
          const target = getEventTarget(e);
          if (isInChatGPTTextarea(target)) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      } else {
        // 其他網站的處理邏輯
        // 如果正在進行中文輸入法選字，不干擾原生行為
        if (isChineseInputMode(e)) {
          return;
        }

        // 如果是 Enter 鍵且沒有按下其他修飾鍵（純 Enter）
        if (
          e.key === "Enter" &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          const target = getEventTarget(e);
          if (
            /INPUT|TEXTAREA|SELECT|LABEL/.test(target.tagName) ||
            (target.getAttribute &&
              target.getAttribute("contenteditable") === "true")
          ) {
            // 阻止事件向上冒泡，避免觸發不必要的送出行為
            e.stopPropagation();
          }
        }

        // 如果是 Ctrl+Enter，讓原生行為執行
        if (isSendShortcut(e)) {
          // 不做任何處理，讓網站的原生快捷鍵邏輯執行
          return;
        }

        // 阻止 Ctrl+Enter 冒泡到其他地方
        if (isSendShortcut(e)) {
          const target = getEventTarget(e);
          if (
            /INPUT|TEXTAREA|SELECT|LABEL/.test(target.tagName) ||
            (target.getAttribute &&
              target.getAttribute("contenteditable") === "true")
          ) {
            e.stopPropagation();
          }
        }
      }
    },
    true
  );

  // 監聽 keypress 事件，防止在輸入元件內誤觸送出
  window.addEventListener(
    "keypress",
    (e) => {
      // 如果功能未啟用，不處理任何事件
      if (!currentConfig.enabled) {
        return;
      }

      // ChatGPT 網站使用 keydown 處理就足夠，這裡保持原樣
      if (window.location.href.includes("chatgpt.com")) return;

      // 如果正在進行中文輸入法選字，不干擾原生行為
      if (isChineseInputMode(e)) return; 
      
      // 如果是 Enter 鍵且沒有按下其他修飾鍵（純 Enter）
      if (
        e.key === "Enter" &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        const target = getEventTarget(e);
        if (
          /INPUT|TEXTAREA|SELECT|LABEL/.test(target.tagName) ||
          (target.getAttribute &&
            target.getAttribute("contenteditable") === "true")
        ) {
          // 同樣阻止事件冒泡
          e.stopPropagation();
        }
      }

      // 如果是 Ctrl+Enter，讓原生行為執行（不阻止）
      if (isSendShortcut(e)) {
        return;
      }

      // 阻止 Ctrl+Enter 冒泡
      if (isSendShortcut(e)) {
        const target = getEventTarget(e);
        if (
          /INPUT|TEXTAREA|SELECT|LABEL/.test(target.tagName) ||
          (target.getAttribute &&
            target.getAttribute("contenteditable") === "true")
        ) {
          e.stopPropagation();
        }
      }
    },
    true
  );
})();
