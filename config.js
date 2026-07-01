/**
 * よしくんGPT NEO PWA
 * config.js
 * 
 * アプリ全体の設定管理
 */

"use strict";

const YOSHIKUN_CONFIG = {

    // アプリ基本情報
    app: {
        name: "よしくんGPT NEO",
        version: "1.0.0",
        mode: "PWA",
        language: "ja-JP",

        // 起動時メッセージ
        welcomeMessage:
            "こんにちは！よしくんGPT NEOです。\n" +
            "質問・相談・アイデア作成など何でも聞いてください。"
    },


    // AI人格設定
    personality: {

        // AIの名前
        botName: "よしくん",

        // 話し方
        style: [
            "親しみやすい",
            "分かりやすい",
            "丁寧",
            "少しユーモア"
        ],

        // 感情表現
        emotionSystem: true,

        emotions: {
            happy: "😊",
            thinking: "🤔",
            surprised: "😲",
            sorry: "🙇",
            excited: "🔥"
        }
    },


    // チャット設定
    chat: {

        // 最大保存メッセージ数
        maxHistory: 100,

        // 自動保存
        autoSave: true,

        // 保存場所
        storageKey: "YOSHIKUN_GPT_HISTORY",

        // 入力文字数制限
        maxInputLength: 5000
    },


    // 記憶システム
    memory: {

        enabled: true,

        // ユーザー情報保存
        userMemory: true,

        // 会話記憶
        conversationMemory: true,

        // 保存数
        limit: 100
    },


    // 音声機能
    speech: {

        enabled: true,

        // 音声読み上げ
        textToSpeech: true,

        // 音声入力
        speechRecognition: true,

        language: "ja-JP"
    },


    // PWA設定
    pwa: {

        installButton: true,

        offlineMode: true,

        serviceWorker: "sw.js",

        manifest: "manifest.json"
    },


    // セキュリティ設定
    security: {

        // HTMLエスケープ
        escapeHTML: true,

        // XSS対策
        preventXSS: true,

        // 危険なコード実行禁止
        allowScriptInjection: false
    },


    // UI設定
    ui: {

        theme: "dark",

        animation: true,

        bubbleBackground: false,

        typingAnimation: true,

        showTimestamp: true
    },


    // 拡張機能
    features: {

        fileReader: true,

        imageUpload: true,

        webSearch: false,

        imageGeneration: false,

        pluginSystem: true
    }

};


// 他ファイルから利用可能にする
if (typeof module !== "undefined") {
    module.exports = YOSHIKUN_CONFIG;
}

/**
 * よしくんGPT NEO
 * config.js Part2
 *
 * 拡張設定
 */


// AIエンジン設定
YOSHIKUN_CONFIG.ai = {

    // 動作モード
    mode: "offline",

    /*
        offline:
        内蔵知識・ローカルAI処理

        api:
        外部AI API接続

        hybrid:
        ローカル + API
    */

    provider: "local",


    // 回答設定
    response: {

        maxLength: 2000,

        detailLevel: "high",

        explainMode: true,

        exampleMode: true,

        stepByStep: true
    },


    // 推論設定
    reasoning: {

        enabled: true,

        showThinking: false,

        logicalAnswer: true
    },


    // 会話能力
    conversation: {

        contextAware: true,

        rememberPrevious: true,

        askBackQuestion: true,

        personalityMode: true
    }

};




// API設定
YOSHIKUN_CONFIG.api = {

    enabled: false,


    // APIキー
    key: "",


    // API種類
    service: "",


    // 接続先
    endpoint: "",


    // タイムアウト
    timeout: 30000,


    // 使用制限
    limits: {

        dailyRequest: 100,

        tokenLimit: 4000
    }

};




// プラグイン管理
YOSHIKUN_CONFIG.plugins = {


    enabled: true,


    installed: [

        "knowledge",

        "memory",

        "speech",

        "fileReader"

    ],


    allowExternalPlugin: false,


    autoLoad: true

};




// イベントシステム
YOSHIKUN_CONFIG.events = {


    enabled: true,


    events: {

        onStart: true,

        onMessageSend: true,

        onMessageReceive: true,

        onMemorySave: true,

        onError: true

    }

};




// ファイル処理設定
YOSHIKUN_CONFIG.file = {


    enabled: true,


    supportedTypes: [

        "txt",

        "json",

        "csv",

        "html",

        "md"

    ],


    maxSizeMB: 10,


    autoAnalyze: true

};




// ログ設定
YOSHIKUN_CONFIG.debug = {


    enabled: false,


    consoleLog: false,


    saveLog: false,


    logKey: "YOSHIKUN_DEBUG_LOG"

};




// 開発者設定
YOSHIKUN_CONFIG.developer = {


    developerMode: false,


    showSystemInfo: false,


    showPerformance: false,


    experimentalFeatures: false

};




// 環境情報
YOSHIKUN_CONFIG.environment = {


    browserSupport: true,


    mobileSupport: true,


    iphoneOptimization: true,


    androidOptimization: true

};




// バージョン管理
YOSHIKUN_CONFIG.update = {


    autoCheck: true,


    checkInterval:

        24 * 60 * 60 * 1000,


    updateChannel:

        "stable"

};



// 設定読み込み完了
console.log(
    "YoshikunGPT NEO Config Loaded",
    YOSHIKUN_CONFIG.app.version
);