/**
 * よしくんGPT NEO
 * storage.js
 *
 * データ保存管理システム
 */


"use strict";



const YOSHIKUN_STORAGE = {


    // 保存キー

    keys: {

        history:
            "YOSHIKUN_CHAT_HISTORY",


        memory:
            "YOSHIKUN_USER_MEMORY",


        settings:
            "YOSHIKUN_SETTINGS",


        version:
            "YOSHIKUN_VERSION"

    },



    // 最大保存数

    limit:100


};







/*
==================================
 LocalStorage確認
==================================
*/


function storageAvailable(){


    try{


        const test =
            "__storage_test__";


        localStorage
            .setItem(
                test,
                test
            );


        localStorage
            .removeItem(
                test
            );


        return true;


    }catch(e){


        return false;

    }


}








/*
==================================
 データ保存
==================================
*/


function saveData(
    key,
    data
){


    if(
        !storageAvailable()
    ){

        return false;

    }



    try{


        localStorage
        .setItem(

            key,

            JSON.stringify(data)

        );


        return true;


    }catch(e){


        console.error(
            "保存エラー",
            e
        );


        return false;

    }


}







/*
==================================
 データ取得
==================================
*/


function loadData(
    key,
    defaultValue=null
){


    if(
        !storageAvailable()
    ){

        return defaultValue;

    }



    try{


        const data =
            localStorage
            .getItem(
                key
            );



        if(
            !data
        ){

            return defaultValue;

        }



        return JSON.parse(data);


    }catch(e){


        return defaultValue;

    }

}







/*
==================================
 会話履歴保存
==================================
*/


function saveChatHistory(
    user,
    ai
){


    let history =
        loadData(

            YOSHIKUN_STORAGE.keys.history,

            []

        );



    history.push({


        user:user,


        ai:ai,


        time:
            new Date()
            .toISOString()


    });




    // 100件制限

    if(
        history.length
        >
        YOSHIKUN_STORAGE.limit
    ){

        history =
            history.slice(
                -YOSHIKUN_STORAGE.limit
            );

    }



    saveData(

        YOSHIKUN_STORAGE.keys.history,

        history

    );


}







/*
==================================
 履歴取得
==================================
*/


function getChatHistory(){


    return loadData(

        YOSHIKUN_STORAGE.keys.history,

        []

    );


}







/*
==================================
 履歴削除
==================================
*/


function clearChatHistory(){


    localStorage
    .removeItem(

        YOSHIKUN_STORAGE.keys.history

    );


}

/**
 * よしくんGPT NEO
 * storage.js Part2
 *
 * 永続データ管理拡張
 */



/*
==================================
 ユーザー記憶保存
==================================
*/


function saveUserMemory(
    key,
    value
){

    let memory =
        loadData(

            YOSHIKUN_STORAGE.keys.memory,

            {}

        );


    memory[key] = {

        value:value,

        updated:
            new Date()
            .toISOString()

    };



    saveData(

        YOSHIKUN_STORAGE.keys.memory,

        memory

    );


}





/*
==================================
 ユーザー記憶取得
==================================
*/


function getUserMemory(
    key
){

    const memory =
        loadData(

            YOSHIKUN_STORAGE.keys.memory,

            {}

        );


    if(
        memory[key]
    ){

        return memory[key].value;

    }


    return null;

}






/*
==================================
 全ユーザー記憶取得
==================================
*/


function getAllMemory(){


    return loadData(

        YOSHIKUN_STORAGE.keys.memory,

        {}

    );


}







/*
==================================
 ユーザー記憶削除
==================================
*/


function removeUserMemory(
    key
){


    let memory =
        loadData(

            YOSHIKUN_STORAGE.keys.memory,

            {}

        );



    delete memory[key];



    saveData(

        YOSHIKUN_STORAGE.keys.memory,

        memory

    );


}







/*
==================================
 設定保存
==================================
*/


function saveSettings(
    settings
){


    return saveData(

        YOSHIKUN_STORAGE.keys.settings,

        settings

    );


}







/*
==================================
 設定取得
==================================
*/


function getSettings(){


    return loadData(

        YOSHIKUN_STORAGE.keys.settings,

        {}

    );


}







/*
==================================
 バックアップ作成
==================================
*/


function createBackup(){


    const backup = {


        version:
            "YOSHIKUN_GPT_NEO_1.0",



        created:
            new Date()
            .toISOString(),



        history:
            getChatHistory(),



        memory:
            getAllMemory(),



        settings:
            getSettings()


    };



    return JSON.stringify(

        backup,

        null,

        2

    );


}







/*
==================================
 復元処理
==================================
*/


function restoreBackup(
    json
){


    try{


        const data =
            JSON.parse(json);



        if(
            data.history
        ){

            saveData(

                YOSHIKUN_STORAGE.keys.history,

                data.history

            );

        }



        if(
            data.memory
        ){

            saveData(

                YOSHIKUN_STORAGE.keys.memory,

                data.memory

            );

        }



        if(
            data.settings
        ){

            saveData(

                YOSHIKUN_STORAGE.keys.settings,

                data.settings

            );

        }



        return true;



    }catch(e){


        console.error(
            "復元失敗",
            e
        );


        return false;

    }


}







/*
==================================
 全データ削除
==================================
*/


function clearAllStorage(){



    Object.values(

        YOSHIKUN_STORAGE.keys

    )

    .forEach(

        key => {

            localStorage
            .removeItem(key);

        }

    );



}







/*
==================================
 容量確認
==================================
*/


function getStorageInfo(){


    let size = 0;



    for(
        let key
        in localStorage
    ){

        if(
            localStorage
            .hasOwnProperty(key)
        ){

            size +=
                localStorage[key]
                .length;

        }

    }



    return {


        items:
            localStorage.length,


        size:
            size,


        sizeKB:
            (
                size / 1024
            )
            .toFixed(2)

    };


}







/*
==================================
 app.js 接続 API
==================================
*/


const YoshikunStorage = {


    saveChat:
        saveChatHistory,


    getChat:
        getChatHistory,


    clearChat:
        clearChatHistory,



    memory:{


        save:
            saveUserMemory,


        get:
            getUserMemory,


        all:
            getAllMemory,


        remove:
            removeUserMemory


    },



    settings:{


        save:
            saveSettings,


        get:
            getSettings


    },



    backup:
        createBackup,



    restore:
        restoreBackup,



    clear:
        clearAllStorage,



    info:
        getStorageInfo


};







/*
==================================
 Export
==================================
*/


if(
    typeof module !== "undefined"
){

    module.exports =
        YoshikunStorage;

}
