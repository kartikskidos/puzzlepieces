var SceneLevelDescription = function()
{
    SceneLevelDescription.instance = this;

    this.create();
};

SceneLevelDescription.instance = null;

SceneLevelDescription.prototype = {

    create: function ()
    {
        grpSceneLevelDescription = game.add.group(); grpSceneLevelDescription.name = 'grpSceneLevelDescription';

        imgPauseBG = game.add.sprite((game.width >> 1), (game.height >> 1), 'pak1', 'blank.png');
        imgPauseBG.width = game.width * 1.1;
        imgPauseBG.height = 300;
        imgPauseBG.anchor.set(0.5);
        //imgPauseBG.tint = 0xFFFFFF;
        grpSceneLevelDescription.addChild(imgPauseBG);

        txtLevelDestriptionNum = new Phaser.Text(game, (game.width >> 1), (game.height >> 1) - 250, '1', {fill:'#FFFFFF', font: '40px ' + GAME_FONT, align: 'center'});
        txtLevelDestriptionNum.lineSpacing = -6;
        setCorrectAnchor(txtLevelDestriptionNum, 0.5);
        grpSceneLevelDescription.addChild(txtLevelDestriptionNum);

        txtLevelDestriptionDesc = new Phaser.Text(game, (game.width >> 1), (game.height >> 1) + 50, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor', {fill:'#f8aa7c', font: '20px ' + GAME_FONT, wordWrap: true, wordWrapWidth: 400, align: 'center'});
        setCorrectAnchor(txtLevelDestriptionDesc, 0.5);
        txtLevelDestriptionDesc.lineSpacing = -7;
        grpSceneLevelDescription.addChild(txtLevelDestriptionDesc);

        imgLevelDescriptionIconDisksTime = game.add.sprite((game.width >> 1) + 50, (game.height >> 1) - 100 , 'pak1', 'pieces_icon.png');
        imgLevelDescriptionIconDisksTime.anchor.set(0.5);
        grpSceneLevelDescription.add(imgLevelDescriptionIconDisksTime);

        imgLevelDescriptionIconTime = game.add.sprite((game.width >> 1) + 50, (game.height >> 1) - 100 , 'pak1', 'time_icon.png');
        imgLevelDescriptionIconTime.anchor.set(0.5);
        grpSceneLevelDescription.add(imgLevelDescriptionIconTime);

        txtLevelDestriptionTime = new Phaser.Text(game, 0, 45, '300s', {fill:'#f8aa7c', font: '25px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtLevelDestriptionTime, 0.5);
        imgLevelDescriptionIconTime.addChild(txtLevelDestriptionTime);

        txtLevelDestriptionPointsVal = new Phaser.Text(game, (game.width >> 1) - 40, (game.height >> 1) - 90, '120', {fill:'#f8aa7c', font: '50px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtLevelDestriptionPointsVal, 0.5);
        grpSceneLevelDescription.addChild(txtLevelDestriptionPointsVal);

        txtLevelDestriptionPoints = new Phaser.Text(game, 0, 23, 'pts.', {fill:'#f8aa7c', font: '15px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtLevelDestriptionPoints, 0.5);
        txtLevelDestriptionPointsVal.addChild(txtLevelDestriptionPoints);

        imgLevelDescriptionGoalAnchor = game.add.sprite((game.width >> 1), (game.height >> 1) - 90 , 'pak1', 'void.png');
        imgLevelDescriptionGoalAnchor.anchor.set(0.5);
        grpSceneLevelDescription.addChild(imgLevelDescriptionGoalAnchor);

        txtLevelDestriptionGoalCount = new Phaser.Text(game, -35, 0, '1x', {fill:'#f8aa7c', font: '20px ' + GAME_FONT, align: 'center'});
        txtLevelDestriptionGoalCount.anchor.x = getCorrectAnchorY(txtLevelDestriptionGoalCount, 1);
        txtLevelDestriptionGoalCount.anchor.y = getCorrectAnchorY(txtLevelDestriptionGoalCount, 0.5);
        imgLevelDescriptionGoalAnchor.addChild(txtLevelDestriptionGoalCount);

        imgLevelDescriptionGoal = [];

        for(var i = 0; i < 6; i++){
            imgLevelDescriptionGoal[i] = grpSceneGame.create(0, 0, 'pak1', 'pieces_ico_off.png');
            imgLevelDescriptionGoal[i].anchor.setTo(1, 0.5);
            imgLevelDescriptionGoal[i].angle = i * 60;
            imgLevelDescriptionGoalAnchor.addChild(imgLevelDescriptionGoal[i]);
        }

        btnSceneLevelDescriptionPlay = game.add.sprite((game.width >> 1), (game.height >> 1) , 'pak1', 'bt_play.png');
        btnSceneLevelDescriptionPlay.anchor.set(0.5);
        grpSceneLevelDescription.add(btnSceneLevelDescriptionPlay);
        AddButtonEvents(btnSceneLevelDescriptionPlay, SceneLevelDescription.instance.OnPressedPlay, ButtonOnInputOver, ButtonOnInputOut);

        btnLevelDescriptionQuit = game.add.sprite(50, game.height - 50, 'pak1', 'back.png');
        btnLevelDescriptionQuit.anchor.set(0.5);
        grpSceneLevelDescription.add(btnLevelDescriptionQuit);
        AddButtonEvents(btnLevelDescriptionQuit, SceneLevelDescription.instance.OnPressedQuit, ButtonOnInputOver, ButtonOnInputOut);

        grpSceneLevelDescription.visible = false;

        this.updateTexts();
    },

    OnEscPressed: function()
    {
        if(ScenesTransitions.transitionActive)
            return;
        if(!grpSceneLevelDescription.visible)
            return;

        SceneLevelDescription.instance.OnPressedQuit();
    },

    OnPressedOverlay: function()
    {
        if(ScenesTransitions.transitionActive)
            return;
        if(!grpSceneLevelDescription.visible)
            return;

        SceneLevelDescription.instance.OnPressedQuit();
    },

    onResolutionChange: function()
    {
        imgPauseBG.y = (game.height >> 1);
        txtLevelDestriptionNum.y = (game.height >> 1) - 250;
        txtLevelDestriptionNum.y = (game.height >> 1) - 250;
        txtLevelDestriptionDesc.y = (game.height >> 1);
        imgLevelDescriptionIconTime.y = (game.height >> 1) - 100;
        txtLevelDestriptionPointsVal.y = (game.height >> 1) - 90;
        imgLevelDescriptionGoalAnchor.y = (game.height >> 1) - 90;
        imgLevelDescriptionIconDisksTime.y = (game.height >> 1) - 90;

        btnSceneLevelDescriptionPlay.y = (game.height >> 1) + 80;
        btnLevelDescriptionQuit.position.setTo(TOP_ICONS_BORDER, game.height - TOP_ICONS_BORDER);
    },

    updateTexts: function()
    {
    },

    OnPressedPlay: function()
    {
        soundManager.playSound('button');

        SceneLevelDescription.instance.HideAnimated();
        SceneOverlay.instance.HideAnimated();
        SceneLevelSelection.instance.HideAnimated();

        if(SceneLevelDescription.instance.ingameMode)
        {
            gameRunning = true;
        }else{
            SceneGame.instance.RestartGame();
            SceneGame.instance.ShowAnimated();
        }
    },

    OnPressedQuit: function()
    {
        soundManager.playSound('button');

        SceneOverlay.instance.HideAnimated();
        SceneLevelDescription.instance.HideAnimated();
    },

    createLevelDescription: function(type)
    {
        var retval = '';

        if(isLevelOfType(LT_SCORE))
            retval += STR(LT_SCORE);
        if(isLevelOfType(LT_SHAPE))
            retval += STR(LT_SHAPE);
        if(isLevelOfType(LT_TIMER))
            retval += STR(LT_TIMER);
        if(isLevelOfType(LT_DISKS_TIMER))
            retval += STR(LT_DISKS_TIMER);

        return retval;
    },

    updateLevelDesc: function()
    {
        txtLevelDestriptionNum.text = STR('LEVEL') + ' ' + (selectedLevel + 1);
        if(selectedLevel > 100){
            txtLevelDestriptionNum.text = 'BONUS\n' + STR('LEVEL') + ' ' + (selectedLevel - 100);
        }

        txtLevelDestriptionDesc.text = this.createLevelDescription(Levels[selectedLevel].type);

        imgLevelDescriptionGoalAnchor.visible = false;
        txtLevelDestriptionPointsVal.visible = false;
        imgLevelDescriptionIconTime.visible = false;
        imgLevelDescriptionIconDisksTime.visible = false;

        var elements = [];

        if(isLevelOfType(LT_SCORE)){
            txtLevelDestriptionPointsVal.x = (game.width >> 1);
            txtLevelDestriptionPointsVal.visible = true;
            txtLevelDestriptionPointsVal.text = '' + Levels[selectedLevel].score;
            elements.push(txtLevelDestriptionPointsVal);
        }

        if(isLevelOfType(LT_SHAPE)){
            imgLevelDescriptionGoalAnchor.visible = true;
            imgLevelDescriptionGoalAnchor.x = (game.width >> 1);
            elements.push(imgLevelDescriptionGoalAnchor);

            for(var i = 0; i < 6; i ++){
                imgLevelDescriptionGoal[i].frameName = 'pieces_ico_off.png';
                imgLevelDescriptionGoal[i].tint = 0xFFFFFF;
                if(Levels[selectedLevel].goal[i] != 0){
                    imgLevelDescriptionGoal[i].frameName = 'pieces_ico_color.png';
                    imgLevelDescriptionGoal[i].tint = PIECES_COLORS[Levels[selectedLevel].goal[i]];
                }
            }

            txtLevelDestriptionGoalCount.text = Levels[selectedLevel].count + 'x';
        }

        if(isLevelOfType(LT_TIMER)){
            imgLevelDescriptionIconTime.x = (game.width >> 1);
            imgLevelDescriptionIconTime.visible = true;
            txtLevelDestriptionTime.text = '' + Math.floor(Levels[selectedLevel].time / 1000) + 's';
            elements.push(imgLevelDescriptionIconTime);
        }

        if(isLevelOfType(LT_DISKS_TIMER)){
            imgLevelDescriptionIconDisksTime.x = (game.width >> 1);
            imgLevelDescriptionIconDisksTime.visible = true;
            elements.push(imgLevelDescriptionIconDisksTime);
        }

        var posx = (game.width - (elements.length - 1) * 100) / 2;
        for(var i = 0; i < elements.length; i++){
            elements[i].x = posx;
            posx += 100;
        }

    },

    ShowAnimated: function(delay, ingame)
    {
        if(delay === undefined) delay = 0;
        if(ingame === undefined) ingame = false;

        this.ingameMode = ingame;
        this.updateLevelDesc();

        btnLevelDescriptionQuit.visible = !this.ingameMode;

        this.onResolutionChange();

        soundManager.playMusic('hudba_loop');
        soundManager.playSound('button');

        ScenesTransitions.transitionStarted();

        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
        ScenesTransitions.showSceneAlpha(grpSceneLevelDescription,      delay + 100, ScenesTransitions.TRANSITION_LENGTH);

        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Back.Out;
        ScenesTransitions.showSceneScale(txtLevelDestriptionDesc,       delay + 200, 200, null, Phaser.Easing.Back.Out);
        ScenesTransitions.showSceneScale(btnSceneLevelDescriptionPlay,  delay + 300, 200, ScenesTransitions.transitionFinished, Phaser.Easing.Back.Out);

    },

    HideAnimated: function()
    {
        ScenesTransitions.transitionStarted();

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

        ScenesTransitions.hideSceneAlpha(grpSceneLevelDescription, 0, ScenesTransitions.TRANSITION_LENGTH / 2, ScenesTransitions.transitionFinished);

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
    }

}