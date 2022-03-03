var TOP_ICONS_BORDER = 30;

var SceneTopUI = function()
{
    SceneTopUI.instance = this;

    this.create();
};

SceneTopUI.instance = null;

SceneTopUI.prototype = {

    create: function()
    {

        grpSceneSounds = game.add.group();

        btnSounds = grpSceneSounds.create(game.width - TOP_ICONS_BORDER, TOP_ICONS_BORDER, 'pak1', (soundManager.soundPlaying ? 'icons_3.png' : 'icons_2.png'));
        btnSounds.anchor.set(0.5);
        AddButtonEvents(btnSounds, this.ToggleSounds, ButtonOnInputOver, ButtonOnInputOut);

        btnFullscreenToggle = grpSceneSounds.create(TOP_ICONS_BORDER, TOP_ICONS_BORDER, 'pak1', 'icons_0.png');
        btnFullscreenToggle.anchor.set(0.5);
        AddButtonEvents(btnFullscreenToggle, function(){this.button.buttonPressed = false;}, ButtonOnInputOver, ButtonOnInputOut, this.ToggleFullscreen);


        SceneTopUI.instance.onResolutionChange();
    },

    update: function()
    {
        btnFullscreenToggle.frameName = screenfull.isFullscreen ? 'icons_1.png' : 'icons_0.png';
    },

    onResolutionChange: function()
    {
        btnFullscreenToggle.visible = screenfull.isEnabled;

        btnSounds.position.setTo(game.width - TOP_ICONS_BORDER, TOP_ICONS_BORDER);
        btnFullscreenToggle.position.setTo(TOP_ICONS_BORDER, TOP_ICONS_BORDER);
    },

    ButtonsOnLeft: function ()
    {
        btnSounds.x = 26;
    },

    ButtonsOnRight: function ()
    {
        btnSounds.x = game.width - 26;
    },

    OpenSettings: function()
    {
        if(grpSceneGame.visible && !grpScenePause.visible && !grpSceneGameFailed.visible && !grpSceneGameCleared.visible){
            if(gameRunning)
                SceneGame.instance.OnPressedFromGameToPause();
            return;
        }

        SceneOverlay.instance.ShowAnimated();
        SceneSettings.instance.ShowAnimated();
    },

    ToggleSounds: function()
    {
        soundManager.toggleSounds();
        soundManager.toggleMusic(soundManager.actualMusic);

        btnPauseSounds.frameName = (soundManager.soundPlaying ? 'sound_on_bt.png' : 'sound_off_bt.png');
        btnPauseSounds.cachedTint = -1;

        btnSounds.frameName = (soundManager.soundPlaying ? 'icons_3.png' : 'icons_2.png');
        btnSounds.cachedTint = -1;
    },

    ToggleFullscreen: function()
    {
        this.button.buttonPressed = false;

        screenfull.toggle();
    }

}


