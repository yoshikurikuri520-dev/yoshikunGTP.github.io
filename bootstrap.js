/**
 * よしくんGPT NEO
 * bootstrap.js
 *
 * アプリ起動管理システム
 */


"use strict";





/*
==================================
 システム状態
==================================
*/


const YOSHIKUN_BOOT = {


    started:false,


    loaded:{},


    errors:[],


    startTime:null


};








/*
==================================
 起動ログ
==================================
*/


function bootLog(
    message
){


    console.log(

        "[YOSHIKUN BOOT]",

        message

    );


}








/*
==================================
 必須モジュール確認
==================================
*/


function checkModules(){



    const modules = {


        config:

            typeof YOSHIKUN_CONFIG
            !==
            "undefined",



        knowledge:

            typeof YoshikunAI
            !==
            "undefined",



        storage:

            typeof YoshikunStorage
            !==
            "undefined",



        speech:

            typeof YoshikunSpeech
            !==
            "undefined"


    };





    YOSHIKUN_BOOT.loaded =

        modules;




    return modules;

}








/*
==================================
 エラーチェック
==================================
*/


function checkErrors(){



    const modules =

        YOSHIKUN_BOOT.loaded;




    for(
        const name
        in
        modules
    ){


        if(
            !modules[name]
        ){


            YOSHIKUN_BOOT
            .errors
            .push(
                name
            );


        }


    }




    return (

        YOSHIKUN_BOOT
        .errors
        .length
        ===
        0

    );

}








/*
==================================
 ブラウザ確認
==================================
*/


function checkBrowser(){



    const result = {


        localStorage:

            !!window.localStorage,



        serviceWorker:

            "serviceWorker"
            in
            navigator,



        speech:

            (
                "speechSynthesis"
                in
                window
            )

    };



    return result;


}








/*
==================================
 初期設定
==================================
*/


function initializeSystem(){



    bootLog(

        "システム初期化開始"

    );



    YOSHIKUN_BOOT.startTime =

        Date.now();





    const modules =

        checkModules();





    const browser =

        checkBrowser();





    bootLog(

        "Module Status"

    );


    console.table(
        modules
    );



    bootLog(

        "Browser Status"

    );


    console.table(
        browser
    );





    if(
        !checkErrors()
    ){


        console.warn(

            "一部機能が利用できません",

            YOSHIKUN_BOOT.errors

        );


    }







    YOSHIKUN_BOOT.started =
        true;



    bootLog(

        "初期化完了"

    );


}

/**
 * よしくんGPT NEO
 * bootstrap.js Part2
 *
 * 完全起動システム
 */





/*
==================================
 JavaScript動的読み込み
==================================
*/


function loadScript(
    src
){

    return new Promise(

        function(resolve,reject){



            const script =

                document
                .createElement(
                    "script"
                );



            script.src = src;



            script.onload =

                function(){


                    bootLog(

                        src +
                        " 読み込み完了"

                    );


                    resolve();


                };



            script.onerror =

                function(){


                    YOSHIKUN_BOOT
                    .errors
                    .push(src);



                    reject(

                        src

                    );


                };



            document
            .head
            .appendChild(
                script
            );


        }

    );


}








/*
==================================
 必須ファイル読み込み
==================================
*/


async function loadCoreFiles(){



    const files = [


        "js/config.js",


        "js/knowledge.js",


        "js/storage.js",


        "js/speech.js",


        "js/app.js"


    ];





    for(
        const file
        of
        files
    ){



        try{


            await loadScript(
                file
            );



        }catch(error){


            console.error(

                "読み込み失敗",

                error

            );


        }


    }



}








/*
==================================
 保存データ復旧
==================================
*/


function restoreSystemData(){



    if(
        typeof YoshikunStorage
        ===
        "undefined"
    ){

        return;

    }



    const history =

        YoshikunStorage
        .getChat();



    bootLog(

        "履歴復元: "

        +

        history.length

        +

        "件"

    );

}








/*
==================================
 AI初期化
==================================
*/


function initializeAI(){



    if(
        typeof YoshikunAI
        !==
        "undefined"
    ){


        bootLog(

            "AIエンジン準備完了"

        );


    }else{


        console.warn(

            "AIエンジン未検出"

        );


    }


}








/*
==================================
 グローバルAPI公開
==================================
*/


function exposeAPI(){



    window.YoshikunGPT = {


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



        storage:

            typeof YoshikunStorage
            !==
            "undefined"

            ?

            YoshikunStorage

            :

            null,



        version:

            YOSHIKUN_CONFIG
            .app
            .version


    };


}








/*
==================================
 完全起動
==================================
*/


async function boot(){



    try{


        bootLog(

            "よしくんGPT NEO 起動開始"

        );




        await loadCoreFiles();





        initializeSystem();





        restoreSystemData();





        initializeAI();





        exposeAPI();





        bootLog(

            "🚀 よしくんGPT NEO 起動完了"

        );





    }catch(error){



        console.error(

            "Boot Error",

            error

        );


    }



}







/*
==================================
 自動起動
==================================
*/


if(
    document.readyState
    ===
    "loading"
){


    document
    .addEventListener(

        "DOMContentLoaded",

        boot

    );


}else{


    boot();


}