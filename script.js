"use strict";

/************************************************
 * よしくんGPT NEO PWA
 * script.js
 * Part1-1
 ************************************************/

/*==============================
  DOM
==============================*/

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

const typing = document.getElementById("typing");

const darkBtn = document.getElementById("darkBtn");

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

const speechBtn = document.getElementById("speechBtn");
const voiceBtn = document.getElementById("voiceBtn");

const clearHistoryBtn =
document.getElementById("clearHistory");

const exportHistoryBtn =
document.getElementById("exportHistory");

const importHistoryBtn =
document.getElementById("importHistory");

const characterSelect =
document.getElementById("characterSelect");

const customPrompt =
document.getElementById("customPrompt");

const statusText =
document.getElementById("status");

const userTemplate =
document.getElementById("userTemplate");

const botTemplate =
document.getElementById("botTemplate");

/*==============================
  LocalStorage Keys
==============================*/

const STORAGE = {

    HISTORY: "neo_history",

    CHARACTER: "character",

    CUSTOM: "custom_prompt",

    DARK: "darkMode",

    SPEECH: "speech",

    VERSION: "neo_version"

};

/*==============================
  Version
==============================*/

const APP_VERSION = "NEO PWA 1.0";

/*==============================
  Runtime
==============================*/

let historyData = [];

let speechEnabled = false;

let recognizing = false;

let currentCharacter = "yoshikun";

let customCharacterPrompt = "";

let typingNow = false;

/*==============================
  Character Prompt
==============================*/

const CHARACTER_PROMPTS = {

    yoshikun:
`あなたは「よしくんGPT NEO」です。
親しみやすく優しい口調で回答してください。`,

    teacher:
`あなたは教師です。
分かりやすく丁寧に教えてください。`,

    maid:
`あなたは優しいメイドです。
丁寧語で可愛く話してください。`,

    tsundere:
`あなたはツンデレです。
少し照れながら話してください。`

};

/*==============================
  Utility
==============================*/

function sleep(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });

}

function random(min,max){

    return Math.floor(

        Math.random()*(max-min+1)

    )+min;

}

function clamp(value,min,max){

    return Math.max(

        min,

        Math.min(max,value)

    );

}

function now(){

    return Date.now();

}

function getTimeString(){

    const d = new Date();

    const h =
    String(d.getHours()).padStart(2,"0");

    const m =
    String(d.getMinutes()).padStart(2,"0");

    return `${h}:${m}`;

}

/*==============================
  Scroll
==============================*/

function scrollBottom(){

    requestAnimationFrame(()=>{

        chat.scrollTop =

        chat.scrollHeight;

    });

}

/*==============================
  Escape HTML
==============================*/

function escapeHTML(text){

    if(text==null){

        return "";

    }

    return String(text)

    .replace(/&/g,"&amp;")

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;")

    .replace(/"/g,"&quot;")

    .replace(/'/g,"&#039;");

}

/*==============================
  Markdown
==============================*/

function markdown(text){

    let html = escapeHTML(text);

    html = html.replace(

        /\*\*(.*?)\*\*/g,

        "<strong>$1</strong>"

    );

    html = html.replace(

        /\*(.*?)\*/g,

        "<em>$1</em>"

    );

    html = html.replace(

        /`([^`]+)`/g,

        "<code>$1</code>"

    );

    html = html.replace(

        /\n/g,

        "<br>"

    );

    return html;

}

/*==============================
  Status
==============================*/

function setStatus(message){

    statusText.textContent = message;

}

/*==============================
  Typing
==============================*/

function showTyping(){

    typingNow = true;

    typing.style.display="flex";

    scrollBottom();

}

function hideTyping(){

    typingNow = false;

    typing.style.display="none";

}

/*==============================
  Save
==============================*/

function saveHistory(){

    localStorage.setItem(

        STORAGE.HISTORY,

        JSON.stringify(historyData)

    );

}

/*==============================
  Load
==============================*/

function loadHistoryData(){

    try{

        const data =

        localStorage.getItem(

            STORAGE.HISTORY

        );

        if(data){

            historyData =

            JSON.parse(data);

        }

    }catch(e){

        historyData=[];

    }

}

/*==================================================
  Message
==================================================*/

function addMessage(role, text, save = true) {

    const template =
        role === "user"
            ? userTemplate
            : botTemplate;

    const node =
        template.content
            .firstElementChild
            .cloneNode(true);

    const textArea =
        node.querySelector(".text");

    textArea.innerHTML =
        markdown(text);

    const bubble =
        node.querySelector(".bubble");

    bubble.dataset.time =
        getTimeString();

    chat.appendChild(node);

    scrollBottom();

    if (save) {

        historyData.push({

            role,

            text,

            time: Date.now()

        });

        saveHistory();

    }

}

/*==================================================
  Clear Chat
==================================================*/

function clearChat() {

    chat.innerHTML = "";

}

/*==================================================
  Restore
==================================================*/

function restoreHistory() {

    clearChat();

    historyData.forEach(item => {

        addMessage(

            item.role,

            item.text,

            false

        );

    });

}

/*==================================================
  Welcome
==================================================*/

function welcomeMessage() {

    if (historyData.length > 0) {

        return;

    }

    addMessage(

        "bot",

`こんにちは！

私は「よしくんGPT NEO」です🐱

今日は何について話しましょう？`,

        true

    );

}

/*==================================================
  Dark Mode
==================================================*/

function toggleDarkMode() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(

        STORAGE.DARK,

        dark

    );

}

/*==================================================
  Menu
==================================================*/

function toggleMenu() {

    menu.classList.toggle("open");

}

/*==================================================
  Character
==================================================*/

function changeCharacter() {

    currentCharacter =
        characterSelect.value;

    localStorage.setItem(

        STORAGE.CHARACTER,

        currentCharacter

    );

    if (currentCharacter === "custom") {

        customPrompt.style.display =
            "block";

    } else {

        customPrompt.style.display =
            "none";

    }

}

/*==================================================
  Custom Prompt
==================================================*/

function saveCustomPrompt() {

    customCharacterPrompt =
        customPrompt.value;

    localStorage.setItem(

        STORAGE.CUSTOM,

        customCharacterPrompt

    );

}

/*==================================================
  Load Settings
==================================================*/

function loadSettings() {

    const dark =
        localStorage.getItem(
            STORAGE.DARK
        );

    if (dark === "true") {

        document.body.classList.add(
            "dark"
        );

    }

    const chara =
        localStorage.getItem(
            STORAGE.CHARACTER
        );

    if (chara) {

        characterSelect.value =
            chara;

        currentCharacter =
            chara;

    }

    const custom =
        localStorage.getItem(
            STORAGE.CUSTOM
        );

    if (custom) {

        customPrompt.value =
            custom;

        customCharacterPrompt =
            custom;

    }

    changeCharacter();

}

/*==================================================
  Online
==================================================*/

function updateOnlineStatus() {

    if (navigator.onLine) {

        setStatus("● オンライン");

    } else {

        setStatus("● オフライン");

    }

}

/*==================================================
  Event
==================================================*/

darkBtn.addEventListener(

    "click",

    toggleDarkMode

);

menuBtn.addEventListener(

    "click",

    toggleMenu

);

characterSelect.addEventListener(

    "change",

    changeCharacter

);

customPrompt.addEventListener(

    "input",

    saveCustomPrompt

);

window.addEventListener(

    "online",

    updateOnlineStatus

);

window.addEventListener(

    "offline",

    updateOnlineStatus

);

clearHistoryBtn.addEventListener(

    "click",

    () => {

        if (!confirm("履歴を削除しますか？")) {

            return;

        }

        historyData = [];

        saveHistory();

        clearChat();

        welcomeMessage();

    }

);

/*==================================================
  Initialize
==================================================*/

function initialize() {

    loadHistoryData();

    loadSettings();

    restoreHistory();

    welcomeMessage();

    updateOnlineStatus();

    scrollBottom();

    console.log(

        "YoshikunGPT NEO",

        APP_VERSION,

        "Initialized"

    );

}

document.addEventListener(

    "DOMContentLoaded",

    initialize

);

/*==================================================
  Busy Lock
==================================================*/

let sending = false;

function setSending(flag) {

    sending = flag;

    input.disabled = flag;

    sendBtn.disabled = flag;

}

/*==================================================
  Input Utility
==================================================*/

function getInputText() {

    return input.value.trim();

}

function clearInput() {

    input.value = "";

}

function focusInput() {

    input.focus();

}

/*==================================================
  Send Validation
==================================================*/

function validateMessage(text) {

    if (!text) {

        return false;

    }

    if (text.length > 5000) {

        addMessage(

            "bot",

            "入力が長すぎます。（5000文字以内）"

        );

        return false;

    }

    return true;

}

/*==================================================
  Thinking Animation
==================================================*/

async function beginThinking() {

    showTyping();

    await sleep(

        random(300, 900)

    );

}

function finishThinking() {

    hideTyping();

}

/*==================================================
  AI Response Wrapper
==================================================*/

async function generateReply(message) {

    if (typeof getKnowledgeResponse === "function") {

        try {

            const result = await getKnowledgeResponse(message);

            if (result && result.trim()) {

                return result;

            }

        } catch (e) {

            console.error(e);

        }

    }

    if (typeof findAnswer === "function") {

        try {

            const result = await findAnswer(message);

            if (result && result.trim()) {

                return result;

            }

        } catch (e) {

            console.error(e);

        }

    }

    return "まだその内容は勉強中です😊";

}

/*==================================================
  Main Send
==================================================*/

async function sendMessage() {

    if (sending) {

        return;

    }

    const text = getInputText();

    if (!validateMessage(text)) {

        return;

    }

    clearInput();

    addMessage(

        "user",

        text

    );

    setSending(true);

    await beginThinking();

    try {

        const reply = await generateReply(text);

        finishThinking();

        addMessage(

            "bot",

            reply

        );

        if (

            speechEnabled &&

            typeof speakText === "function"

        ) {

            speakText(reply);

        }

    } catch (err) {

        console.error(err);

        finishThinking();

        addMessage(

            "bot",

            "エラーが発生しました。"

        );

    }

    setSending(false);

    focusInput();

}

/*==================================================
  Keyboard
==================================================*/

input.addEventListener(

    "keydown",

    function (e) {

        if (

            e.key === "Enter" &&

            !e.shiftKey

        ) {

            e.preventDefault();

            sendMessage();

        }

    }

);

/*==================================================
  Speech Synthesis
==================================================*/

speechBtn.addEventListener("click", () => {
    speechEnabled = !speechEnabled;

    localStorage.setItem(
        STORAGE.SPEECH,
        speechEnabled
    );

    speechBtn.classList.toggle(
        "active",
        speechEnabled
    );

    addMessage(
        "bot",
        speechEnabled
            ? "🔊 読み上げをONにしました。"
            : "🔇 読み上げをOFFにしました。"
    );
});

function speakText(text) {

    if (!speechEnabled) return;

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utter =
        new SpeechSynthesisUtterance(text);

    utter.lang = "ja-JP";
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;

    window.speechSynthesis.speak(utter);

}

/*==================================================
  Speech Recognition
==================================================*/

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();

    recognition.lang = "ja-JP";

    recognition.interimResults = false;

    recognition.continuous = false;

    recognition.onstart = () => {

        recognizing = true;

        voiceBtn.classList.add("active");

    };

    recognition.onend = () => {

        recognizing = false;

        voiceBtn.classList.remove("active");

    };

    recognition.onerror = () => {

        recognizing = false;

        voiceBtn.classList.remove("active");

    };

    recognition.onresult = (event) => {

        const text =
            event.results[0][0].transcript;

        input.value = text;

        sendMessage();

    };

}

voiceBtn.addEventListener("click", () => {

    if (!recognition) {

        addMessage(
            "bot",
            "このブラウザは音声入力に対応していません。"
        );

        return;

    }

    if (recognizing) {

        recognition.stop();

    } else {

        recognition.start();

    }

});

/*==================================================
  Export History
==================================================*/

exportHistoryBtn.addEventListener("click", () => {

    const blob = new Blob(

        [

            JSON.stringify(
                historyData,
                null,
                2
            )

        ],

        {

            type:
                "application/json"

        }

    );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        "YoshikunGPT_History.json";

    a.click();

    URL.revokeObjectURL(url);

});

/*==================================================
  Import History
==================================================*/

importHistoryBtn.addEventListener("click", () => {

    const file =
        document.createElement("input");

    file.type = "file";

    file.accept = ".json";

    file.onchange = e => {

        const target =
            e.target.files[0];

        if (!target) return;

        const reader =
            new FileReader();

        reader.onload = () => {

            try {

                historyData =
                    JSON.parse(
                        reader.result
                    );

                saveHistory();

                restoreHistory();

                addMessage(
                    "bot",
                    "履歴を読み込みました。"
                );

            } catch {

                addMessage(
                    "bot",
                    "読み込みに失敗しました。"
                );

            }

        };

        reader.readAsText(target);

    };

    file.click();

});

/*==================================================
  Shortcuts
==================================================*/

document.addEventListener("keydown", e => {

    if (e.ctrlKey && e.key === "l") {

        e.preventDefault();

        clearHistoryBtn.click();

    }

    if (e.ctrlKey && e.key === "m") {

        e.preventDefault();

        toggleMenu();

    }

});

/*==================================================
  Page Visibility
==================================================*/

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            "speechSynthesis" in window
        ) {

            speechSynthesis.cancel();

        }

    }
);

/*==================================================
  Online Status Monitor
==================================================*/

setInterval(() => {

    updateOnlineStatus();

}, 5000);

/*==================================================
  Startup
==================================================*/

window.addEventListener("load", () => {

    speechEnabled =
        localStorage.getItem(
            STORAGE.SPEECH
        ) === "true";

    speechBtn.classList.toggle(
        "active",
        speechEnabled
    );

    focusInput();

    console.log(
        "script.js Part1 Complete"
    );

});

/**************************************************
 * End of Part1
 * Part2からAI応答ロジックへ続く
 **************************************************/

/*==================================================
  Part2-1A
  Advanced AI Engine (Extension)
==================================================*/

/*
    このファイルは Part1 を上書きしません。
    generateReply() から利用するための
    高度な検索エンジンを追加します。
*/

/*==================================================
  Conversation Context
==================================================*/

const conversationContext = {

    lastUserMessage: "",

    lastBotMessage: "",

    topic: "",

    emotion: "normal",

    messageCount: 0

};

/*==================================================
  Input Normalize
==================================================*/

function normalizeInput(text){

    if(!text){

        return "";

    }

    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g," ")
        .replace(/[！？]/g,"")
        .replace(/[。、]/g,"")
        .replace(/[!?.]/g,"");

}

/*==================================================
  Character Prompt
==================================================*/

function getCurrentPrompt(){

    if(currentCharacter==="custom"){

        if(customCharacterPrompt.trim()!==""){

            return customCharacterPrompt;

        }

    }

    return CHARACTER_PROMPTS[currentCharacter]
        || CHARACTER_PROMPTS.yoshikun;

}

/*==================================================
  Update Context
==================================================*/

function updateConversationContext(user,bot){

    conversationContext.lastUserMessage=user;

    conversationContext.lastBotMessage=bot;

    conversationContext.messageCount++;

}

/*==================================================
  Keyword Split
==================================================*/

function splitKeywords(text){

    return normalizeInput(text)

        .split(" ")

        .filter(v=>v.length>0);

}

/*==================================================
  Similarity
==================================================*/

function similarity(a,b){

    a=normalizeInput(a);

    b=normalizeInput(b);

    if(a===b){

        return 1;

    }

    const wa=splitKeywords(a);

    const wb=splitKeywords(b);

    let score=0;

    wa.forEach(word=>{

        if(wb.includes(word)){

            score++;

        }

    });

    return score/

    Math.max(

        wa.length,

        wb.length,

        1

    );

}

/*==================================================
  Knowledge Search
==================================================*/

function searchKnowledgeBase(message){

    if(typeof knowledge==="undefined"){

        return null;

    }

    let bestAnswer=null;

    let bestScore=0;

    for(const item of knowledge){

        if(!item.question) continue;

        const score=

            similarity(

                message,

                item.question

            );

        if(score>bestScore){

            bestScore=score;

            bestAnswer=item.answer;

        }

    }

    if(bestScore>=0.5){

        return bestAnswer;

    }

    return null;

}

/*==================================================
  Greeting Detection
==================================================*/

function isGreeting(text){

    const greetings=[

        "こんにちは",

        "こんばんは",

        "おはよう",

        "やあ",

        "もしもし",

        "hello",

        "hi"

    ];

    return greetings.some(

        g=>text.includes(g)

    );

}

/*==================================================
  Thanks Detection
==================================================*/

function isThanks(text){

    const words=[

        "ありがとう",

        "助かった",

        "感謝",

        "thanks",

        "thank"

    ];

    return words.some(

        w=>text.includes(w)

    );

}

/*==================================================
  Question Detection
==================================================*/

function isQuestion(text){

    return text.includes("？")

        ||

        text.includes("?")

        ||

        text.includes("教えて")

        ||

        text.includes("とは")

        ||

        text.includes("なに");

}

/*==================================================
  AI Engine Entry
==================================================*/

async function generateAdvancedReply(message){

    const text=

        normalizeInput(message);

    /* あいさつ */

    if(isGreeting(text)){

        return "こんにちは！今日はどんなお話をしましょう？😊";

    }

    /* お礼 */

    if(isThanks(text)){

        return "どういたしまして！また何でも聞いてください😊";

    }

    /* knowledge.js */

    const result=

        searchKnowledgeBase(text);

    if(result){

        return result;

    }

    /* Part2-1Bへ */

    return null;

}

/*==================================================
  Part2-1B-1
  Advanced Search Engine
==================================================*/

/*==================================================
  Synonym Dictionary
==================================================*/

const SYNONYMS = {

    "ai":[
        "人工知能",
        "chatgpt",
        "gpt"
    ],

    "猫":[
        "ねこ",
        "ネコ",
        "cat"
    ],

    "犬":[
        "いぬ",
        "イヌ",
        "dog"
    ],

    "学校":[
        "スクール",
        "school"
    ],

    "ゲーム":[
        "game",
        "ゲーミング"
    ]

};

/*==================================================
  Expand Synonyms
==================================================*/

function expandKeywords(words){

    const result=[];

    words.forEach(word=>{

        result.push(word);

        Object.entries(SYNONYMS)

        .forEach(([key,list])=>{

            if(

                key===word ||

                list.includes(word)

            ){

                result.push(key);

                result.push(...list);

            }

        });

    });

    return [...new Set(result)];

}

/*==================================================
  Levenshtein Distance
==================================================*/

function levenshtein(a,b){

    a=normalizeInput(a);

    b=normalizeInput(b);

    const matrix=[];

    for(let i=0;i<=b.length;i++){

        matrix[i]=[i];

    }

    for(let j=0;j<=a.length;j++){

        matrix[0][j]=j;

    }

    for(let i=1;i<=b.length;i++){

        for(let j=1;j<=a.length;j++){

            if(

                b.charAt(i-1)===

                a.charAt(j-1)

            ){

                matrix[i][j]=

                matrix[i-1][j-1];

            }else{

                matrix[i][j]=Math.min(

                    matrix[i-1][j-1]+1,

                    matrix[i][j-1]+1,

                    matrix[i-1][j]+1

                );

            }

        }

    }

    return matrix[b.length][a.length];

}

/*==================================================
  Text Similarity
==================================================*/

function fuzzySimilarity(a,b){

    const distance=

        levenshtein(a,b);

    const maxLength=

        Math.max(

            a.length,

            b.length,

            1

        );

    return 1-

        distance/maxLength;

}

/*==================================================
  Keyword Score
==================================================*/

function keywordScore(input,target){

    const words=

        expandKeywords(

            splitKeywords(input)

        );

    let score=0;

    words.forEach(word=>{

        if(

            target.includes(word)

        ){

            score+=2;

        }

    });

    return score;

}

/*==================================================
  Advanced Score
==================================================*/

function calculateKnowledgeScore(

    input,

    question

){

    const fuzzy=

        fuzzySimilarity(

            input,

            question

        );

    const keyword=

        keywordScore(

            input,

            normalizeInput(question)

        );

    return (

        fuzzy*0.7+

        keyword*0.3

    );

}

/*==================================================
  Ranking
==================================================*/

function rankKnowledge(list,input){

    return list

    .map(item=>{

        return{

            item,

            score:

            calculateKnowledgeScore(

                input,

                item.question||""

            )

        };

    })

    .sort(

        (a,b)=>

        b.score-a.score

    );

}

/*==================================================
  Part2-1B-2
  Knowledge Ranking & Advanced Search
==================================================*/

/*==================================================
  Search Ranked Knowledge
==================================================*/

function searchKnowledgeRanked(input){

    if(typeof knowledge==="undefined"){

        return null;

    }

    if(!Array.isArray(knowledge)){

        return null;

    }

    const ranked=

        rankKnowledge(

            knowledge,

            input

        );

    if(ranked.length===0){

        return null;

    }

    const best=ranked[0];

    if(best.score<0.45){

        return null;

    }

    return{

        answer:best.item.answer,

        question:best.item.question,

        score:best.score

    };

}

/*==================================================
  Contains Search
==================================================*/

function containsKnowledge(input){

    if(typeof knowledge==="undefined"){

        return null;

    }

    const text=

        normalizeInput(input);

    for(const item of knowledge){

        const q=

            normalizeInput(

                item.question||""

            );

        if(

            q.includes(text)||

            text.includes(q)

        ){

            return item.answer;

        }

    }

    return null;

}

/*==================================================
  Random Knowledge
==================================================*/

function randomKnowledge(){

    if(typeof knowledge==="undefined"){

        return null;

    }

    if(!knowledge.length){

        return null;

    }

    return knowledge[

        random(

            0,

            knowledge.length-1

        )

    ].answer;

}

/*==================================================
  Smart Search
==================================================*/

function smartKnowledgeSearch(message){

    const ranked=

        searchKnowledgeRanked(message);

    if(ranked){

        console.log(

            "Knowledge Match",

            ranked.question,

            ranked.score

        );

        return ranked.answer;

    }

    const contain=

        containsKnowledge(message);

    if(contain){

        return contain;

    }

    return null;

}

/*==================================================
  Conversation Memory
==================================================*/

const recentTopics=[];

function rememberTopic(message){

    const words=

        splitKeywords(message);

    words.forEach(word=>{

        if(word.length<2){

            return;

        }

        recentTopics.unshift(word);

    });

    while(recentTopics.length>30){

        recentTopics.pop();

    }

}

/*==================================================
  Suggest Topic
==================================================*/

function suggestTopic(){

    if(recentTopics.length===0){

        return "";

    }

    const topic=

        recentTopics[0];

    return `そういえば「${topic}」についても詳しく知りたいですか？`;

}

/*==================================================
  Extend generateAdvancedReply
==================================================*/

const __oldGenerateAdvancedReply=

generateAdvancedReply;

generateAdvancedReply=

async function(message){

    rememberTopic(message);

    const basic=

        await __oldGenerateAdvancedReply(message);

    if(basic){

        return basic;

    }

    const smart=

        smartKnowledgeSearch(message);

    if(smart){

        return smart;

    }

    if(isQuestion(message)){

        return

`その内容はまだ十分な知識がありません。

knowledge.jsへ追加すると
もっと詳しく回答できます。`;

    }

    return null;

};

/*==================================================
  Debug
==================================================*/

console.log(

    "Advanced Knowledge Engine Loaded"

);

/*==================================================
  Part2-2
  Smart Conversation Engine
==================================================*/

/*==================================================
  Date / Time
==================================================*/

function getCurrentDateTime(){

    const now=new Date();

    return{

        year:now.getFullYear(),

        month:now.getMonth()+1,

        day:now.getDate(),

        hour:now.getHours(),

        minute:now.getMinutes(),

        week:["日","月","火","水","木","金","土"][now.getDay()]

    };

}

/*==================================================
  Calculator
==================================================*/

function calculateExpression(text){

    const exp=text.replace(/[＝=]/g,"");

    if(!/^[0-9+\-*/(). ]+$/.test(exp)){

        return null;

    }

    try{

        const result=Function(

            `"use strict";return (${exp})`

        )();

        if(Number.isFinite(result)){

            return result;

        }

    }catch(e){}

    return null;

}

/*==================================================
  Fortune
==================================================*/

const fortunes=[

"🌸大吉：今日は最高の一日になりそうです！",

"😊中吉：少し頑張ると良いことがあります。",

"🍀小吉：焦らず行動すると運気UP。",

"⭐吉：新しいことに挑戦すると◎",

"☀末吉：落ち着いて過ごしましょう。"

];

function randomFortune(){

    return fortunes[

        random(

            0,

            fortunes.length-1

        )

    ];

}

/*==================================================
  Recommend
==================================================*/

const recommendList=[

"映画を見る",

"散歩する",

"読書する",

"ゲームで遊ぶ",

"音楽を聴く",

"ラーメンを食べる",

"コーヒーを飲む",

"猫の動画を見る"

];

function randomRecommend(){

    return

    "おすすめは「"+

    recommendList[

        random(

            0,

            recommendList.length-1

        )

    ]+

    "」です😊";

}

/*==================================================
  Small Talk
==================================================*/

const talks=[

"今日はどんな一日でしたか？",

"何か面白いことがありましたか？",

"最近ハマっているものはありますか？",

"困っていることがあれば教えてください。",

"猫は好きですか？🐱",

"ゲームは何を遊びますか？",

"今日はゆっくり休めそうですか？"

];

function randomTalk(){

    return talks[

        random(

            0,

            talks.length-1

        )

    ];

}

/*==================================================
  Character Style
==================================================*/

function applyCharacterStyle(text){

    switch(currentCharacter){

        case "teacher":

            return

            "【先生】\n"+text;

        case "maid":

            return

            text+" ☕";

        case "tsundere":

            return

            text+

            "…べ、別にあなたのためじゃないんだから！";

        default:

            return text;

    }

}

/*==================================================
  Conversation Handler
==================================================*/

function conversationEngine(message){

    const lower=

        normalizeInput(message);

    if(

        lower.includes("今日")

        &&

        lower.includes("日")

    ){

        const d=

            getCurrentDateTime();

        return

`${d.year}年${d.month}月${d.day}日（${d.week}曜日）です。`;

    }

    if(

        lower.includes("時間")

        ||

        lower.includes("何時")

    ){

        const d=

            getCurrentDateTime();

        return

`${d.hour}時${String(d.minute).padStart(2,"0")}分です。`;

    }

    if(

        lower.includes("占い")

    ){

        return randomFortune();

    }

    if(

        lower.includes("おすすめ")

    ){

        return randomRecommend();

    }

    if(

        lower.includes("暇")

    ){

        return randomTalk();

    }

    const calc=

        calculateExpression(

            lower

        );

    if(calc!==null){

        return

        "計算結果は **"+

        calc+

        "** です。";

    }

    return null;

}

/*==================================================
  Extend AI Engine
==================================================*/

const __advancedReply2=

generateAdvancedReply;

generateAdvancedReply=

async function(message){

    const result=

        await __advancedReply2(message);

    if(result){

        return

        applyCharacterStyle(result);

    }

    const smart=

        conversationEngine(message);

    if(smart){

        return

        applyCharacterStyle(smart);

    }

    return null;

};

console.log(

"Part2-2 Loaded"

);

/*==================================================
  Part2-3A
  Emotion System
==================================================*/

/*==================================================
  Emotion State
==================================================*/

const EMOTION = {

    NORMAL: "normal",

    HAPPY: "happy",

    SAD: "sad",

    ANGRY: "angry",

    TIRED: "tired",

    SURPRISED: "surprised"

};

let userEmotion = EMOTION.NORMAL;

let aiEmotion = EMOTION.NORMAL;

/*==================================================
  Emotion Dictionary
==================================================*/

const EMOTION_WORDS = {

    happy: [

        "嬉しい",
        "楽しい",
        "最高",
        "幸せ",
        "やった",
        "成功",
        "笑"

    ],

    sad: [

        "悲しい",
        "泣",
        "寂しい",
        "辛い",
        "つらい",
        "落ち込"

    ],

    angry: [

        "怒",
        "腹立",
        "ムカ",
        "最悪",
        "イライラ"

    ],

    tired: [

        "疲れ",
        "眠い",
        "だるい",
        "しんどい",
        "眠"

    ]

};

/*==================================================
  Detect Emotion
==================================================*/

function detectEmotion(message){

    const text = normalizeInput(message);

    for(const word of EMOTION_WORDS.happy){

        if(text.includes(normalizeInput(word))){

            return EMOTION.HAPPY;

        }

    }

    for(const word of EMOTION_WORDS.sad){

        if(text.includes(normalizeInput(word))){

            return EMOTION.SAD;

        }

    }

    for(const word of EMOTION_WORDS.angry){

        if(text.includes(normalizeInput(word))){

            return EMOTION.ANGRY;

        }

    }

    for(const word of EMOTION_WORDS.tired){

        if(text.includes(normalizeInput(word))){

            return EMOTION.TIRED;

        }

    }

    return EMOTION.NORMAL;

}

/*==================================================
  Emotion Update
==================================================*/

function updateEmotion(message){

    userEmotion = detectEmotion(message);

    switch(userEmotion){

        case EMOTION.HAPPY:

            aiEmotion = EMOTION.HAPPY;

            break;

        case EMOTION.SAD:

            aiEmotion = EMOTION.SAD;

            break;

        case EMOTION.ANGRY:

            aiEmotion = EMOTION.NORMAL;

            break;

        case EMOTION.TIRED:

            aiEmotion = EMOTION.NORMAL;

            break;

        default:

            aiEmotion = EMOTION.NORMAL;

    }

}

/*==================================================
  Emotion Reply
==================================================*/

function emotionReply(){

    switch(userEmotion){

        case EMOTION.HAPPY:

            return [

                "それは良かったですね😊",

                "私も嬉しいです！",

                "その調子ですね✨"

            ];

        case EMOTION.SAD:

            return [

                "それは大変でしたね。",

                "無理をしすぎないでくださいね。",

                "話してくれてありがとうございます。"

            ];

        case EMOTION.ANGRY:

            return [

                "気持ちは分かります。",

                "一度落ち着いて深呼吸してみましょう。",

                "何があったのか教えてもらえますか？"

            ];

        case EMOTION.TIRED:

            return [

                "お疲れ様です。",

                "今日はゆっくり休みましょう😊",

                "温かい飲み物もおすすめです。"

            ];

        default:

            return null;

    }

}

/*==================================================
  Random Emotion Reply
==================================================*/

function getEmotionResponse(){

    const list = emotionReply();

    if(!list){

        return null;

    }

    return list[

        random(

            0,

            list.length-1

        )

    ];

}

/*==================================================
  Extend AI Engine
==================================================*/

const __emotionEngine = generateAdvancedReply;

generateAdvancedReply = async function(message){

    updateEmotion(message);

    const empathy = getEmotionResponse();

    if(empathy){

        return applyCharacterStyle(empathy);

    }

    return await __emotionEngine(message);

};

/*==================================================
  Debug
==================================================*/

console.log("Emotion System Loaded");

/*==================================================
  Part2-3B
  Memory & Conversation Continuity
==================================================*/

/*==================================================
  Short Memory
==================================================*/

const shortMemory = {

    topics: [],

    keywords: [],

    max: 20

};

/*==================================================
  Save Topic
==================================================*/

function rememberConversation(message){

    const words = splitKeywords(message);

    shortMemory.topics.unshift(message);

    words.forEach(word=>{

        if(word.length<2) return;

        shortMemory.keywords.unshift(word);

    });

    shortMemory.topics =
        shortMemory.topics.slice(0,shortMemory.max);

    shortMemory.keywords =
        [...new Set(shortMemory.keywords)]
        .slice(0,50);

}

/*==================================================
  Previous Topic
==================================================*/

function previousTopic(){

    if(shortMemory.topics.length<2){

        return null;

    }

    return shortMemory.topics[1];

}

/*==================================================
  AI Question
==================================================*/

const AI_QUESTIONS=[

"その話をもう少し詳しく教えてください😊",

"どうしてそう思ったのですか？",

"最近一番楽しかったことは何ですか？",

"興味があることはありますか？",

"好きな食べ物は何ですか？",

"最近見た映画やアニメはありますか？",

"今日はどんな一日でしたか？",

"休日は何をして過ごすことが多いですか？"

];

function randomQuestion(){

    return AI_QUESTIONS[

        random(

            0,

            AI_QUESTIONS.length-1

        )

    ];

}

/*==================================================
  Follow Up
==================================================*/

function followUpMessage(){

    if(Math.random()<0.35){

        return randomQuestion();

    }

    return "";

}

/*==================================================
  Response Variation
==================================================*/

function varyResponse(text){

    const prefix=[

        "",

        "なるほど😊\n",

        "そうですね。\n",

        "分かりました。\n"

    ];

    const suffix=[

        "",

        "\n何でも聞いてくださいね。",

        "\n気軽に話してください😊",

        "\n続きも楽しみにしています。"

    ];

    return

        prefix[random(0,prefix.length-1)]

        +

        text

        +

        suffix[random(0,suffix.length-1)];

}

/*==================================================
  Context Reply
==================================================*/

function contextReply(){

    const topic=

        previousTopic();

    if(!topic){

        return null;

    }

    if(Math.random()<0.25){

        return

        `そういえば、

「${topic}」

についても続きがあれば聞かせてください😊`;

    }

    return null;

}

/*==================================================
  Extend Engine
==================================================*/

const __memoryEngine =

generateAdvancedReply;

generateAdvancedReply=

async function(message){

    rememberConversation(message);

    let result=

        await __memoryEngine(message);

    if(result){

        result=

            varyResponse(result);

        const next=

            followUpMessage();

        if(next){

            result+=

            "\n\n"+next;

        }

        return result;

    }

    const context=

        contextReply();

    if(context){

        return context;

    }

    return

    varyResponse(

"まだ分からない内容ですが、一緒に考えてみましょう😊"

    );

};

/*==================================================
  Conversation Counter
==================================================*/

let conversationCount=0;

const __sendMessage =

sendMessage;

sendMessage=

async function(){

    conversationCount++;

    return await

        __sendMessage();

};

/*==================================================
  Auto Suggest
==================================================*/

setInterval(()=>{

    if(

        conversationCount>0 &&

        conversationCount%10===0

    ){

        console.log(

            "Conversation:",

            conversationCount

        );

    }

},5000);

/*==================================================
  Debug
==================================================*/

console.log(

"Memory System Loaded"

);

/**************************************************
 * End Part2
 * Part3へ続く
 **************************************************/