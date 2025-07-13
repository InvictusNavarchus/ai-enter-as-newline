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
// @icon         data:image/png;base64,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

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
