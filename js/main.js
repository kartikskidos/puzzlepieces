
var ress = getMaxGameResolution();
var resolutionX = ress[0];
var resolutionY = ress[1];

var languageLoaded = false;
var isIOS = false;

var userAgent = navigator.userAgent || navigator.vendor || window.opera;
if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
    isIOS = true;

var aspect = window.innerWidth / window.innerHeight;

//console.log("[" + window.innerWidth + ", " + window.innerHeight + "] " + aspect);
var androidVersionString = getAndroidVersion();
var androidVersionMajor = 4;
if(androidVersionString != false)
    androidVersionMajor = parseInt(getAndroidVersion(), 10);

var GAME_FONT = 'gameFont';
if(androidVersionMajor < 4)
    GAME_FONT = 'arial'

var chromeVersion = null;
var bdBrowser = null;
var selectedRenderer = null;
var defaultBrowser40 = null; // this is true on android 4.3, default browser - renderer is CANVAS, and only mp3 files are loaded

try {
    chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
} catch (e) {
}

selectedRenderer = Phaser.WEBGL;

try {
    bdBrowser = window.navigator.appVersion.indexOf("bdbrowser") > -1;
    defaultBrowser40 = window.navigator.appVersion.indexOf("Version/4.0") > -1;
} catch (e) {
}

selectedRenderer = Phaser.WEBGLs;

if (!Phaser.Device.desktop && ((bdBrowser != null && bdBrowser == true) || (defaultBrowser40 != null && defaultBrowser40 == true))) // problem s maskami pri renderovani cez webgl v baidubrowser, preto sa zvoli canvas
    selectedRenderer = Phaser.CANVAS;

// if(MaliDetect())
//     selectedRenderer = Phaser.CANVAS;

//na iOS to slo zalostne pomaly
selectedRenderer = Phaser.CANVAS;

var config = {
    width: resolutionX,
    height: resolutionY,
    renderer: selectedRenderer,
    enableDebug: true,
    antialias: true,
    forceSetTimeOut: false
};

var game;
function phaserInit () {
    game = new Phaser.Game(config);
    //var game = new Phaser.Game(resolutionX, resolutionY, selectedRenderer, '');
    //game.preserveDrawingBuffer = true;
    game.forceSingleUpdate = true;

    game.state.add("SplashState", Splash);
    game.state.add("PreloadState", Preloader);
    game.state.add("GameState", GameState);

    game.state.start("SplashState");

    adinplay_init();

    //aby sa nezobrazoval scroll
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}

//PPS_DELETE-ARKADIUM
phaserInit();
//PPS_DELETE-ARKADIUM


function isPortrait() {

    switch (window.orientation) {
        case 0:
        case 180:
            return true;
    }
    return false;
}

function MaliDetect()
{
    var canv = document.createElement('canvas');
    canv.setAttribute("width", "1");
    canv.setAttribute("height", "1");
    document.body.appendChild(canv);

    var canvas = document.getElementsByTagName('canvas');
    var gl = canvas[0].getContext('webgl', { stencil: true });
    canvas[0].parentNode.removeChild(canvas[0]);

    if (!gl)
        return false;

    var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
    var renderer;
    if (dbgRenderInfo != null)
        renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
    else return false;

    var n = renderer.search("Mali-400");
    if (n != -1)
        return true;
    else
        return false;
}

window.addEventListener("touchend", function() {
    if (game === null) return;
    try { // na ios neexistuje .state, preto to je v try-catch
        if (game.sound.context.state !== 'running') {
            game.sound.context.resume();
        }
    } catch (err) {}
}, false);

//PPS_DELETE-ARKADIUM
window.addEventListener("contextmenu", function(e) { e.preventDefault();});
document.addEventListener("touchstart", function(e) { e.preventDefault();});
document.addEventListener("touchmove", function(e) { e.preventDefault();});

if (!isIOS) {
    document.addEventListener("touchstart", function (e) {e.preventDefault();});
    document.addEventListener("touchmove", function (e) {e.preventDefault();});
}
//PPS_DELETE-ARKADIUM

//PPS_DELETE-ARKADIUM
//PPS_DELETE-YANDEX
document.addEventListener("keydown", function (e) {e.preventDefault();});
document.addEventListener("keyup", function (e) {e.preventDefault();});
//PPS_DELETE-YANDEX
//PPS_DELETE-ARKADIUM

window.onscroll = function () {
    window.scrollTo(0,0);
}

//PPS_USE-ARKADIUM
/*
window.onload = function (){
    phaserInit();

    ARK_game_arena_connector.init();
    ARK_game_arena_connector.registerAction("pause", onGamePause_ark); // add action to "PAUSED" state
    ARK_game_arena_connector.registerAction("resume", onGameResume_ark); // add action to "RESUMED" state
}

var onGamePause_ark = function(){
    try {
        game.paused = true;
        game.sound.mute = true;
    } catch (e) {}
}
var onGameResume_ark = function(){
    try {
        game.paused = false;
        game.sound.mute = false;
    } catch (e) {}
}
//PPS_USE-ARKADIUM
*/

//PPS_USE-DEMO_VERSION
/*
document.title = GameData.BuildTitle + " - DEMO";
//PPS_USE-DEMO_VERSION
*/

//PPS_USE-GAMEPIX
/*
GamePix.pause = function(){
    game.paused = true;
    game.input.enabled = false;
    game.sound.mute = true;
};

GamePix.resume = function(){
    game.paused = false;
    game.input.enabled = true;
    game.sound.mute = false;
};
//PPS_USE-GAMEPIX
*/

//PPS_USE-YANDEX
/*
function showYandexAd () {
}

YaGames
    .init()
    .then(ysdk => {
    yandexApp: {
        enabled: false
    }
    showYandexAd = function () {
        if (showYandexAd.lastAdTime !== 'nan'){
            var rozdiel = Date.now() - showYandexAd.lastAdTime;
            if (rozdiel < 60000) return;
        }

        showYandexAd.lastAdTime = Date.now();
        ysdk.adv.showFullscreenAdv({
            callbacks: {
                onOpen: function() {
                    game.sound.mute = true;
                    game.paused = true;
                },
                onClose: function(wasShown) {
                    console.log('onClose', wasShown);
                    game.sound.mute = false;
                    game.paused = false;
                },
                onError: function(error) {
                    console.log('onError', error);
                    game.sound.mute = false;
                    game.paused = false;
                }
            }
        });
    };

showYandexAd.lastAdTime = 'nan';
});
//PPS_USE-YANDEX
*/

//PPS_USE-GRANDTECHNOLOGY
/*
function getJsonFromUrl() {
    var query = location.search.substr(1);
    var result = {};

    var queryList = query.split("&");
    for (var i = 0; i < queryList.length; i++){
        var pos = queryList[i].indexOf("=");
        var item = [queryList[i].substring(0, pos), queryList[i].substring(pos + 1)];
        result[item[0]] = decodeURIComponent(item[1]);
    }

    return result;
}

function createREQ(URL, method, dataToSend, callback) {
    //console.log("data sending", URL, dataToSend);

    var request = new XMLHttpRequest();

    request.onerror = function() {
        callback(dataToSend, {});
    };

    request.onload = function() {
        var result = JSON.parse(request.responseText);
        callback(dataToSend, result);
    };

    if (method == "GET"){
        request.open("GET", URL, true);

        request.send();
    }

    if (method == "POST"){
        request.open("POST", URL, true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.send(JSON.stringify(dataToSend));
    }
}

var playIT_header = getJsonFromUrl();
var playIT_APIkey = "5ECBA58BEF6B7";
var playIT_userData = null;



function getPlayItData(callback) {
    createREQ("http://www.api.playit.mobi/api/v1/backend/getuserdata/" + playIT_APIkey + "/" + playIT_header['game_id'] + "/" + playIT_header['user_id'], "GET", null, function (sendData, res) {
        console.log('loaded data:', res);
        if (res != undefined){
            //res = JSON.parse(res);
            if (res['status'] == true){
                if (res['user'] != null)
                    if (res['user']['game_profile'] != null)
                        playIT_userData = res['user']['game_profile'];

                callback(true);
            } else {
                callback(false, res['message']);
            }
        }
    });
}

function savePlayItData(data) {
    var sendObject = {
        "API_Key": playIT_APIkey,
        "game_id": playIT_header['game_id'],
        "user_id": playIT_header['user_id'],
        "new_profile": data
    };

    createREQ("http://www.api.playit.mobi/api/v1/backend/saveprofile", "POST", sendObject, function (data, res) {
        console.log('save data', res)
    });
}

function getPlayITsavedDataVar(param) {
    if (playIT_userData == undefined) return null;

    return playIT_userData[param];
}
//PPS_USE-GRANDTECHNOLOGY
*/

//PPS_USE-GAME_DISTRIBUTION
/*
window["GD_OPTIONS"] = {
// This is the gameId you get when you've create a game on gamedistribution.com
    "gameId": "31ed3b83318a4277920dcb5afb7cd20f",
    "onEvent": function(event) {
        switch (event.name) {
            case "SDK_GAME_START":
                // advertisement done, resume game logic and unmute audio
                if (game != null){
                    game.sound.mute = false;
                    game.paused = false;
                }
                break;
            case "SDK_GAME_PAUSE":
                // pause game logic / mute audio

                if (game != null)
                    game.sound.mute = true;
                break;
        }
    }
};
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://html5.api.gamedistribution.com/main.min.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'gamedistribution-jssdk'));

//PPS_USE-GAME_DISTRIBUTION
*/

//PPS_USE-DISTRIBUTE_GAMES
/*
window["SDK_OPTIONS"] = {
    gameId: "5jxnmbjio7qcczp555ojetr7mdjzf8zk",
    onEvent: function (a) {
        switch (a.name) {
            case "SDK_GAME_START":
                // advertisement done, resume game logic and unmute audio
                if (game != null) {
                    game.sound.mute = false;
                    game.paused = false;
                }
                break;
            case "SDK_GAME_PAUSE":
                // pause game logic / mute audio

                if(gameRunning)
                    if(grpSceneGame.visible && !grpScenePause.visible && !grpSceneGameFailed.visible && !grpSceneGameCleared.visible)
                        SceneGame.instance.OnPressedFromGameToPause();

                if (game != null) {
                    game.sound.mute = true;
                }

                break;
            case "SDK_READY":
                // when sdk is ready
                break;
        }
    }
};
(function (a, b, c) {
    var d = a.getElementsByTagName(b)[0];
    a.getElementById(c) || (a = a.createElement(b), a.id = c, a.src = "https://api.gamemonetize.com/sdk.js", d.parentNode.insertBefore(a, d))
})(document, "script", "gamemonetize-sdk");
//PPS_USE-DISTRIBUTE_GAMES
*/