var SceneMenu = function()
{
    SceneMenu.instance = this;

    this.create();
};

SceneMenu.instance = null;

SceneMenu.prototype = {

    create: function ()
    {
        grpSceneMenu = game.add.group(); grpSceneMenu.name = 'grpSceneMenu';
        imgMenuLogo = game.add  .sprite((game.width >> 1), (game.height >> 1) - 100, 'pak1', 'logo.png');
        imgMenuLogo.anchor.set(0.5);
        imgMenuLogo.scale.set(1);
        grpSceneMenu.add(imgMenuLogo);

        btnMenuPlay = game.add.sprite((game.width >> 1), (game.height >> 1) + 100, 'pak1', 'play.png');
        btnMenuPlay.anchor.set(0.5);
        btnMenuPlay.scale.set(1);
        grpSceneMenu.add(btnMenuPlay);
        AddButtonEvents(btnMenuPlay, this.OnPressedPlay, ButtonOnInputOver, ButtonOnInputOut);

        btnMenuInstructions = game.add.sprite((game.width >> 1) - 110, (game.height >> 1) + 100, 'pak1', 'instr.png');
        btnMenuInstructions.anchor.set(0.5);
        grpSceneMenu.add(btnMenuInstructions);
        AddButtonEvents(btnMenuInstructions, this.OnPressedMenuInstructions, ButtonOnInputOver, ButtonOnInputOut);

        btnMenuLanguage = game.add.sprite((game.width >> 1) - 100, (game.height >> 1) + 100, 'pak1', 'flag0.png');
        btnMenuLanguage.anchor.set(0.5);
        grpSceneMenu.add(btnMenuLanguage);
        AddButtonEvents(btnMenuLanguage, this.OnPressedMenuChangeLanguage, ButtonOnInputOver, ButtonOnInputOut);

        //PPS_USE-LOGICIELEDUCATIF
        /*
        btnMenuLOGICIELEDUCATIF = game.make.sprite(0, 0, 'btnLogicieleeducatif');
        btnMenuLOGICIELEDUCATIF.anchor.set(0.5);
        grpSceneMenu.addChild(btnMenuLOGICIELEDUCATIF);
        AddButtonEvents(btnMenuLOGICIELEDUCATIF, function(){}, ButtonOnInputOver, ButtonOnInputOut, function(){
            var win = window.open("https://www.logicieleducatif.fr", '_blank');
            win.focus();
        });
        //PPS_USE-LOGICIELEDUCATIF
        */

        grpSceneMenu.visible = false;

        this.onResolutionChange();
        this.updateTexts();
    },

    onResolutionChange: function()
    {
        btnMenuInstructions.position.setTo(TOP_ICONS_BORDER, game.height - TOP_ICONS_BORDER);
        btnMenuLanguage.position.setTo(game.width - TOP_ICONS_BORDER, game.height - TOP_ICONS_BORDER);

        imgMenuLogo.position.setTo((game.width >> 1), (game.height >> 1) - 130);
        imgMenuLogo.scale.set(1);

        btnMenuPlay.position.setTo((game.width >> 1), (game.height >> 1) + 70);
        btnMenuPlay.scale.set(1);

        //PPS_USE-LOGICIELEDUCATIF
        /*
        btnMenuLOGICIELEDUCATIF.position.set(game.width / 2, game.height - 140);
        //PPS_USE-LOGICIELEDUCATIF
        */

    },

    updateTexts: function()
    {
    },

    update: function()
    {
    },

    updateSelectedLanguageFlag: function()
    {
        //["en", "de", "es", "fr", "it", "pt", "ru"]

        if(Languages.instance.language == 'en')
            btnMenuLanguage.frameName = 'flag0.png';
        if(Languages.instance.language == 'de')
            btnMenuLanguage.frameName = 'flag2.png';
        if(Languages.instance.language == 'es')
            btnMenuLanguage.frameName = 'flag3.png';
        if(Languages.instance.language == 'fr')
            btnMenuLanguage.frameName = 'flag1.png';
        if(Languages.instance.language == 'it')
            btnMenuLanguage.frameName = 'flag4.png';
        if(Languages.instance.language == 'pt')
            btnMenuLanguage.frameName = 'flag5.png';
        if(Languages.instance.language == 'ru')
            btnMenuLanguage.frameName = 'flag6.png';
    },

    OnPressedPlay: function()
    {
        window.location.href = "skidoswebview://PuzzlePieces-Test1?test=test";
        soundManager.playMusic('hudba_loop');
        soundManager.playSound('button');

        SceneMenu.instance.HideAnimated();
        SceneLevelSelection.instance.ShowAnimated();
        //SceneGame.instance.RestartGame();
        //SceneGame.instance.ShowAnimated();

        //PPS_USE-GAME_DISTRIBUTION
        /*
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd();
        }
        //PPS_USE-GAME_DISTRIBUTION
        */

        //PPS_USE-ARKADIUM
        /*
        ARK_game_arena_connector.fireEventToArena("event_change"); // refresh display ads
        //PPS_USE-ARKADIUM
        */
    },

    OnPressedMenuInstructions: function()
    {
        soundManager.playSound('button');

        SceneToReturnFromInstructions = SceneMenu.instance;

        SceneOverlay.instance.ShowAnimated();
        SceneInstructions.instance.ShowAnimated();

        //PPS_USE-GAME_DISTRIBUTION
        /*
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd();
        }
        //PPS_USE-GAME_DISTRIBUTION
        */
    },

    OnPressedMenuChangeLanguage: function()
    {
        soundManager.playSound('button');

        //["en", "de", "es", "fr", "it", "pt", "ru"]

        if(Languages.instance.language == 'en')
            language = 'de';
        else if(Languages.instance.language == 'de')
            language = 'es';
        else if(Languages.instance.language == 'es')
            language = 'fr';
        else if(Languages.instance.language == 'fr')
            language = 'it';
        else if(Languages.instance.language == 'it')
            language = 'pt';
        else if(Languages.instance.language == 'pt')
            language = 'ru';
        else if(Languages.instance.language == 'ru')
            language = 'en';

        Languages.instance.language = language;
        gameState.updateTexts();
        SceneMenu.instance.updateSelectedLanguageFlag();

        //PPS_USE-GAME_DISTRIBUTION
        /*
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd();
        }
        //PPS_USE-GAME_DISTRIBUTION
        */
    },

    ShowAnimated: function(delay)
    {
        if(grpSceneMenu.visible)
            return;

        SceneMenu.instance.updateTexts();
        SceneMenu.instance.updateSelectedLanguageFlag();

        if(delay === undefined) delay = 0;

        soundManager.playMusic('hudba_loop');
        soundManager.playSound('button');

        ScenesTransitions.transitionStarted();

        //ScenesTransitions.showSceneAlpha(grpSceneOverlay);
        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
        ScenesTransitions.showSceneAlpha(grpSceneMenu,          delay + 100, ScenesTransitions.TRANSITION_LENGTH);
        ScenesTransitions.showSceneScale(imgMenuLogo,           delay + 200, 200, null, Phaser.Easing.Back.Out);
        ScenesTransitions.showSceneScale(btnMenuPlay,           delay + 300, 200, null, Phaser.Easing.Back.Out)
        ScenesTransitions.showSceneScale(btnMenuInstructions,   delay + 400, 200, ScenesTransitions.transitionFinished, Phaser.Easing.Back.Out);
        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
    },

    HideAnimated: function()
    {
        ScenesTransitions.transitionStarted();

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
        ScenesTransitions.hideSceneScale(imgMenuLogo, 0, 200, null, Phaser.Easing.Back.In);
        ScenesTransitions.hideSceneScale(btnMenuPlay, 100, 200, null, Phaser.Easing.Back.In)

        ScenesTransitions.hideSceneAlpha(grpSceneMenu, 100, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
    }

}