/**
 * よしくんGPT NEO
 * knowledge.js
 *
 * ローカル知識データベース
 */

"use strict";


const YOSHIKUN_KNOWLEDGE = {


    /*
    ==================================
        基本会話
    ==================================
    */

    greetings: {

        patterns: [
            "こんにちは",
            "こんばんは",
            "おはよう",
            "やあ",
            "初めまして",
            "よろしく"
        ],


        answers: [

            "こんにちは！😊 よしくんGPT NEOです。今日は何をお手伝いしましょうか？",

            "やあ！よしくんGPT NEOです🔥 質問でも相談でも気軽にどうぞ！",

            "こんにちは！あなたのアイデア作りや問題解決をサポートします。"

        ]

    },




    thanks: {

        patterns: [

            "ありがとう",
            "助かった",
            "感謝",
            "サンキュー"

        ],


        answers: [

            "どういたしまして😊 またいつでも相談してください！",

            "役に立てて嬉しいです！🔥",

            "了解です！これからもよしくんGPT NEOをよろしくお願いします。"

        ]

    },





    farewell: {

        patterns: [

            "さようなら",
            "またね",
            "終了",
            "バイバイ"

        ],


        answers: [

            "またいつでも呼んでください😊",

            "了解です！次回も全力サポートします🔥"

        ]

    },







    /*
    ==================================
        AIについて
    ==================================
    */


    ai: {


        patterns: [

            "あなたは誰",
            "何ができる",
            "AIとは",
            "ChatGPTとは"

        ],


        answers: [

            "私は『よしくんGPT NEO』です。質問への回答、文章作成、アイデア整理、プログラム制作などをサポートするAIアシスタントです。",

            "AIとは、人間のように文章を理解したり、情報処理を行う人工知能技術です。"

        ]

    },






    /*
    ==================================
        コンピューター関連
    ==================================
    */


    computer: {


        patterns: [

            "パソコン",
            "PC",
            "Windows",
            "Mac",
            "設定",
            "故障"

        ],


        answers: [

            "パソコンの問題ですね。症状を詳しく教えてください。原因を一緒に確認します。",

            "PCトラブルの場合は、エラー内容・使用環境・いつから発生したかを確認すると解決しやすいです。"

        ]

    },







    /*
    ==================================
        スマホ関連
    ==================================
    */


    smartphone: {


        patterns: [

            "iPhone",
            "Android",
            "スマホ",
            "アプリ",
            "設定"

        ],


        answers: [

            "スマホの相談ですね😊 機種名と困っている内容を教えてください。",

            "iPhoneやAndroidの設定、アプリ操作について説明できます。"

        ]

    },






    /*
    ==================================
        PWA開発
    ==================================
    */


    pwa: {


        patterns: [

            "PWA",
            "アプリ化",
            "ホーム画面",
            "Service Worker",
            "manifest"

        ],


        answers: [

            "PWAはWebサイトをアプリのように利用できる技術です。インストール、オフライン動作、通知などが可能になります。",

            "PWAには主にindex.html、manifest.json、service worker(sw.js)が必要です。"

        ]

    }

};





/*
==================================
 キーワード検索エンジン
==================================
*/


function searchKnowledge(input){


    const text =
        input.toLowerCase();



    for(
        const category
        in YOSHIKUN_KNOWLEDGE
    ){


        const data =
            YOSHIKUN_KNOWLEDGE[category];


        if(!data.patterns)
            continue;



        for(
            const keyword
            of data.patterns
        ){


            if(
                text.includes(
                    keyword.toLowerCase()
                )
            ){


                const answers =
                    data.answers;


                return answers[
                    Math.floor(
                        Math.random()
                        *
                        answers.length
                    )
                ];

            }

        }

    }


    return null;

}

/**
 * よしくんGPT NEO
 * knowledge.js Part2
 *
 * 拡張知識データ
 */


/*
==================================
 プログラミング関連
==================================
*/

YOSHIKUN_KNOWLEDGE.programming = {


    patterns: [

        "プログラム",
        "コード",
        "JavaScript",
        "HTML",
        "CSS",
        "Python",
        "バグ",
        "エラー"

    ],


    answers: [

        "プログラムの相談ですね😊 使用している言語と、現在困っている内容を教えてください。",

        "コードの修正、機能追加、仕組みの説明などをサポートできます。",

        "エラー解決には、エラー文・対象コード・期待する動作を教えてもらうと分析しやすいです。"

    ]

};





/*
==================================
 HTML / CSS / JS
==================================
*/

YOSHIKUN_KNOWLEDGE.webDevelopment = {


    patterns: [

        "ホームページ",
        "HTML",
        "CSS",
        "JavaScript",
        "Webアプリ",
        "サイト"

    ],


    answers: [

        "Web制作ですね！HTMLは構造、CSSはデザイン、JavaScriptは動きや機能を担当します。",

        "Webアプリ制作では、画面設計・機能設計・データ保存・セキュリティ対策が重要です。",

        "よしくんGPT NEOのようなアプリもHTML、CSS、JavaScriptで作成できます。"

    ]

};






/*
==================================
 文章作成
==================================
*/

YOSHIKUN_KNOWLEDGE.writing = {


    patterns: [

        "文章",
        "作文",
        "メール",
        "手紙",
        "ブログ",
        "記事"

    ],


    answers: [

        "文章作成をお手伝いできます。目的・相手・雰囲気を教えてください😊",

        "ビジネス文章、説明文、広告文、アイデア文章など作成できます。"

    ]

};







/*
==================================
 アイデア生成
==================================
*/

YOSHIKUN_KNOWLEDGE.idea = {


    patterns: [

        "アイデア",
        "考えて",
        "企画",
        "作りたい",
        "新しい"

    ],


    answers: [

        "面白いアイデアを一緒に考えましょう🔥 条件や目的を教えてください。",

        "アイデア作りでは『誰向けか』『何を解決するか』を決めると発展しやすいです。"

    ]

};







/*
==================================
 相談・悩み
==================================
*/

YOSHIKUN_KNOWLEDGE.consultation = {


    patterns: [

        "相談",
        "悩み",
        "困った",
        "どうしたら",
        "不安"

    ],


    answers: [

        "相談ですね。状況を詳しく聞かせてください。一緒に整理して考えます😊",

        "まず現在の状況と、どうなれば良いかを教えてください。"

    ]

};







/*
==================================
 学習サポート
==================================
*/

YOSHIKUN_KNOWLEDGE.study = {


    patterns: [

        "勉強",
        "教えて",
        "意味",
        "説明",
        "覚え方"

    ],


    answers: [

        "分からない内容をできるだけ簡単に説明します😊",

        "初心者向け・詳しい説明・例付き説明など希望に合わせられます。"

    ]

};







/*
==================================
 日付・時間関連
==================================
*/

YOSHIKUN_KNOWLEDGE.system = {


    patterns: [

        "今日",
        "日時",
        "時間",
        "日付"

    ],


    answers: [

        "現在の日付や時間は、お使いの端末情報を利用して確認できます。",

        "JavaScriptではDateオブジェクトを使って日時取得ができます。"

    ]

};







/*
==================================
 未知質問対応
==================================
*/

YOSHIKUN_KNOWLEDGE.fallback = {


    answers: [

        "面白い質問ですね😊 もう少し詳しく教えてもらえれば、さらに詳しく答えられます。",

        "調べたい内容や目的を教えてください。一緒に考えます。",

        "その分野について整理して説明できます。条件を追加してください。"

    ]

};






/*
==================================
 回答取得関数
==================================
*/


function getKnowledgeAnswer(input){


    const result =
        searchKnowledge(input);



    if(result){

        return result;

    }



    const fallback =
        YOSHIKUN_KNOWLEDGE.fallback.answers;



    return fallback[
        Math.floor(
            Math.random()
            *
            fallback.length
        )
    ];

}





/*
==================================
 外部利用
==================================
*/


if(typeof module !== "undefined"){

    module.exports =
        YOSHIKUN_KNOWLEDGE;

}

/**
 * よしくんGPT NEO
 * knowledge.js Part3
 *
 * 高度会話解析システム
 */



/*
==================================
 類義語辞書
==================================
*/


const YOSHIKUN_SYNONYMS = {


    hello: [

        "こんにちは",
        "こんちは",
        "やあ",
        "おはよう",
        "こんばんは"

    ],



    thanks: [

        "ありがとう",
        "助かる",
        "感謝",
        "ありがと"

    ],



    problem: [

        "困った",
        "エラー",
        "動かない",
        "壊れた",
        "できない"

    ],



    create: [

        "作る",
        "制作",
        "作成",
        "開発",
        "作って"

    ],



    explain: [

        "教えて",
        "説明して",
        "意味は",
        "詳しく"

    ]


};







/*
==================================
 質問意図解析
==================================
*/


function analyzeIntent(text){


    const intents = {


        question:false,

        request:false,

        problem:false,

        greeting:false,

        emotion:false

    };



    if(
        text.includes("?") ||
        text.includes("？") ||
        text.includes("教えて")
    ){

        intents.question = true;

    }



    for(
        const key in YOSHIKUN_SYNONYMS
    ){


        for(
            const word of YOSHIKUN_SYNONYMS[key]
        ){


            if(
                text.includes(word)
            ){


                if(key==="hello")
                    intents.greeting=true;


                if(key==="problem")
                    intents.problem=true;


                if(key==="create")
                    intents.request=true;


                if(key==="explain")
                    intents.question=true;

            }

        }

    }



    return intents;

}








/*
==================================
 感情解析
==================================
*/


const YOSHIKUN_EMOTION = {


    positive:[

        "嬉しい",
        "楽しい",
        "最高",
        "良かった",
        "ありがとう"

    ],



    negative:[

        "悲しい",
        "困った",
        "辛い",
        "不安",
        "疲れた"

    ],



    angry:[

        "怒る",
        "ムカつく",
        "最悪"

    ]

};






function detectEmotion(text){



    for(
        const emotion in YOSHIKUN_EMOTION
    ){


        for(
            const word of
            YOSHIKUN_EMOTION[emotion]
        ){


            if(
                text.includes(word)
            ){

                return emotion;

            }

        }

    }


    return "neutral";

}









/*
==================================
 よしくんGPT人格応答
==================================
*/


function yoshikunPersonality(text){


    const emotion =
        detectEmotion(text);



    const personality = {


        positive:[

            "それは良いですね😊",

            "素敵な話ですね！",

            "一緒にさらに良くしていきましょう🔥"

        ],



        negative:[

            "大変な状況ですね。整理しながら考えていきましょう。",

            "できるところから一つずつ解決していきましょう。"

        ],



        angry:[

            "状況を整理すると解決策が見つかるかもしれません。",

            "詳しい内容を教えてください。一緒に確認します。"

        ]

    };



    if(
        personality[emotion]
    ){


        const list =
            personality[emotion];


        return list[
            Math.floor(
                Math.random()
                *
                list.length
            )
        ];

    }



    return "";

}








/*
==================================
 AI聞き返しシステム
==================================
*/


function generateQuestion(intent){


    if(intent.problem){

        return "どのような症状やエラーが発生していますか？";

    }



    if(intent.request){

        return "目的や希望する形を教えてください。";

    }



    if(intent.question){

        return "もう少し詳しい条件があると、より正確に説明できます。";

    }



    return "他にも知りたいことがあれば気軽に聞いてください😊";

}







/*
==================================
 高度回答生成
==================================
*/


function generateAdvancedAnswer(input){



    const intent =
        analyzeIntent(input);



    const emotionText =
        yoshikunPersonality(input);



    const base =
        getKnowledgeAnswer(input);



    const question =
        generateQuestion(intent);



    return (

        emotionText +

        "\n\n" +

        base +

        "\n\n" +

        question

    );

}

/**
 * よしくんGPT NEO
 * knowledge.js Part4
 *
 * 最終回答統合エンジン
 */



"use strict";





/*
==================================
 数学計算システム
==================================
*/


function calculateExpression(text){


    try{


        const expression =
            text
            .replace(
                /計算|して|ください|は|？|\?/g,
                ""
            )
            .replace(
                /足す/g,
                "+"
            )
            .replace(
                /引く/g,
                "-"
            )
            .replace(
                /掛ける|かける/g,
                "*"
            )
            .replace(
                /割る/g,
                "/"
            );


        if(
            /^[0-9+\-*/().\s]+$/
            .test(expression)
        ){


            return (

                "計算結果は\n\n" +

                Function(
                    "return "
                    +
                    expression
                )()

            );

        }


    }catch(e){


        return null;

    }


    return null;

}







/*
==================================
 日時システム
==================================
*/


function getDateAnswer(text){



    const now =
        new Date();



    if(
        text.includes("時間")
    ){

        return (

            "現在時刻は " +

            now.toLocaleTimeString(
                "ja-JP"
            )

            +

            " です。"

        );

    }




    if(
        text.includes("日付") ||
        text.includes("今日")
    ){


        return (

            "今日は " +

            now.toLocaleDateString(
                "ja-JP"
            )

            +

            " です。"

        );

    }



    return null;

}







/*
==================================
 会話記憶連携
==================================
*/


const YOSHIKUN_CONTEXT = {


    history: [],


    userMemory:{},


    maxLength:100


};






function addConversation(
    user,
    ai
){


    YOSHIKUN_CONTEXT.history.push({

        user:user,

        ai:ai,

        date:
            new Date()
            .toISOString()

    });



    if(
        YOSHIKUN_CONTEXT.history.length
        >
        YOSHIKUN_CONTEXT.maxLength
    ){

        YOSHIKUN_CONTEXT.history.shift();

    }

}






function getConversationHistory(){


    return YOSHIKUN_CONTEXT.history;

}







/*
==================================
 ユーザー記憶
==================================
*/


function saveUserMemory(
    key,
    value
){


    YOSHIKUN_CONTEXT.userMemory[key]
        =
        value;


}





function getUserMemory(key){


    return (
        YOSHIKUN_CONTEXT
        .userMemory[key]
        ||
        null
    );

}







/*
==================================
 回答優先順位
==================================
*/


function generateAnswer(input){



    let answer;



    /*
    1. 計算
    */

    answer =
        calculateExpression(input);



    if(answer)
        return answer;




    /*
    2. 日時
    */

    answer =
        getDateAnswer(input);



    if(answer)
        return answer;




    /*
    3. 知識検索
    */

    answer =
        generateAdvancedAnswer(input);



    return answer;

}







/*
==================================
 AI API
 app.js接続用
==================================
*/


const YoshikunAI = {



    ask:function(message){


        const response =
            generateAnswer(
                message
            );


        addConversation(

            message,

            response

        );


        return response;


    },



    history:function(){


        return getConversationHistory();


    },



    memory:{


        save:function(
            key,
            value
        ){

            saveUserMemory(
                key,
                value
            );

        },


        get:function(key){

            return getUserMemory(
                key
            );

        }


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
        YoshikunAI;

}