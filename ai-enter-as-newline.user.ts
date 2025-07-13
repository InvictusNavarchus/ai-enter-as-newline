// ==UserScript==
// @name         AI Enter as Newline
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Enable Enter key for newline in AI chat input, use Cmd+Enter (Mac) or Ctrl+Enter (Windows) to send message.
// @author       Invictus Navarchus
// @license      MIT
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @match        https://www.perplexity.ai/*
// @match        https://felo.ai/*
// @match        https://chat.deepseek.com/*
// @match        https://grok.com/*
// @match        https://duckduckgo.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL  https://github.com/InvictusNavarchus/ai-enter-as-newline/raw/master/ai-enter-as-newline.user.js
// @updateURL    https://github.com/InvictusNavarchus/ai-enter-as-newline/raw/master/ai-enter-as-newline.user.js
// ==/UserScript==

/*
 * This script is a fork of "AI Enter as Newline" by windofage (MIT License)
 * https://greasyfork.org/en/scripts/531913-ai-enter-as-newline
 */

(() => {
  "use strict";

  // ========================================
  // CONFIGURATION MODULE
  // ========================================
  const ConfigManager = {
    defaults: {
      enabled: true
    },

    load() {
      try {
        const saved = GM_getValue("aiEnterConfig");
        if (saved) {
          const config = JSON.parse(saved);
          return {
            enabled: config.enabled !== undefined ? config.enabled : this.defaults.enabled
          };
        }
      } catch (error) {
        console.error("Failed to load config:", error);
      }
      return this.defaults;
    },

    save(config) {
      try {
        GM_setValue("aiEnterConfig", JSON.stringify(config));
        return true;
      } catch (error) {
        console.error("Failed to save config:", error);
        return false;
      }
    }
  };

  // ========================================
  // INTERNATIONALIZATION MODULE
  // ========================================
  const I18n = {
    translations: {
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
    },

    detectLanguage() {
      const lang = navigator.language || navigator.userLanguage;
      if (lang.startsWith("zh")) {
        return lang.includes("TW") || lang.includes("HK") || lang.includes("MO") 
          ? "zh-tw" : "zh-cn";
      }
      return "en";
    },

    t(key) {
      const lang = this.detectLanguage();
      return this.translations[lang]?.[key] || this.translations.en[key] || key;
    }
  };

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  const Utils = {
    getEventTarget(e) {
      return e.composedPath ? e.composedPath()[0] || e.target : e.target;
    },

    isChineseInputMode(e) {
      return e.isComposing || e.keyCode === 229;
    },

    isSendShortcut(e) {
      return e.key === "Enter" && e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey;
    },

    isPlainEnter(e) {
      return e.key === "Enter" && !e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey;
    },

    isDarkMode() {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    },

    isInputElement(target) {
      return /INPUT|TEXTAREA|SELECT|LABEL/.test(target.tagName) ||
             (target.getAttribute && target.getAttribute("contenteditable") === "true");
    }
  };

  // ========================================
  // SITE-SPECIFIC HANDLERS
  // ========================================
  const SiteHandlers = {
    chatgpt: {
      isActive() {
        return window.location.href.includes("chatgpt.com");
      },

      isInTextarea(target) {
        return target.id === "prompt-textarea" ||
               target.closest("#prompt-textarea") ||
               (target.getAttribute && target.getAttribute("contenteditable") === "true");
      },

      findSubmitButton() {
        return document.querySelector('button[data-testid="send-button"]');
      },

      handleEnter(e, target) {
        if (!this.isInTextarea(target)) return false;

        e.stopPropagation();
        e.preventDefault();

        // Simulate Shift+Enter for newline
        const shiftEnterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        });
        target.dispatchEvent(shiftEnterEvent);

        // Fallback method
        if (!shiftEnterEvent.defaultPrevented) {
          document.execCommand("insertParagraph");
        }

        return true;
      },

      handleSend(e, target) {
        if (!this.isInTextarea(target)) return false;

        const submitButton = this.findSubmitButton();
        if (submitButton && !submitButton.disabled) {
          e.preventDefault();
          e.stopPropagation();
          submitButton.click();
          return true;
        }

        return false;
      }
    },

    generic: {
      handleEnter(e, target) {
        if (Utils.isInputElement(target)) {
          e.stopPropagation();
          return true;
        }
        return false;
      },

      handleSend(e, target) {
        if (Utils.isInputElement(target)) {
          e.stopPropagation();
          return true;
        }
        return false;
      }
    }
  };

  // ========================================
  // KEYBOARD EVENT HANDLER
  // ========================================
  const KeyboardHandler = {
    config: null,

    init(config) {
      this.config = config;
      this.attachListeners();
    },

    updateConfig(config) {
      this.config = config;
    },

    attachListeners() {
      window.addEventListener("keydown", this.handleKeyDown.bind(this), true);
      window.addEventListener("keypress", this.handleKeyPress.bind(this), true);
    },

    handleKeyDown(e) {
      if (!this.config.enabled || Utils.isChineseInputMode(e)) return;

      const target = Utils.getEventTarget(e);
      const handler = SiteHandlers.chatgpt.isActive() ? SiteHandlers.chatgpt : SiteHandlers.generic;

      if (Utils.isPlainEnter(e)) {
        handler.handleEnter(e, target);
      } else if (Utils.isSendShortcut(e)) {
        handler.handleSend(e, target);
      }
    },

    handleKeyPress(e) {
      if (!this.config.enabled || Utils.isChineseInputMode(e)) return;
      if (SiteHandlers.chatgpt.isActive()) return; // ChatGPT uses keydown only

      const target = Utils.getEventTarget(e);
      const handler = SiteHandlers.generic;

      if (Utils.isPlainEnter(e)) {
        handler.handleEnter(e, target);
      } else if (Utils.isSendShortcut(e)) {
        handler.handleSend(e, target);
      }
    }
  };

  // ========================================
  // UI TOGGLE BUTTON
  // ========================================
  const ToggleButton = {
    element: null,
    config: null,

    init(config, onToggle) {
      this.config = config;
      this.onToggle = onToggle;
      this.create();
      this.observeChanges();
    },

    updateConfig(config) {
      this.config = config;
      this.updateAppearance();
    },

    create() {
      // Avoid duplicate buttons
      if (document.getElementById("ai-enter-toggle")) return;

      this.element = document.createElement("button");
      this.element.id = "ai-enter-toggle";
      this.setupStyles();
      this.updateAppearance();
      this.attachEvents();

      document.body.appendChild(this.element);
    },

    setupStyles() {
      const styles = {
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: "9999",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "2px solid #4caf50",
        cursor: "pointer",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        fontFamily: "monospace",
        fontWeight: "bold"
      };

      Object.assign(this.element.style, styles);
    },

    updateAppearance() {
      if (!this.element) return;

      const isDark = Utils.isDarkMode();
      
      if (this.config.enabled) {
        this.element.style.backgroundColor = "#4caf50";
        this.element.style.color = "white";
        this.element.title = I18n.t("toggleOn");
      } else {
        this.element.style.backgroundColor = isDark ? "#2d2d2d" : "white";
        this.element.style.color = isDark ? "#e0e0e0" : "#666";
        this.element.title = I18n.t("toggleOff");
      }
      
      this.element.textContent = "⏎";
    },

    attachEvents() {
      this.element.onclick = () => {
        const newConfig = { enabled: !this.config.enabled };
        this.onToggle(newConfig);
      };
    },

    observeChanges() {
      const observer = new MutationObserver(() => {
        if (!document.getElementById("ai-enter-toggle")) {
          this.create();
        }
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  // ========================================
  // MAIN APPLICATION
  // ========================================
  const App = {
    config: null,

    init() {
      this.config = ConfigManager.load();
      this.setupComponents();
      this.registerMenuCommand();
      this.logStartup();
    },

    setupComponents() {
      // Initialize keyboard handler
      KeyboardHandler.init(this.config);

      // Initialize toggle button
      const initButton = () => {
        ToggleButton.init(this.config, this.handleToggle.bind(this));
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initButton);
      } else {
        initButton();
      }
    },

    handleToggle(newConfig) {
      if (ConfigManager.save(newConfig)) {
        this.config = newConfig;
        KeyboardHandler.updateConfig(this.config);
        ToggleButton.updateConfig(this.config);
        console.log("AI Enter config updated:", this.config);
      }
    },

    registerMenuCommand() {
      GM_registerMenuCommand("⚙️ Toggle AI Enter", () => {
        const newConfig = { enabled: !this.config.enabled };
        this.handleToggle(newConfig);
      });
    },

    logStartup() {
      console.log("AI Enter Newline UserScript loaded. Current config:", this.config);
    }
  };

  // ========================================
  // INITIALIZATION
  // ========================================
  App.init();
})();