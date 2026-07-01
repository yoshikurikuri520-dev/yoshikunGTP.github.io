/**
 * よしくんGPT NEO
 * sw.js
 *
 * Service Worker
 *
 * PWAオフライン管理
 */


"use strict";





/*
==================================
 キャッシュ設定
==================================
*/


const CACHE_NAME =

    "yoshikun-gpt-neo-v1.0.0";





const APP_FILES = [


    "./",

    "./index.html",

    "./style.css",

    "./manifest.json",


    "./js/config.js",

    "./js/knowledge.js",

    "./js/storage.js",

    "./js/speech.js",

    "./js/app.js",

    "./js/bootstrap.js"


];








/*
==================================
 インストール
==================================
*/


self.addEventListener(

    "install",

    event => {


        console.log(

            "YoshikunGPT Service Worker Install"

        );



        event.waitUntil(


            caches.open(

                CACHE_NAME

            )

            .then(

                cache => {


                    return cache.addAll(

                        APP_FILES

                    );


                }

            )


        );



        self.skipWaiting();


    }

);








/*
==================================
 有効化
==================================
*/


self.addEventListener(

    "activate",

    event => {


        console.log(

            "Service Worker Activate"

        );



        event.waitUntil(



            caches.keys()

            .then(

                keys => {


                    return Promise.all(


                        keys.map(

                            key => {



                                if(

                                    key !== CACHE_NAME

                                ){


                                    return caches.delete(

                                        key

                                    );


                                }



                            }


                        )


                    );


                }


            )


        );



        self.clients.claim();


    }

);








/*
==================================
 フェッチ制御
==================================
*/


self.addEventListener(

    "fetch",

    event => {



        const request =

            event.request;




        event.respondWith(



            caches.match(

                request

            )

            .then(

                cached => {



                    if(cached){


                        return cached;


                    }




                    return fetch(

                        request

                    )

                    .then(

                        response => {



                            const clone =

                                response.clone();





                            caches.open(

                                CACHE_NAME

                            )

                            .then(

                                cache => {


                                    cache.put(

                                        request,

                                        clone

                                    );


                                }

                            );




                            return response;



                        }


                    );



                }


            )


        );



    }

);








/*
==================================
 更新通知
==================================
*/


self.addEventListener(

    "message",

    event => {



        if(

            event.data ===

            "SKIP_WAITING"

        ){


            self.skipWaiting();


        }



    }

);