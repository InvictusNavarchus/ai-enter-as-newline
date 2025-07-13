// ==UserScript==
// @name         AI Enter as Newline
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Enable Enter key for newline in AI chat input, use Cmd+Enter (Mac) or Ctrl+Enter (Windows) to send message.
// @author       Invictus Nagivarchus
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
// @downloadURL  https://github.com/InvictusNavarchus/ai-enter-as-newline/raw/master/ai-enter-as-newline.user.js
// @updateURL    https://github.com/InvictusNavarchus/ai-enter-as-newline/raw/master/ai-enter-as-newline.user.js
// ==/UserScript==

/*
 * This script is a fork of "AI Enter as Newline" by windofage (MIT License)
 * https://greasyfork.org/en/scripts/531913-ai-enter-as-newline
 */

// ========================================
// TYPE DEFINITIONS
// ========================================

interface Config {
  readonly enabled: boolean;
}

interface DefaultConfig {
  readonly enabled: true;
}

interface Translations {
  readonly en: TranslationStrings;
  readonly "zh-tw": TranslationStrings;
  readonly "zh-cn": TranslationStrings;
}

interface TranslationStrings {
  readonly toggleOn: string;
  readonly toggleOff: string;
}

type SupportedLanguage = keyof Translations;

interface SiteHandler {
  readonly isActive?: () => boolean;
  readonly isInTextarea?: (target: EventTarget) => boolean;
  readonly findSubmitButton?: () => HTMLButtonElement | null;
  readonly handleEnter: (e: KeyboardEvent, target: EventTarget) => boolean;
  readonly handleSend: (e: KeyboardEvent, target: EventTarget) => boolean;
}

interface SiteHandlers {
  readonly chatgpt: SiteHandler;
  readonly generic: SiteHandler;
}

// Tampermonkey API types
declare function GM_getValue(key: string): string | undefined;
declare function GM_setValue(key: string, value: string): void;
declare function GM_registerMenuCommand(caption: string, commandFunc: () => void): void;

// Extend Navigator interface for legacy browser support
interface Navigator {
  userLanguage?: string;
}

// ========================================
// CONFIGURATION MODULE
// ========================================
const ConfigManager = {
  defaults: {
    enabled: true
  } as const satisfies DefaultConfig,

  load(): Config {
    try {
      const saved: string | undefined = GM_getValue("aiEnterConfig");
      if (saved) {
        const config = JSON.parse(saved) as Partial<Config>;
        return {
          enabled: config.enabled !== undefined ? config.enabled : this.defaults.enabled
        };
      }
    } catch (error: unknown) {
      console.error("Failed to load config:", error);
    }
    return this.defaults;
  },

  save(config: Config): boolean {
    try {
      GM_setValue("aiEnterConfig", JSON.stringify(config));
      return true;
    } catch (error: unknown) {
      console.error("Failed to save config:", error);
      return false;
    }
  }
} as const;

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
  } as const satisfies Translations,

  detectLanguage(): SupportedLanguage {
    const lang: string = navigator.language || navigator.userLanguage || 'en';
    if (lang.startsWith("zh")) {
      return lang.includes("TW") || lang.includes("HK") || lang.includes("MO") 
        ? "zh-tw" : "zh-cn";
    }
    return "en";
  },

  t(key: keyof TranslationStrings): string {
    const lang: SupportedLanguage = this.detectLanguage();
    return this.translations[lang]?.[key] || this.translations.en[key] || key;
  }
} as const;

// ========================================
// UTILITY FUNCTIONS
// ========================================
const Utils = {
  getEventTarget(e: Event): EventTarget {
    if ('composedPath' in e && typeof e.composedPath === 'function') {
      const path = e.composedPath();
      return path[0] || e.target!;
    }
    return e.target!;
  },

  isChineseInputMode(e: KeyboardEvent): boolean {
    return e.isComposing || e.keyCode === 229;
  },

  isSendShortcut(e: KeyboardEvent): boolean {
    return e.key === "Enter" && e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey;
  },

  isPlainEnter(e: KeyboardEvent): boolean {
    return e.key === "Enter" && !e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey;
  },

  isDarkMode(): boolean {
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  },

  isInputElement(target: EventTarget): boolean {
    if (!(target instanceof Element)) return false;
    
    return /INPUT|TEXTAREA|SELECT|LABEL/.test(target.tagName) ||
           target.getAttribute("contenteditable") === "true";
  }
} as const;

// ========================================
// SITE-SPECIFIC HANDLERS
// ========================================
const SiteHandlers: SiteHandlers = {
  chatgpt: {
    isActive(): boolean {
      return window.location.href.includes("chatgpt.com");
    },

    isInTextarea(target: EventTarget): boolean {
      if (!(target instanceof Element)) return false;
      
      return target.id === "prompt-textarea" ||
             target.closest("#prompt-textarea") !== null ||
             target.getAttribute("contenteditable") === "true";
    },

    findSubmitButton(): HTMLButtonElement | null {
      return document.querySelector('button[data-testid="send-button"]');
    },

    handleEnter(e: KeyboardEvent, target: EventTarget): boolean {
      if (!this.isInTextarea!(target)) return false;

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
      
      if (target instanceof EventTarget) {
        target.dispatchEvent(shiftEnterEvent);
      }

      // Fallback method
      if (!shiftEnterEvent.defaultPrevented) {
        document.execCommand("insertParagraph");
      }

      return true;
    },

    handleSend(e: KeyboardEvent, target: EventTarget): boolean {
      if (!this.isInTextarea!(target)) return false;

      const submitButton = this.findSubmitButton!();
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
    handleEnter(e: KeyboardEvent, target: EventTarget): boolean {
      if (Utils.isInputElement(target)) {
        e.stopPropagation();
        return true;
      }
      return false;
    },

    handleSend(e: KeyboardEvent, target: EventTarget): boolean {
      if (Utils.isInputElement(target)) {
        e.stopPropagation();
        return true;
      }
      return false;
    }
  }
} as const;

// ========================================
// KEYBOARD EVENT HANDLER
// ========================================
const KeyboardHandler = {
  config: null as Config | null,

  init(config: Config): void {
    this.config = config;
    this.attachListeners();
  },

  updateConfig(config: Config): void {
    this.config = config;
  },

  attachListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown.bind(this), true);
    window.addEventListener("keypress", this.handleKeyPress.bind(this), true);
  },

  handleKeyDown(e: KeyboardEvent): void {
    if (!this.config?.enabled || Utils.isChineseInputMode(e)) return;

    const target: EventTarget = Utils.getEventTarget(e);
    const handler: SiteHandler = SiteHandlers.chatgpt.isActive?.() ? SiteHandlers.chatgpt : SiteHandlers.generic;

    if (Utils.isPlainEnter(e)) {
      handler.handleEnter(e, target);
    } else if (Utils.isSendShortcut(e)) {
      handler.handleSend(e, target);
    }
  },

  handleKeyPress(e: KeyboardEvent): void {
    if (!this.config?.enabled || Utils.isChineseInputMode(e)) return;
    if (SiteHandlers.chatgpt.isActive?.()) return; // ChatGPT uses keydown only

    const target: EventTarget = Utils.getEventTarget(e);
    const handler: SiteHandler = SiteHandlers.generic;

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
  element: null as HTMLButtonElement | null,
  config: null as Config | null,
  onToggle: null as ((config: Config) => void) | null,

  init(config: Config, onToggle: (config: Config) => void): void {
    this.config = config;
    this.onToggle = onToggle;
    this.create();
    this.observeChanges();
  },

  updateConfig(config: Config): void {
    this.config = config;
    this.updateAppearance();
  },

  create(): void {
    // Avoid duplicate buttons
    if (document.getElementById("ai-enter-toggle")) return;

    this.element = document.createElement("button");
    this.element.id = "ai-enter-toggle";
    this.setupStyles();
    this.updateAppearance();
    this.attachEvents();

    document.body.appendChild(this.element);
  },

  setupStyles(): void {
    if (!this.element) return;

    const styles: Partial<CSSStyleDeclaration> = {
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

  updateAppearance(): void {
    if (!this.element || !this.config) return;

    const isDark: boolean = Utils.isDarkMode();
    
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

  attachEvents(): void {
    if (!this.element) return;

    this.element.onclick = (): void => {
      if (!this.config || !this.onToggle) return;
      
      const newConfig: Config = { enabled: !this.config.enabled };
      this.onToggle(newConfig);
    };
  },

  observeChanges(): void {
    const observer = new MutationObserver((): void => {
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
  config: null as Config | null,

  init(): void {
    this.config = ConfigManager.load();
    this.setupComponents();
    this.registerMenuCommand();
    this.logStartup();
  },

  setupComponents(): void {
    if (!this.config) return;

    // Initialize keyboard handler
    KeyboardHandler.init(this.config);

    // Initialize toggle button
    const initButton = (): void => {
      if (!this.config) return;
      ToggleButton.init(this.config, this.handleToggle.bind(this));
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initButton);
    } else {
      initButton();
    }
  },

  handleToggle(newConfig: Config): void {
    if (ConfigManager.save(newConfig)) {
      this.config = newConfig;
      KeyboardHandler.updateConfig(this.config);
      ToggleButton.updateConfig(this.config);
      console.log("AI Enter config updated:", this.config);
    }
  },

  registerMenuCommand(): void {
    GM_registerMenuCommand("⚙️ Toggle AI Enter", (): void => {
      if (!this.config) return;
      
      const newConfig: Config = { enabled: !this.config.enabled };
      this.handleToggle(newConfig);
    });
  },

  logStartup(): void {
    console.log("AI Enter Newline UserScript loaded. Current config:", this.config);
  }
};

// ========================================
// INITIALIZATION
// ========================================
(() => {
  App.init();
})();