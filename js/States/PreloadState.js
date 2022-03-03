/**
 * Created by echovanec on 10. 12. 2014.
 */

/** @constructor */
var Preloader = function(game){}
var loaderPosY;
var preloadState;

Preloader.prototype = {

    preload: function(){

        sceneLanguages = null;
        startTime = Date.now();

        this.game.stage.backgroundColor = 0xFFFFFF;
        preloadState = this;

        loaderPosY = this.game.world.height / 5 * 4.5;

        var logoImg = "inlogic_logo";

        //PPS_USE-REMOVE_INIT_INLLOGO
        /*
        logoImg = 'game_logo';
        //PPS_USE-REMOVE_INIT_INLLOGO
        */

        //PPS_USE-LOGICIELEDUCATIF
        /*
        logoImg = 'logoLogicieleeducatif';
        //PPS_USE-LOGICIELEDUCATIF
        */

        imgSplash = this.game.add.sprite(game.width / 2, game.height / 2, logoImg);
        imgSplash.anchor.x = 0.5;
        imgSplash.anchor.y = 0.5;

        imgBtn = this.game.add.sprite(game.width / 2, game.height / 2, 'void');
        imgBtn.anchor.set(0.5);
        imgBtn.scale.x = (game.width / 100) + 0.2;
        imgBtn.scale.y = (game.height / 100) + 0.2;

        new Languages();

        percentageText = this.game.add.text(this.game.world.centerX, this.game.height - 20, "0 %", { font: '35px "Arial Black"', fill:'#000000'});
        percentageText.anchor.set(0.5);

        this.game.load.onFileComplete.add(this.fileComplete, this);

        loadImages(this.game);

        loadSounds(this.game);
        this.loadLanguageSettings();

        //this._create();

        game.input.onDown.add(function () {
            if (game.paused){
                game.paused = false;
            }
        });
    },

    fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles)
    {
        //PPS_USE-GAMEPIX
        /*
        GamePix.loading(progress);
        //PPS_USE-GAMEPIX
        */

        //LOG(progress + ' %');
        percentageText.text = progress + " %";
        if(progress >= 100){
            //PPS_DELETE-GRANDTECHNOLOGY
            //PPS_DELETE-GAMEPIX
            this._create();
            //PPS_DELETE-GAMEPIX
            //PPS_DELETE-GRANDTECHNOLOGY

            //PPS_USE-GAMEPIX
            /*
            GamePix.loaded().then(function () {
                game.paused = false;
                this._create();
            }.bind(this));
            //PPS_USE-GAMEPIX
            */

            //PPS_USE-GRANDTECHNOLOGY
            /*
            getPlayItData(function (gameCanStart, errorMsg) {
                if (gameCanStart === true){
                    this._create();
                } else {
                    game.add.tween(percentageText).to( { alpha : 0 }, ScenesTransitions.TRANSITION_LENGTH * 1.4, "Linear", true, ScenesTransitions.TRANSITION_LENGTH * 3);
                    game.add.tween(imgSplash).to( { alpha : 0 }, ScenesTransitions.TRANSITION_LENGTH * 1.4, "Linear", true, ScenesTransitions.TRANSITION_LENGTH * 3);

                    grandTechErrorText = game.add.text(game.width/2, game.height/2, errorMsg.toUpperCase(), { font: '25px gameFont', fill:'#000000', align: "center", wordWrap: true, wordWrapWidth: game.width * 0.8});
                    grandTechErrorText.anchor.set(0.5);
                    grandTechErrorText.alpha = 0;
                    grandTechErrorText.lineSpacing = -10;
                    game.add.tween(grandTechErrorText).to( { alpha : 1 }, ScenesTransitions.TRANSITION_LENGTH * 1.4, "Linear", true, ScenesTransitions.TRANSITION_LENGTH * 5);
                }
            }.bind(this));
            //PPS_USE-GRANDTECHNOLOGY
            */
        }
    },

    _create: function()
    {
        //game.add.tween(this.loadingBar).to( { alpha : 0 }, 500, ANIMATION_CUBIC_IO, true, 0, 0, false);
        //this.startGame();

        imgBtn.inputEnabled = true;
        imgBtn.events.onInputDown.add(this.inputListener, this);

        //this.continueText = this.game.add.text(this.game.world.centerX, loaderPosY + 2, START_TEXT[language], { font: '25px Arial', fill:'#FFFFFF'});
        //this.continueText.anchor.set(getCorrectAnchorX(this.continueText, 0.5));

        game.add.tween(percentageText).to( { alpha : 0 }, ScenesTransitions.TRANSITION_LENGTH * 1.4, "Linear", true, ScenesTransitions.TRANSITION_LENGTH * 3, -1, true);

        var timeDelta = Date.now() - startTime;

        if(timeDelta < 2000){
            game.time.events.add(2000 - timeDelta, function(){this.startGame();}, this);
        } else
            this.startGame();

        //this.startGame();
    },

    createMenuText: function(x, y, text)
    {
        var txtObj = new Phaser.Text(game, x, y, text, {fill:'#FED87F'});
        txtObj.anchor.x = getCorrectAnchorX(txtObj, 0.5);
        txtObj.anchor.y = getCorrectAnchorY(txtObj, 0.5);
        txtObj.shadowOffsetX = 3;
        txtObj.shadowOffsetY = 3;
        txtObj.shadowColor = '#660000';

        return txtObj;
    },

    loadLanguageSettings: function ()
    {
        /*
        try {
            storedData = localStorage.getItem('plck-lang');
            if (storedData != null) {
                parsedData = JSON.parse(storedData);

                if (parsedData != null) {
                    parsedData = parseInt(parsedData);
                    if (parsedData >= 0 && parsedData < LANGUAGES_COUNT) {
                        language = parsedData;
                        languageLoaded = true;
                    } else {
                        language = LANGUAGE_EN;
                    }
                }
            }
        }catch (err) {
            language = LANGUAGE_EN;
        }
        */

        Languages.instance.language = "en";

        var systemLanguage = navigator.userLanguage || navigator.language;

        if(systemLanguage.indexOf("fr") == 0)
            Languages.instance.language = "fr";
        if(systemLanguage.indexOf("it") == 0)
            Languages.instance.language = "it";
        if(systemLanguage.indexOf("de") == 0)
            Languages.instance.language = "de";
        if(systemLanguage.indexOf("es") == 0)
            Languages.instance.language = "es";
        if(systemLanguage.indexOf("pt") == 0)
            Languages.instance.language = "pt";
        if(systemLanguage.indexOf("br") == 0)
            Languages.instance.language = "pt";
        if(systemLanguage.indexOf("ru") == 0)
            Languages.instance.language = "ru";

        var lang = getUrlParameterByName('lang');

        if(lang !== null)
            Languages.instance.language = lang;

        //PPS_USE-DISABLE_LANG_SCREEN
        /*
        Languages.instance.language = "en";
        //PPS_USE-DISABLE_LANG_SCREEN
        */

        //PPS_USE-YANDEX
        /*
        Languages.instance.language = "ru";
        //PPS_USE-YANDEX
        */
        //PPS_USE-ESLANG
        /*
        Languages.instance.language = "es";
        //PPS_USE-ESLANG
        // */
    },

    //update: function () {
    //    this.fpsText.text = this.game.time.fps;
    //},

    inputListener: function()
    {
        this.startGame();
    },

    startGame: function()
    {
        if(sceneLanguages != null)
            return;

        imgBtn.inputEnabled = false;
        imgBtn.events.onInputDown.dispose();
        this.game.world.remove(imgSplash);
        this.game.world.remove(imgBtn);

        ScenesTransitions.hideSceneAlpha(percentageText);

        game.state.start('GameState');

    },

    onResolutionChange: function()
    {
        loaderPosY = this.game.world.height / 5 * 4.5;

        imgSplash.reset(game.width / 2, game.height / 2);

        imgBtn.reset(game.width / 2, game.height / 2);
        imgBtn.scale.x = (game.width / 100) + 0.2;
        imgBtn.scale.y = (game.height / 100) + 0.2;

        percentageText.reset(this.game.world.centerX, this.game.height - 20);

        if(sceneLanguages !== undefined)
            if(sceneLanguages != null){
                sceneLanguages.onResolutionChange();

            }

        //PPS_USE-GRANDTECHNOLOGY
        /*
        try {
            grandTechErrorText.position.set(game.width/2, game.height/2);
        } catch (e) {}
        //PPS_USE-GRANDTECHNOLOGY
        */


    }
}