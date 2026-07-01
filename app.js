/**
 * よしくんGPT NEO
 * app.js
 *
 * メインアプリ制御
 */


"use strict";





/*
==================================
 アプリ状態
==================================
*/


const YOSHIKUN_APP = {


    version:
        "1.0.0",


    initialized:false,


    user:"guest",


    messages:[],


    settings:{},


    isProcessing:false


};








/*
==================================
 起動処理
==================================
*/


function initApp(){



    console.log(

        "よしくんGPT NEO 起動開始"

    );





    try{


        loadAppSettings();



        loadHistory();



        setupEvents();



        initSpeech();



        YOSHIKUN_APP.initialized = true;



        showWelcome();



        console.log(

            "起動完了"

        );



    }catch(error){



        handleError(error);



    }


}







/*
==================================
 設定読み込み
==================================
*/


function loadAppSettings(){


    if(
        typeof YoshikunStorage
        !==
        "undefined"
    ){


        YOSHIKUN_APP.settings =

            YoshikunStorage
            .settings
            .get();



    }


}







/*
==================================
 履歴読み込み
==================================
*/


function loadHistory(){



    if(
        typeof YoshikunStorage
        !==
        "undefined"
    ){


        YOSHIKUN_APP.messages =

            YoshikunStorage
            .getChat();


    }


}








/*
==================================
 イベント設定
==================================
*/


function setupEvents(){



    const sendButton =

        document
        .getElementById(
            "sendButton"
        );



    const input =

        document
        .getElementById(
            "userInput"
        );




    if(sendButton){


        sendButton
        .addEventListener(

            "click",

            sendMessage

        );


    }





    if(input){


        input
        .addEventListener(

            "keydown",

            function(e){



                if(
                    e.key ===
                    "Enter"
                ){


                    sendMessage();


                }


            }

        );


    }



}








/*
==================================
 音声初期化
==================================
*/


function initSpeech(){



    if(
        typeof YoshikunSpeech
        !==
        "undefined"
    ){


        console.log(

            "音声機能準備完了"

        );


    }


}








/*
==================================
 初期メッセージ
==================================
*/


function showWelcome(){



    addAIMessage(

        YOSHIKUN_CONFIG
        .app
        .welcomeMessage

    );


}

/**
 * よしくんGPT NEO
 * app.js Part2
 *
 * チャット制御システム
 */





/*
==================================
 メッセージ送信
==================================
*/


function sendMessage(){


    if(
        YOSHIKUN_APP.isProcessing
    ){

        return;

    }



    const input =

        document
        .getElementById(
            "userInput"
        );



    if(
        !input
    ){

        return;

    }




    const text =

        input
        .value
        .trim();





    if(
        text === ""
    ){

        return;

    }





    input.value = "";




    addUserMessage(text);




    processAI(text);


}









/*
==================================
 AI処理
==================================
*/


async function processAI(
    text
){



    YOSHIKUN_APP.isProcessing = true;



    showTyping();




    try{


        let answer = "";



        /*
        AIエンジン呼び出し
        */


        if(
            typeof YoshikunAI
            !==
            "undefined"
        ){



            answer =

                YoshikunAI
                .ask(
                    text
                );



        }else{


            answer =

                "AIエンジンが読み込まれていません。";


        }







        hideTyping();




        addAIMessage(answer);




        saveConversation(

            text,

            answer

        );






        /*
        音声読み上げ
        */


        if(
            typeof YoshikunSpeech
            !==
            "undefined"
        ){


            if(
                YOSHIKUN_CONFIG
                .speech
                .textToSpeech
            ){


                YoshikunSpeech
                .speak(
                    answer
                );


            }


        }






    }catch(error){



        hideTyping();



        addAIMessage(

            "エラーが発生しました。もう一度試してください。"

        );



        handleError(error);



    }





    YOSHIKUN_APP.isProcessing = false;


}









/*
==================================
 会話保存
==================================
*/


function saveConversation(
    user,
    ai
){



    YOSHIKUN_APP.messages
    .push({


        user:user,


        ai:ai,


        time:

            new Date()
            .toISOString()


    });





    if(
        typeof YoshikunStorage
        !==
        "undefined"
    ){


        YoshikunStorage
        .saveChat(

            user,

            ai

        );


    }


}








/*
==================================
 ユーザーメッセージ表示
==================================
*/


function addUserMessage(
    text
){


    addMessage(

        text,

        "user"

    );


}







/*
==================================
 AIメッセージ表示
==================================
*/


function addAIMessage(
    text
){


    addMessage(

        text,

        "ai"

    );


}







/*
==================================
 画面表示
==================================
*/


function addMessage(
    text,
    type
){



    const chatArea =

        document
        .getElementById(
            "chatArea"
        );




    if(
        !chatArea
    ){

        return;

    }






    const message =

        document
        .createElement(
            "div"
        );




    message.className =

        "message " +

        type;






    message.textContent =
        text;






    chatArea
    .appendChild(
        message
    );





    chatArea.scrollTop =

        chatArea.scrollHeight;


}









/*
==================================
 タイピング表示
==================================
*/


function showTyping(){



    const area =

        document
        .getElementById(
            "chatArea"
        );



    if(!area)
        return;





    const typing =

        document
        .createElement(
            "div"
        );



    typing.id =
        "typingIndicator";



    typing.className =
        "typing";



    typing.textContent =
        "よしくんGPT NEO が考え中... 🤔";



    area.appendChild(
        typing
    );


}






function hideTyping(){



    const typing =

        document
        .getElementById(
            "typingIndicator"
        );



    if(typing){


        typing.remove();


    }


}

/**
 * よしくんGPT NEO
 * app.js Part3
 *
 * 拡張アプリ管理
 */





/*
==================================
 音声入力
==================================
*/


function startVoiceInput(){



    if(
        typeof YoshikunSpeech
        ===
        "undefined"
    ){

        addAIMessage(

            "音声機能が利用できません。"

        );


        return;

    }






    YoshikunSpeech
    .startInput(

        function(text){



            const input =

                document
                .getElementById(
                    "userInput"
                );



            if(input){


                input.value =
                    text;


                sendMessage();


            }



        }

    );


}









/*
==================================
 音声停止
==================================
*/


function stopVoiceInput(){



    if(
        typeof YoshikunSpeech
        !==
        "undefined"
    ){


        YoshikunSpeech
        .stopInput();


    }


}








/*
==================================
 履歴表示
==================================
*/


function displayHistory(){



    const history =

        YOSHIKUN_APP.messages;



    const area =

        document
        .getElementById(
            "chatArea"
        );



    if(
        !area
    ){

        return;

    }




    area.innerHTML = "";





    history
    .forEach(

        item => {



            addUserMessage(

                item.user

            );



            addAIMessage(

                item.ai

            );


        }

    );


}







/*
==================================
 履歴削除
==================================
*/


function clearHistory(){



    YOSHIKUN_APP.messages = [];




    if(
        typeof YoshikunStorage
        !==
        "undefined"
    ){


        YoshikunStorage
        .clearChat();


    }





    const area =

        document
        .getElementById(
            "chatArea"
        );



    if(area){


        area.innerHTML = "";


    }



    showWelcome();


}







/*
==================================
 ユーザー記憶保存
==================================
*/


function remember(
    key,
    value
){



    if(
        typeof YoshikunStorage
        !==
        "undefined"
    ){


        YoshikunStorage
        .memory
        .save(

            key,

            value

        );


    }


}








/*
==================================
 ユーザー記憶取得
==================================
*/


function recall(
    key
){



    if(
        typeof YoshikunStorage
        !==
        "undefined"
    ){


        return (

            YoshikunStorage
            .memory
            .get(
                key
            )

        );


    }



    return null;


}









/*
==================================
 バックアップ
==================================
*/


function exportBackup(){



    if(
        typeof YoshikunStorage
        ===
        "undefined"
    ){

        return null;

    }



    const data =

        YoshikunStorage
        .backup();



    const blob =

        new Blob(

            [
                data
            ],

            {
                type:
                "application/json"
            }

        );



    const url =

        URL
        .createObjectURL(
            blob
        );




    const a =

        document
        .createElement(
            "a"
        );



    a.href = url;



    a.download =

        "yoshikunGPT_backup.json";



    a.click();



    URL
    .revokeObjectURL(
        url
    );


}









/*
==================================
 復元
==================================
*/


function importBackup(
    file
){



    const reader =

        new FileReader();




    reader.onload =

        function(e){



            if(
                typeof YoshikunStorage
                !==
                "undefined"
            ){


                const result =

                    YoshikunStorage
                    .restore(

                        e.target.result

                    );



                if(result){


                    location.reload();


                }


            }



        };




    reader.readAsText(file);


}








/*
==================================
 PWA準備
==================================
*/


function initPWA(){



    if(
        "serviceWorker"
        in
        navigator
    ){



        navigator
        .serviceWorker
        .register(

            "sw.js"

        )

        .then(

            function(){


                console.log(

                    "Service Worker登録完了"

                );


            }

        )

        .catch(

            function(error){


                console.error(
                    error
                );


            }

        );


    }


}








/*
==================================
 エラー処理
==================================
*/


function handleError(
    error
){



    console.error(

        "YoshikunGPT Error:",

        error

    );


    if(
        YOSHIKUN_CONFIG
        &&
        YOSHIKUN_CONFIG
        .debug
        .enabled
    ){


        console.log(error);


    }


}








/*
==================================
 起動
==================================
*/


document
.addEventListener(

    "DOMContentLoaded",

    function(){


        initPWA();


        initApp();



    }

);

/**
 * よしくんGPT NEO
 * app.js Part4
 *
 * 最終統合システム
 */





/*
==================================
 Markdown簡易変換
==================================
*/


function renderMarkdown(text){


    if(
        !text
    ){

        return "";

    }



    let html =
        text;



    // 太字

    html =
        html.replace(

            /\*\*(.*?)\*\*/g,

            "<strong>$1</strong>"

        );



    // 改行

    html =
        html.replace(

            /\n/g,

            "<br>"

        );



    // コード

    html =
        html.replace(

            /`(.*?)`/g,

            "<code>$1</code>"

        );



    return html;


}








/*
==================================
 高機能メッセージ表示
==================================
*/


function addRichMessage(
    text,
    type
){



    const chatArea =

        document
        .getElementById(
            "chatArea"
        );



    if(
        !chatArea
    ){

        return;

    }




    const div =

        document
        .createElement(
            "div"
        );



    div.className =

        "message " +

        type;



    div.innerHTML =

        renderMarkdown(
            text
        );




    chatArea
    .appendChild(
        div
    );



    chatArea.scrollTop =

        chatArea.scrollHeight;


}







/*
==================================
 ファイル読み込み
==================================
*/


function readFile(
    file,
    callback
){



    const reader =

        new FileReader();




    reader.onload =

        function(e){


            if(callback){


                callback(

                    e.target.result

                );


            }


        };



    reader.readAsText(file);


}









/*
==================================
 ファイル解析
==================================
*/


function analyzeFile(
    content
){



    return (

        "ファイル内容を解析しました。\n\n" +

        "文字数: "

        +

        content.length

        +

        "文字"

    );


}








/*
==================================
 設定変更
==================================
*/


function updateSetting(
    key,
    value
){



    YOSHIKUN_APP
    .settings[key]
        =
        value;



    if(
        typeof YoshikunStorage
        !==
        "undefined"
    ){


        YoshikunStorage
        .settings
        .save(

            YOSHIKUN_APP.settings

        );


    }


}







/*
==================================
 現在設定取得
==================================
*/


function getAppSettings(){


    return (

        YOSHIKUN_APP.settings

    );


}









/*
==================================
 アプリ情報
==================================
*/


function getAppInfo(){



    return {


        name:

            YOSHIKUN_CONFIG
            .app
            .name,



        version:

            YOSHIKUN_CONFIG
            .app
            .version,



        mode:

            YOSHIKUN_CONFIG
            .app
            .mode


    };


}







/*
==================================
 よしくんGPT API
==================================
*/


const YoshikunGPT = {


    chat:function(
        message
    ){

        return YoshikunAI
        .ask(
            message
        );

    },



    speak:function(
        text
    ){

        if(
            typeof YoshikunSpeech
            !==
            "undefined"
        ){

            YoshikunSpeech
            .speak(
                text
            );

        }

    },



    remember:function(
        key,
        value
    ){

        remember(
            key,
            value
        );

    },



    recall:function(
        key
    ){

        return recall(
            key
        );

    },



    history:function(){

        return (

            YOSHIKUN_APP.messages

        );

    },



    info:function(){

        return getAppInfo();

    }


};







/*
==================================
 起動完了イベント
==================================
*/


window
.addEventListener(

    "load",

    function(){


        console.log(

            "🚀 よしくんGPT NEO 起動完了"

        );


    }

);
