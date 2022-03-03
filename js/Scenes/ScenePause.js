var ScenePause = function()
{
    ScenePause.instance = this;

    this.create();
};

ScenePause.instance = null;

ScenePause.prototype = {

    create: function ()
    {
        grpScenePause = game.add.group(); grpScenePause.name = 'grpScenePause';

        txtPauseTitle = new Phaser.Text(game, (game.width >> 1), (game.height >> 1) - 250, 'PAUSE', {fill:'#FFFFFF', font: '40px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtPauseTitle, 0.5);
        grpScenePause.addChild(txtPauseTitle);

        btnPauseResume = game.add.sprite((game.width >> 1), (game.height >> 1), 'pak1', 'play.png');
        btnPauseResume.anchor.set(0.5);
        grpScenePause.add(btnPauseResume);
        AddButtonEvents(btnPauseResume, ScenePause.instance.OnPressedResume, ButtonOnInputOver, ButtonOnInputOut);

        btnPauseSounds = game.add.sprite((game.width >> 1) + 85, (game.height >> 1)- 110, 'pak1',  soundManager.soundPlaying ? 'sound_on_bt.png' : 'sound_off_bt.png');
        btnPauseSounds.anchor.set(0.5);
        grpScenePause.add(btnPauseSounds);
        AddButtonEvents(btnPauseSounds, ScenePause.instance.OnPressedSounds, ButtonOnInputOver, ButtonOnInputOut);

        btnPauseInstructions = game.add.sprite((game.width >> 1) - 85, (game.height >> 1)- 110, 'pak1', 'instruction_bt.png');
        btnPauseInstructions.anchor.set(0.5);
        grpScenePause.add(btnPauseInstructions);
        AddButtonEvents(btnPauseInstructions, this.OnPressedPauseInstructions, ButtonOnInputOver, ButtonOnInputOut);

        btnPauseRestart = game.add.sprite((game.width >> 1) + 85, (game.height >> 1) + 110, 'pak1', 'restart_bt.png');
        btnPauseRestart.anchor.set(0.5);
        grpScenePause.add(btnPauseRestart);
        AddButtonEvents(btnPauseRestart, ScenePause.instance.OnPressedRestart, ButtonOnInputOver, ButtonOnInputOut);

        btnPauseQuit = game.add.sprite((game.width >> 1) - 85, (game.height >> 1) + 110, 'pak1', 'levels_bt.png');
        btnPauseQuit.anchor.set(0.5);
        grpScenePause.add(btnPauseQuit);
        AddButtonEvents(btnPauseQuit, this.OnPressedPauseToMenu, ButtonOnInputOver, ButtonOnInputOut);

        grpScenePause.visible = false;

        this.updateTexts();
    },

    onResolutionChange: function()
    {
        btnPauseResume.position.setTo(      (game.width >> 1),       (game.height >> 1));
        btnPauseSounds.position.setTo(      (game.width >> 1) - 100, (game.height >> 1)- 110);
        btnPauseInstructions.position.setTo((game.width >> 1) + 100, (game.height >> 1)- 110);
        btnPauseRestart.position.setTo(     (game.width >> 1) + 100, (game.height >> 1) + 110);
        btnPauseQuit.position.setTo(        (game.width >> 1) - 100, (game.height >> 1) + 110);
        //txtPauseTitle.position.setTo(       (game.width >> 1),       imgGemsBG.y + (btnPauseSounds.y - imgGemsBG.y) / 2);
    },

    updateTexts: function()
    {
        txtPauseTitle.text = STR('PAUSED');
    },

    OnPressedSounds: function()
    {
        soundManager.toggleSounds();
        soundManager.toggleMusic('hudba_loop');

        btnPauseSounds.frameName = (soundManager.soundPlaying ? 'sound_on_bt.png' : 'sound_off_bt.png');
        btnPauseSounds.cachedTint = -1;

        btnSounds.frameName = (soundManager.soundPlaying ? 'icons_3.png' : 'icons_2.png');
        btnSounds.cachedTint = -1;
    },

    OnPressedResume: function()
    {
        soundManager.playSound('button');

        ScenePause.instance.HideAnimated();
        SceneOverlay.instance.HideAnimated();
        SceneGame.instance.ResumeGame();
    },

    OnPressedRestart: function()
    {
        soundManager.playSound('button');

        ScenePause.instance.HideAnimated();
        SceneOverlay.instance.HideAnimated();

        onGameOver(GAME_OVER_USER);

        SceneGame.instance.RestartGame();
    },

    OnPressedPauseLang: function()
    {
        soundManager.playSound('button');

        SceneToReturnFromLanguage = ScenePause.instance;

        ScenePause.instance.HideAnimated();
        SceneLanguages.instance.ShowAnimated();
    },

    OnPressedPauseInstructions: function()
    {
        soundManager.playSound('button');

        SceneToReturnFromInstructions = ScenePause.instance;

        ScenePause.instance.HideAnimated();
        SceneInstructions.instance.ShowAnimated();

        //PPS_USE-GAME_DISTRIBUTION
        /*
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd();
        }
        //PPS_USE-GAME_DISTRIBUTION
        */
    },

    OnPressedPauseCustomize: function()
    {
        soundManager.playSound('button');

        SceneToReturnFromCustomize = ScenePause.instance;

        ScenePause.instance.HideAnimated();
        SceneCustomize.instance.ShowAnimated();
    },

    OnPressedPauseToMenu: function()
    {
        soundManager.playSound('button');

        SceneOverlay.instance.HideAnimated();
        ScenePause.instance.HideAnimated();
        SceneGame.instance.HideAnimated();
        SceneLevelSelection.instance.ShowAnimated();

        onGameOver(GAME_OVER_USER);

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

    ShowAnimated: function(delay)
    {
        if(delay === undefined) delay = 0;

        btnPauseSounds.frameName = (soundManager.soundPlaying ? 'sound_on_bt.png' : 'sound_off_bt.png');

        this.onResolutionChange();

        soundManager.playMusic('hudba_loop');
        soundManager.playSound('button');

        ScenesTransitions.transitionStarted();

        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Back.Out;
        ScenesTransitions.showSceneAlpha(grpScenePause,          delay + 100, ScenesTransitions.TRANSITION_LENGTH);
        ScenesTransitions.showSceneScale(txtPauseTitle,          delay + 200, 200, null, Phaser.Easing.Back.Out);
        ScenesTransitions.showSceneScale(btnPauseSounds,         delay + 300, 200, null, Phaser.Easing.Back.Out)
        ScenesTransitions.showSceneScale(btnPauseInstructions,   delay + 300, 200, null, Phaser.Easing.Back.Out)
        ScenesTransitions.showSceneScale(btnPauseResume,         delay + 400, 200, null, Phaser.Easing.Back.Out)
        ScenesTransitions.showSceneScale(btnPauseRestart,        delay + 500, 200, null, Phaser.Easing.Back.Out)
        ScenesTransitions.showSceneScale(btnPauseQuit,           delay + 500, 200, ScenesTransitions.transitionFinished, Phaser.Easing.Back.Out);

        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
    },

    HideAnimated: function()
    {
        ScenesTransitions.transitionStarted();

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

        ScenesTransitions.hideSceneAlpha(grpScenePause, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
    }

}