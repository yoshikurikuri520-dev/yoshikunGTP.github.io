/**
 * よしくんGPT NEO
 * speech.js
 *
 * 音声入力・音声読み上げシステム
 */


"use strict";





/*
==================================
 音声設定
==================================
*/


const YOSHIKUN_SPEECH_CONFIG = {


    language:
        "ja-JP",


    voiceRate:
        1.0,


    voicePitch:
        1.0,


    voiceVolume:
        1.0,


    autoSpeak:
        true


};







/*
==================================
 音声認識準備
==================================
*/


let recognition = null;


let isListening = false;







function initSpeechRecognition(){



    const SpeechRecognition =

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;



    if(
        !SpeechRecognition
    ){

        console.warn(

            "音声入力は対応していません"

        );


        return false;

    }




    recognition =

        new SpeechRecognition();




    recognition.lang =

        YOSHIKUN_SPEECH_CONFIG.language;



    recognition.continuous = false;



    recognition.interimResults = true;





    recognition.onstart = function(){


        isListening = true;


        console.log(

            "音声入力開始"

        );


    };







    recognition.onend = function(){


        isListening = false;


        console.log(

            "音声入力終了"

        );


    };






    recognition.onerror = function(event){


        console.error(

            "音声認識エラー",

            event.error

        );


    };





    return true;


}







/*
==================================
 音声入力開始
==================================
*/


function startSpeechInput(
    callback
){


    if(
        !recognition
    ){

        if(
            !initSpeechRecognition()
        ){

            return false;

        }

    }





    recognition.onresult =
        function(event){



            let text = "";



            for(
                let i =
                event.resultIndex;

                i <
                event.results.length;

                i++

            ){


                text +=

                    event.results[i][0]
                    .transcript;


            }




            if(callback){


                callback(text);


            }



        };







    recognition.start();


    return true;


}








/*
==================================
 音声入力停止
==================================
*/


function stopSpeechInput(){


    if(
        recognition &&
        isListening
    ){


        recognition.stop();


    }


}

/**
 * よしくんGPT NEO
 * speech.js Part2
 *
 * 音声読み上げシステム
 */



/*
==================================
 音声読み上げ確認
==================================
*/


function speechSupported(){


    return (

        "speechSynthesis"

        in

        window

    );

}







/*
==================================
 日本語音声取得
==================================
*/


function getJapaneseVoice(){


    const voices =

        speechSynthesis
        .getVoices();



    let voice =

        voices.find(

            v =>

            v.lang === "ja-JP"

        );



    if(!voice){


        voice =

            voices.find(

                v =>

                v.lang
                .startsWith(
                    "ja"
                )

            );


    }



    return voice || null;

}








/*
==================================
 音声読み上げ
==================================
*/


function speakText(
    text
){

    
    if(
        !speechSupported()
    ){

        console.warn(

            "音声読み上げ非対応"

        );


        return false;

    }



    stopSpeech();



    const utterance =

        new SpeechSynthesisUtterance(
            text
        );




    utterance.lang =

        YOSHIKUN_SPEECH_CONFIG.language;



    utterance.rate =

        YOSHIKUN_SPEECH_CONFIG.voiceRate;



    utterance.pitch =

        YOSHIKUN_SPEECH_CONFIG.voicePitch;



    utterance.volume =

        YOSHIKUN_SPEECH_CONFIG.voiceVolume;





    const voice =

        getJapaneseVoice();



    if(voice){


        utterance.voice = voice;


    }






    utterance.onstart =
        function(){


            console.log(

                "読み上げ開始"

            );


        };





    utterance.onend =
        function(){


            console.log(

                "読み上げ終了"

            );


        };






    speechSynthesis
        .speak(
            utterance
        );



    return true;


}







/*
==================================
 読み上げ停止
==================================
*/


function stopSpeech(){


    if(
        speechSupported()
    ){


        speechSynthesis
            .cancel();


    }


}







/*
==================================
 音声設定変更
==================================
*/


function setSpeechConfig(
    config
){

    
    Object.assign(

        YOSHIKUN_SPEECH_CONFIG,

        config

    );


}








/*
==================================
 音声一覧取得
==================================
*/


function getVoices(){


    if(
        !speechSupported()
    ){

        return [];

    }



    return (

        speechSynthesis
        .getVoices()

    );

}








/*
==================================
 音声API
 app.js接続用
==================================
*/


const YoshikunSpeech = {


    // 音声入力

    startInput:
        startSpeechInput,


    stopInput:
        stopSpeechInput,



    // 読み上げ

    speak:
        speakText,


    stop:
        stopSpeech,



    // 設定

    config:
    {


        get:function(){

            return (
                YOSHIKUN_SPEECH_CONFIG
            );

        },


        set:
            setSpeechConfig

    },



    voices:
        getVoices,


    supported:
        function(){


            return {


                input:
                    !!(
                    window.SpeechRecognition ||

                    window.webkitSpeechRecognition
                    ),



                output:
                    speechSupported()

            };


        }


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
        YoshikunSpeech;

}
