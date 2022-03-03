var HOURS_TO_BONUS_GAME = 2;

var SceneGameCleared = function()
{
    SceneGameCleared.instance = this;

    this.create();
};
SceneGameCleared.instance = null;

SceneGameCleared.prototype = {

    create: function ()
    {
        grpSceneGameCleared = game.add.group(); grpSceneGameCleared.name = 'grpSceneGameCleared';

        txtGameClearedCleared = new Phaser.Text(game, (game.width >> 1), (game.height >> 1) - 100, 'LEVEL\nCLEARED', {fill:'#ffffff', font: '55px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameClearedCleared, 0.5);
        grpSceneGameCleared.addChild(txtGameClearedCleared);

        imgGameClearedDiamond = game.add.sprite((game.width >> 1), (game.height >> 1) + 123, 'pak1', 'diamond_big.png');
        imgGameClearedDiamond.anchor.set(0.5);
        grpSceneGameCleared.addChild(imgGameClearedDiamond);

        txtGameClearedDiamond = new Phaser.Text(game, 0, 50, '+' + PRICE_GAME_CLEARED, {fill:'#FFFFFF', font: '25px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameClearedDiamond, 0.5);
        imgGameClearedDiamond.addChild(txtGameClearedDiamond);

        btnGameClearedClaim = game.add.sprite((game.width >> 1), (game.height >> 1) - 53, 'pak1', 'bt_accept_ads.png');
        btnGameClearedClaim.anchor.set(0.5);
        btnGameClearedClaim.scale.set(0.5);
        grpSceneGameCleared.add(btnGameClearedClaim);
        AddButtonEvents(btnGameClearedClaim, this.OnPressedGameClearedClaimX3, ButtonOnInputOver, ButtonOnInputOut);

        txtGameClearedClaim = new Phaser.Text(game, 35, 3, 'CLAIM', {fill:'#FFFFFF', font: '27px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameClearedClaim, 0.5);
        txtGameClearedClaim.lineSpacing = -14;
        btnGameClearedClaim.addChild(txtGameClearedClaim);

        btnGameClearedContinue = game.add.sprite((game.width >> 1) + 85, (game.height >> 1) + 240, 'pak1', 'bt_play.png');
        btnGameClearedContinue.anchor.set(0.5);
        grpSceneGameCleared.add(btnGameClearedContinue);
        AddButtonEvents(btnGameClearedContinue, this.OnPressedGameClearedContinue, ButtonOnInputOver, ButtonOnInputOut);

        //btnGameClearedQuit = createButtonWithIcon(grpSceneGameCleared, (game.width >> 1) - 120, (game.height >> 1) + 280, 10, SceneGameCleared.instance.OnPressedGameClearedQuit);
        btnGameClearedQuit = game.add.sprite((game.width >> 1) - 85, (game.height >> 1) + 240, 'pak1', 'levels_bt.png');
        btnGameClearedQuit.anchor.set(0.5);
        grpSceneGameCleared.add(btnGameClearedQuit);
        AddButtonEvents(btnGameClearedQuit, this.OnPressedGameClearedQuit, ButtonOnInputOver, ButtonOnInputOut);

        grpSceneGameCleared.visible = false;

        this.updateTexts();
    },

    onResolutionChange: function()
    {
        var posy = (game.height >> 1);

        btnGameClearedClaim.alpha = ADS_ENABLED ? 1 : 0;

        btnGameClearedContinue.position.setTo((game.width >> 1) + 100, posy + 110);
        btnGameClearedQuit.position.setTo((game.width >> 1) - 100, posy + 110);

        //txtGameClearedCleared.position.setTo((game.width >> 1), imgGemsBG.y + (btnPauseSounds.y - imgGemsBG.y) / 2);

        var tmpy = txtGameClearedCleared.y + (btnGameClearedContinue.y - txtGameClearedCleared.y) / 2 - 30;

        imgGameClearedDiamond.y = tmpy;

        if(ADS_ENABLED)
            btnGameClearedClaim.position.setTo(game.width >> 1, btnGameClearedContinue.y);
    },

    updateTexts: function()
    {
        txtGameClearedCleared.text = STR('CLEARED');
        updateTextToWidth(txtGameClearedCleared, 55, 'gameFont', 400);

        txtGameClearedClaim.text = STR('CLAIM') + '\nx3';
    },

    OnPressedSounds: function()
    {
        soundManager.toggleSounds();
        soundManager.toggleMusic('hudba_loop');
        icnPauseSounds.frameName = (soundManager.soundPlaying ? 'icons_3.png' : 'icons_2.png');
    },

    OnPressedRestart: function()
    {
        soundManager.playSound('button');

        SceneGameCleared.instance.HideAnimated();
        SceneOverlay.instance.HideAnimated();

        SceneGame.instance.RestartGame();
    },

    OnPressedShop: function()
    {
        soundManager.playSound('button');

        SceneToReturnFromCustomize = SceneMenu.instance;

        SceneGame.instance.HideAnimated();
        SceneGameCleared.instance.HideAnimated();
        SceneCustomize.instance.ShowAnimated();
    },

    OnPressedGameClearedClaimX3: function()
    {
        ads_time = -ADS_DELAY;
        adinplay_onAdStarted = function(){
            game.paused = false;

            btnGameClearedClaim.frameName = 'bt_accept_ads2.png';
            btnGameClearedClaim.inputEnabled = false;

            SceneGems.instance.incPlayerGems(PRICE_GAME_CLEARED * 2);

            SceneGameCleared.instance.OnPressedGameClearedContinue();

        }.bind(this);
        adinplay_onAdFinished = function() {};
        adinplay_playVideoAd();
    },

    OnPressedGameClearedContinue: function()
    {
        SceneGameCleared.instance.NextLevel();

        soundManager.playSound('button');

        SceneOverlay.instance.HideAnimated();
        SceneGameCleared.instance.HideAnimated();

        SceneGame.instance.RestartGame();
        gameRunning = false;

        SceneOverlay.instance.ShowAnimated();
        SceneLevelDescription.instance.ShowAnimated(0, true);

    },

    NextLevel: function()
    {
        if(selectedLevel > 100){
            //TODO: overit
            selectedLevel = previousLevel;
            return;
        }

        selectedLevel ++;
        if(selectedLevel >= Levels.length)
            selectedLevel = 0;

        previousLevel = selectedLevel;

        if(selectedLevel % 3 == 0){
            selectedLevel = 100 + Math.floor(selectedLevel / 3);
        }
    },

    MarkLevelPlayed: function()
    {
        LevelFlags[selectedLevel] = 10;
        GameData.Save();
    },

    UnlockNextLevel: function()
    {
        var level = selectedLevel;

        if(level > 100)
            return;

        level ++;
        if(level >= Levels.length){
            return;
        }

        LevelFlags[level] = 1;
        GameData.Save();
    },

    OnPressedGameClearedQuit: function()
    {
        soundManager.playSound('button');

        SceneGame.instance.HideAnimated();
        SceneOverlay.instance.HideAnimated();
        SceneGameCleared.instance.HideAnimated();
        SceneLevelSelection.instance.ShowAnimated();

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
        if(delay === undefined) delay = 0;

        btnGameClearedClaim.frameName = 'bt_accept_ads.png';
        btnGameClearedClaim.inputEnabled = true;

        this.MarkLevelPlayed();
        this.UnlockNextLevel();

        SceneGems.instance.incPlayerGems(PRICE_GAME_CLEARED);
        SceneGame.instance.UpdateBoosterIcons();

        this.updateTexts();
        this.onResolutionChange();

        soundManager.playMusic('hudba_loop');
        soundManager.playSound('button');

        ScenesTransitions.transitionStarted();

        //ScenesTransitions.showSceneAlpha(grpSceneOverlay);
        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Back.Out;

        ScenesTransitions.showSceneAlpha(grpSceneGameCleared);
        ScenesTransitions.showSceneScale(txtGameClearedCleared,  delay, 200);delay += 100;
        ScenesTransitions.showSceneScale(imgGameClearedDiamond,  delay, 400, function(){
            particles.CreateFinalStars(imgGameClearedDiamond.worldPosition.x, imgGameClearedDiamond.worldPosition.y, 0xFFFFFF, 10, 0);
        });delay += 100;

        if(ADS_ENABLED){
            ScenesTransitions.showSceneScale(btnGameClearedClaim,    delay, 200, function(){}, Phaser.Easing.Back.Out, 0.65); delay += 100;
        }

        ScenesTransitions.showSceneScale(btnGameClearedContinue, delay, 200);
        ScenesTransitions.showSceneScale(btnGameClearedQuit,     delay, 200, function(){
            //PPS_DELETE-STROER
            ScenesTransitions.transitionFinished();
            //PPS_DELETE-STROER

            //PPS_USE-STROER
            /*
            game.time.events.add(500, function () {
                adinplay_onAdStarted = function(){
                    game.paused = false;

                    ScenesTransitions.transitionFinished();
                }.bind(this);
                adinplay_onAdFinished = function() {};
                adinplay_playVideoAd();
            }, this);
            //PPS_USE-STROER
            */


            onGameOver(GAME_OVER_GAME);
        });

        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
    },

    HideAnimated: function()
    {
        ScenesTransitions.transitionStarted();

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

        ScenesTransitions.hideSceneAlpha(grpSceneGameCleared, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
    }

}