"use strict";

/* ========= 要素取得 ========= */

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

const darkBtn = document.getElementById("darkBtn");
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

const typing = document.getElementById("typing");

const quickArea = document.getElementById("quickArea");

const userTemplate = document.getElementById("userTemplate");
const botTemplate = document.getElementById("botTemplate");

/* ========= 初期化 ========= */

window.addEventListener("load", () => {

    loadHistory();

    if (chat.children.length === 0) {

        addBot("オッス！よしくんだ！😺");

    }

});

/* ========= メッセージ追加 ========= */

function addUser(text){

    const node = userTemplate.content.cloneNode(true);

    node.querySelector(".text").textContent = text;

    chat.appendChild(node);

    scrollBottom();

}

function addBot(text){

    const node = botTemplate.content.cloneNode(true);

    node.querySelector(".text").textContent = text;

    chat.appendChild(node);

    scrollBottom();

}

/* ========= 送信 ========= */

function sendMessage(){

    const text = input.value.trim();

    if(!text) return;

    addUser(text);

    input.value = "";

    showTyping();

    setTimeout(()=>{

        hideTyping();

        const reply = getReply(text);

        addBot(reply);

        saveHistory();

    },700);

}

/* ========= AI返答 ========= */

function getReply(text){

    if(typeof knowledge !== "undefined"){

        for(const key in knowledge){

            if(text.includes(key)){

                const list = knowledge[key];

                return list[Math.floor(Math.random()*list.length)];

            }

        }

    }

　　
    const random = [

        "なるほど！",

        "面白いな！",

        "もっと教えてくれ！",

        "そうなんだ！",

        "マジかよ！",

        "あ？なめてんのか？", 

        "グーで殴られたいのか？",

        "おっぱい好き！",

         "はいよ～",

        "テメーで考えろや！", 

        "ダサっ",

        "いくらくれんの？",

　　　 "グラム4万ね！",

        "逃がさねーぞ？こら！", 

        "銭湯に行ってくる！",

        "人生楽をして生きたい不良だもの",

        "へぇ〜！"

    ];

    return random[Math.floor(Math.random()*random.length)];

}

/* ========= タイピング ========= */

function showTyping(){

    typing.classList.add("show");

}

function hideTyping(){

    typing.classList.remove("show");

}

/* ========= スクロール ========= */

function scrollBottom(){

    chat.scrollTop = chat.scrollHeight;

}

/* ========= 履歴 ========= */

function saveHistory(){

    localStorage.setItem(

        "ygpt-history",

        chat.innerHTML

    );

}

function loadHistory(){

    const data = localStorage.getItem(

        "ygpt-history"

    );

    if(data){

        chat.innerHTML = data;

    }

}

/* ========= 暗闇モード ========= */

darkBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

});

/* ========= メニュー ========= */

menuBtn.addEventListener("click",()=>{

    menu.classList.toggle("open");

});

/* ========= Enter ========= */

input.addEventListener(

    "keydown",

    e=>{

        if(e.key==="Enter"){

            sendMessage();

        }

    }

);

/* ========= ボタン ========= */

sendBtn.addEventListener(

    "click",

    sendMessage

);

/* ========= クイック質問 ========= */

quickArea.querySelectorAll("button")

.forEach(button=>{

    button.addEventListener(

        "click",

        ()=>{

            input.value = button.textContent;

            sendMessage();

        }

    );

});

/* ========= 証拠隠滅 ========= */

const clearBtn = document.getElementById(

    "clearHistory"

);

if(clearBtn){

clearBtn.onclick=()=>{

localStorage.removeItem("ygpt-history");

chat.innerHTML="";

addBot("履歴を削除したぞ！");

};

}

/* ========= 読み上げ ========= */

const speechBtn = document.getElementById(

"speechBtn"

);

if(speechBtn){

speechBtn.onclick=()=>{

const msg = chat.lastElementChild;

if(!msg)return;

const text = msg.innerText;

speechSynthesis.speak(

new SpeechSynthesisUtterance(text)

);

};

}

/* ========= 音声入力 ========= */

const voiceBtn = document.getElementById(

"voiceBtn"

);

if(

voiceBtn &&

"webkitSpeechRecognition" in window

){

const rec = new webkitSpeechRecognition();

rec.lang="ja-JP";

voiceBtn.onclick=()=>{

rec.start();

};

rec.onresult=e=>{

input.value=

e.results[0][0].transcript;

};

}