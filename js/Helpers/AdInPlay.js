/*

    AdInPlay Helper Script v1.0.0
    pbrezovan@inlogic.sk 6.3.2019

    NOTE : you may have to modify these functions
    adinplay_disableInput   : has to disable all inputs
    adinplay_enableInput    : enable previously disabled input
    adinplay_pauseMusic     : pause all music | sounds
    adinplay_resumeMusic    : resume previously paused music

    USAGE EXAMPLE :

        your function without adinplay :

        startGame: function ()
        {
            appState = APP_STATES.GAME_RUNNING;
            this.enableUserInput();
            analyticsOnLevelStartEvent(this.currentLevel);
            GPState_FillGameBoard.recalcSpeed();
        },

        your function with adinplay :

        startGame: function ()
        {
            adinplay_onAdStarted = function(){

                appState = APP_STATES.GAME_RUNNING;
                this.enableUserInput();
                analyticsOnLevelStartEvent(this.currentLevel);
                GPState_FillGameBoard.recalcSpeed();

            }.bind(this);
            adinplay_onAdFinished = function() {};
            adinplay_playVideoAd();
        },

*/

var ADS_ENABLED = false;
//PPS_USE-ADINPLAY
/*
ADS_ENABLED = true;
//PPS_USE-ADINPLAY
*/
var ADS_DELAY         = 60; //in secs
var ADS_ON_FIRST_PLAY = true;
var ADS_MOBILE_WIDTH  = 480;
var ADS_MOBILE_HEIGHT = 800;

//PPS_USE-STROER
/*
ADS_DELAY = 90;
//PPS_USE-STROER
*/

var adinplay_onAdStarted  = function(){};
var adinplay_onAdFinished = function(){};

function adinplay_init()
{
    if(!ADS_ENABLED)
        return;

    console.log('adinplay_init');

    if(typeof aiptag === 'undefined'){
        console.log('aiptag not initialised yet...');
        return;
    }

    var partner_id = 'inlogic';
    var url_params = getJsonFromUrl();
    if(url_params.hasOwnProperty('partner_id'))
        partner_id = url_params.partner_id;

    //PPS_USE-EXECENTER
    /*
    partner_id = '_exe';
    //PPS_USE-EXECENTER
    */
    console.log('AdInPlay partner_id = ' + partner_id);

    aiptag = aiptag || {};
    aiptag.cmd = aiptag.cmd || [];
    aiptag.cmd.display = aiptag.cmd.display || [];
    aiptag.cmd.player = aiptag.cmd.player || [];
    aiptag.subid = partner_id;

    aiptag.consented = true;
    //GDPR setting

    ads_time = 0;
    if(ADS_ON_FIRST_PLAY)
        ads_time = -ADS_DELAY;

    aiptag.cmd.player.push(function(){
        var W = game.width;
        var H = game.height;

        if(!Phaser.Device.desktop){
            W = ADS_MOBILE_WIDTH;
            H = ADS_MOBILE_HEIGHT;
        }

        console.log('adplayer [ ' + W + ', ' + H + ' ]');

        adplayer = new aipPlayer({
            AD_WIDTH: W,
            AD_HEIGHT: H,
            AD_FULLSCREEN: 1,
            AD_CENTERPLAYER: 0,
            AD_FADING: 0,
            LOADING_TEXT: 'loading advertisement',
            PREROLL_ELEM: function(){return document.getElementById('ads')},
            AIP_COMPLETE: function(){
                adinplay_resumeMusic();
                adinplay_enableInput();
                adinplay_onAdStarted();
            },
            AIP_REMOVE: function(){
                adinplay_onAdFinished();
            }
        });
    });
}

function adinplay_playVideoAd()
{
    console.log('adinplay_playVideoAd');

    if(!ADS_ENABLED){
        adinplay_enableInput();
        adinplay_onAdStarted();
        return;
    }

    if(typeof aiptag === 'undefined'){
        adinplay_init();
        adinplay_enableInput();
        adinplay_onAdStarted();
        return;
    }

    if(typeof adplayer === 'undefined'){
        adinplay_init();
        adinplay_enableInput();
        adinplay_onAdStarted();
        return;
    }

    if(game.time.totalElapsedSeconds() - ads_time < ADS_DELAY){
        adinplay_enableInput();
        adinplay_onAdStarted();
        return;
    }

    ads_time = game.time.totalElapsedSeconds();

    adinplay_disableInput();
    adinplay_pauseMusic();

    //PPS_USE-HACKADINPLAY
    /*
    aipPlayer.prototype.startPreRoll = function (a) {
        this.aipConfig.AD_UNIT_PREROLL = "inlogic.sk_preroll";
        a && (this.aipConfig.AD_UNIT_PREROLL = a);
        a = (new Date).getTime();
        var b = encodeURIComponent("http://www.inlogic.sk/games/index.html").replace(/'/g, "%27").replace(/"/g, "%22"),
            c = encodeURIComponent(this.aipConfig.DESCRIPTION_URL).replace(/'/g, "%27").replace(/"/g, "%22");
        this.aipConfig.AD_TAG = "https://pubads.g.doubleclick.net/gampad/ads?sz=960x540&iu=/421469808/" + this.aipConfig.AD_UNIT_PREROLL + "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&max_ad_duration=30000&url=" +
            b + "&description_url=" + c + "&correlator=" + a;
        aipAPItag.log(this.aipConfig.AD_TAG);
        aiptag.prerollCount = aiptag.prerollCount + 1 || 1;
        aipAPItag.inIframe() ? (aipAPItag.log("iframe AD - Normal Ad"), this.preparePreRoll()) : (aipAPItag.log("none iframe - Bid Ad"), this.getBidPrerollTag(this))
    };

    //PPS_USE-HACKADINPLAY
    */

    aiptag.cmd.player.push(function () {
        adplayer.startPreRoll();
    });
}

function adinplay_disableInput()
{
    if(typeof adinplay_overlay == 'undefined'){
        adinplay_overlay = game.make.sprite(game.width / 2, game.height / 2, 'void');
        adinplay_overlay.anchor.set(0, 1);
        adinplay_overlay.inputEnabled = true;
    }
    adinplay_overlay.position.setTo(game.width / 2, game.height / 2);
    adinplay_overlay.width = game.width;
    adinplay_overlay.height = game.heigth;
    adinplay_overlay.visible = true;
}

function adinplay_enableInput()
{
    if(typeof adinplay_overlay == 'undefined')
        return;
    adinplay_overlay.visible = false;
}

function adinplay_pauseMusic()
{
    game.sound.mute = true;
}

function adinplay_resumeMusic()
{
    game.sound.mute = false;
}

function getJsonFromUrl()
{
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