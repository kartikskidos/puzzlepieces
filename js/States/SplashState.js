/**
 * Created by echovanec on 10. 12. 2014.
 */

/** @constructor */
var Splash = function(game){};

var soundsMuted = false;

function enterIncorrectOrientation()
{
    //PPS_USE-DISABLE_ORIENTATION_CHECK
    /*
    return;
    //PPS_USE-DISABLE_ORIENTATION_CHECK
    */

    LOG("enterIncorrectOrientation()");
    //document.getElementById("wrongRotationText").innerHTML = ROTATE_TEXT[language];

    if (game.device.desktop) return;

    showDiv("wrongRotation");
    hideDiv("gameCanvas");

    soundsMuted = game.sound.mute;
    game.sound.mute = true;

    if(gameState != null) gameState.onGamePause();
}

function leaveIncorrectOrientation()
{
    //PPS_USE-DISABLE_ORIENTATION_CHECK
    /*
    return;
    //PPS_USE-DISABLE_ORIENTATION_CHECK
    */

    LOG("leaveIncorrectOrientation()");

    if (game.device.desktop) return;

    hideDiv("wrongRotation");
    showDiv("gameCanvas");

    game.sound.mute = soundsMuted;

    if(gameState != null) gameState.onGameResume();
}

Splash.prototype = {
    preload: function(){
        game.load.crossOrigin="Anonymous";
        game.canvas.id = 'gameCanvas';
        var gameCanvas = document.getElementById('gameCanvas');
        gameCanvas.style.position = 'fixed';

        this.game.stage.backgroundColor = 0x000000;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.refresh();

        window.addEventListener("resize", function () {
            onGameResize();
        });
        onGameResize();

        loadSplash(this.game);

        //PPS_USE-CLOUDGAMES
        /*
        game.stage.disableVisibilityChange = true;
        //PPS_USE-CLOUDGAMES
        //*/

        if(!game.device.desktop && game.device.chrome && game.device.touch && inIframe()) {
            game.input.mouse.stop();
        }
    },

    create: function()
    {
        //PPS_USE-LOGICIELEDUCATIF
        /*
        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logoLogicieleeducatif');
        this.logo.anchor.set(0.5);
        this.logo.alpha = 1;
        game.time.events.add(2000, function (){
            this.game.state.start("PreloadState");
        }, this);
        return;
        //PPS_USE-LOGICIELEDUCATIF
        */

        var logoImg = "inlogic_logo";
        //PPS_USE-LOGICIELEDUCATIF
        /*
        logoImg = 'logoLogicieleeducatif';
        //PPS_USE-LOGICIELEDUCATIF
        */

        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY,logoImg);
        this.logo.anchor.set(0.5);
        this.logo.alpha = 1;

        this.loadContinue();
    },

    loadContinue: function () {
        this.logo.inputEnabled = true;
        this.logo.events.onInputDown.add(this.startPreload, this);
        this.startPreload();
    },

    hideLogo: function () {
        game.add.tween(this.logo).to( { alpha : 0 }, ScenesTransitions.TRANSITION_LENGTH * 3, ANIMATION_CUBIC_IO, true, 0, 0, false);
    },

    startPreload: function()
    {
        this.game.state.start("PreloadState");
    }

};

var savedClientWidth = 0;
var savedClientHeight = 0;

function onGameResize()
{
    LOG('onGameResize()')

    if (game === null) {return;}

    // var w = window,
    //     d = document,
    //     e = d.documentElement,
    //     g = d.getElementsByTagName('body')[0],
    //     x = w.innerWidth || e.clientWidth || g.clientWidth,
    //     y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    // fixme cekovat to len pre IOS cez window.innerHeight, window.innerWidth???

    var docWidth = document.documentElement.clientWidth;
    var docHeight = document.documentElement.clientHeight;

    if(isIOS){
        //len pre landscape
        if(docWidth > docHeight){
            docWidth = window.innerWidth;
            docHeight = window.innerHeight;
        }
    }

    GAME_CURRENT_ORIENTATION = ORIENTATION_PORTRAIT;

    resolutionX = game_resolution.x;
    var aspect = docHeight / docWidth;
    resolutionY = resolutionX * aspect;
    if (isNaN(resolutionY)) {
        resolutionY = 0;
    }

    if (resolutionY < game_resolution.yMin) resolutionY = game_resolution.yMin;
    if (resolutionY > game_resolution.yMax) resolutionY = game_resolution.yMax;

    if (docHeight > docWidth)
        leaveIncorrectOrientation();
    else
        enterIncorrectOrientation();


    //if((savedClientWidth == document.documentElement.clientWidth) && (savedClientHeight == document.documentElement.clientHeight))
    //    return;

    savedClientWidth = docWidth;
    savedClientHeight = docHeight;

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    game.scale.setGameSize(resolutionX, resolutionY);

    if (gameState != null)
        gameState.onResolutionChange();

    if (preloadState != null)
        preloadState.onResolutionChange();

     // fixme dorobit nieco co sa zavola raz pri zmene orientacie ?
}


function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}