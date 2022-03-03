var SceneInstructions = function()
{
    SceneInstructions.instance = this;

    this.create();
};

SceneInstructions.instance = null;

SceneInstructions.prototype = {

    create: function ()
    {
        grpSceneInstructions = game.add.group();

        txtInstructionsTitle = new Phaser.Text(game, (game.width >> 1), 50, 'INSTRUCTIONS', {fill:'#FFFFFF', font: '26px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtInstructionsTitle, 0.5);
        grpSceneInstructions.addChild(txtInstructionsTitle);

        txtInstructions = new Phaser.Text(game, game.width >> 1, game.height >> 1, STR('INSTRUCTIONS_TEXT'), {fill:'#FFFFFF', font: '46px ' + GAME_FONT, wordWrap: true, wordWrapWidth: 400, align: 'center'});
        txtInstructions.anchor.x = getCorrectAnchorX(txtInstructions, 0.5);
        txtInstructions.anchor.y = getCorrectAnchorY(txtInstructions, 0.5);
        txtInstructions.lineSpacing = -7;
        grpSceneInstructions.add(txtInstructions);

        updateTextToHeight(txtInstructions, 23, 'gameFont', 320);

        btnInstructionsQuit = grpSceneInstructions.create(50, game.height - 50, 'pak1', 'back.png');
        btnInstructionsQuit.anchor.set(0.5);
        AddButtonEvents(btnInstructionsQuit, this.OnPressedInstructionsClose, ButtonOnInputOver, ButtonOnInputOut);

        grpSceneInstructions.visible = false;

        this.onResolutionChange();
        this.updateTexts();
    },

    onResolutionChange: function()
    {
        txtInstructionsTitle.position.setTo((game.width >> 1), 50);
        btnInstructionsQuit.reset(TOP_ICONS_BORDER, game.height - TOP_ICONS_BORDER);
        txtInstructions.reset(game.width >> 1, game.height >> 1);
    },

    updateTexts: function()
    {
        txtInstructionsTitle.text = STR('INSTRUCTIONS');
        txtInstructions.text = STR('INSTRUCTIONS_TEXT');
    },

    OnPressedInstructionsClose: function()
    {
        soundManager.playSound('button');
        ScenesTransitions.hideSceneAlpha(grpSceneInstructions);

        if(SceneToReturnFromInstructions == SceneMenu.instance)
            SceneOverlay.instance.HideAnimated();

        SceneToReturnFromInstructions.ShowAnimated();
    },

    ShowAnimated: function ()
    {
        SceneInstructions.instance.onResolutionChange();
        gameRunning = false;

        ScenesTransitions.transitionStarted();
        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
        ScenesTransitions.showSceneAlpha(grpSceneInstructions, 0, ScenesTransitions.TRANSITION_LENGTH);
        ScenesTransitions.showSceneScale(txtInstructions, 100, 200, ScenesTransitions.transitionFinished, Phaser.Easing.Back.Out, txtInstructions.scale.x);

        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
    },

    HideAnimated: function()
    {
        ScenesTransitions.transitionStarted();
        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
        ScenesTransitions.hideSceneAlpha(grpSceneInstructions, ScenesTransitions.TRANSITION_LENGTH * 0.5, ScenesTransitions.TRANSITION_LENGTH + 10, ScenesTransitions.transitionFinished);

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
    },

    GetRenderTypeName: function(type)
    {
        switch(type){
            case Phaser.AUTO:
                return 'AUTO';
            case Phaser.CANVAS:
                return 'CANVAS';
            case Phaser.WEBGL:
                return 'WEBGL';
        }
        return 'NaN';
    }
}