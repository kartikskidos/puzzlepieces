var CONTINUE_DURATION = 5000;
var PRICE_SECOND_CHANCE = 30;

var SceneGameFailed = function()
{
    SceneGameFailed.instance = this;

    this.create();
};

SceneGameFailed.instance = null;

SceneGameFailed.prototype = {

    create: function ()
    {
        grpSceneGameFailed = game.add.group(); grpSceneGameFailed.name = 'grpSceneGameFailed';

        txtGameFailedSecondChance = new Phaser.Text(game, (game.width >> 1), (game.height >> 1) - 250, 'NO MORE MOVES', {fill:'#FFFFFF', font: '22px ' + GAME_FONT, align: 'center'});
        txtGameFailedSecondChance.lineSpacing = -8;
        setCorrectAnchor(txtGameFailedSecondChance, 0.5);
        grpSceneGameFailed.addChild(txtGameFailedSecondChance);

        txtGameFailedContinue = new Phaser.Text(game, (game.width >> 1), (game.height >> 1) - 200, 'CONTINUE?', {fill:'#F7945D', font: '55px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameFailedContinue, 0.5);
        grpSceneGameFailed.addChild(txtGameFailedContinue);

        btnGameFailedContinueRing = game.add.sprite((game.width >> 1), (game.height >> 1), 'pak1', 'continue_ring.png');
        btnGameFailedContinueRing.alpha = 0.2;
        btnGameFailedContinueRing.anchor.set(0.5);
        grpSceneGameFailed.add(btnGameFailedContinueRing);

        timerCountDownGroup = game.make.group();
        timerCountDownGroup.x = game.width / 2;
        timerCountDownGroup.y = game.height / 2;
        grpSceneGameFailed.addChild(timerCountDownGroup);

        timeCircle = [];
        var part1 = this.timeCirclePartCreate(90);
        timeCircle.push(timerCountDownGroup.addChild(part1));
        var part2 = this.timeCirclePartCreate(180);
        timeCircle.push(timerCountDownGroup.addChild(part2));
        var part3 = this.timeCirclePartCreate(270);
        timeCircle.push(timerCountDownGroup.addChild(part3));
        var part4 = this.timeCirclePartCreate(0);
        timeCircle.push(timerCountDownGroup.addChild(part4));

        btnGameFailedContinueGems = game.add.sprite((game.width >> 1), (game.height >> 1) - 53, 'pak1', 'bt_accept.png');
        btnGameFailedContinueGems.anchor.set(0.5);
        grpSceneGameFailed.add(btnGameFailedContinueGems);
        AddButtonEvents(btnGameFailedContinueGems, SceneGameFailed.instance.OnPressedContinueGems, ButtonOnInputOver, ButtonOnInputOut);
        txtGameFailedContinueGems = new Phaser.Text(game, 35, 3, '-' + PRICE_SECOND_CHANCE, {fill:'#FFFFFF', font: '27px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameFailedContinueGems, 0.5);
        btnGameFailedContinueGems.addChild(txtGameFailedContinueGems);

        btnGameFailedContinueAd = game.add.sprite((game.width >> 1), (game.height >> 1) + 53, 'pak1', 'bt_accept_ads.png');
        btnGameFailedContinueAd.anchor.set(0.5);
        grpSceneGameFailed.add(btnGameFailedContinueAd);
        AddButtonEvents(btnGameFailedContinueAd, this.OnPressedContinueAd, ButtonOnInputOver, ButtonOnInputOut);
        txtGameFailedContinueAd = new Phaser.Text(game, 35, 3, 'PLAY', {fill:'#FFFFFF', font: '27px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameFailedContinueAd, 0.5);
        btnGameFailedContinueAd.addChild(txtGameFailedContinueAd);

        btnGameFailedQuit = game.add.sprite((game.width >> 1) - 100, (game.height >> 1) + 230, 'pak1', 'levels_bt.png');
        btnGameFailedQuit.anchor.set(0.5);
        grpSceneGameFailed.add(btnGameFailedQuit);
        AddButtonEvents(btnGameFailedQuit, this.OnPressedGameFailedQuit, ButtonOnInputOver, ButtonOnInputOut);

        btnGameFailedRestart = game.add.sprite((game.width >> 1) + 100, (game.height >> 1) + 230, 'pak1', 'restart_bt.png');;
        btnGameFailedRestart.anchor.set(0.5);
        grpSceneGameFailed.add(btnGameFailedRestart);
        AddButtonEvents(btnGameFailedRestart, SceneGameFailed.instance.OnPressedRestart, ButtonOnInputOver, ButtonOnInputOut);

        gameFailedOutOfTime = false;
        grpSceneGameFailed.visible = false;

        this.onResolutionChange();
    },

    timeCirclePartCreate: function (angle)
    {
        var part = game.add.sprite(0, 0, 'pak1', 'continue_ring_part.png');
        part.anchor.set(1);
        part.angle = angle;

        var boardMask = game.add.graphics(0, 0); // fixme toto tu sposobuje zbytocne drawcalls navyse
        boardMask.beginFill(0xFFFFFF, 0.5);
        boardMask.drawRect(-part.width, -part.height, part.width, part.height);
        part.maskChild = part.addChild(boardMask);
        // // function recalcOffset(off) {return Math.floor(off * gameBoardGroup.scale.x);}
        part.mask = boardMask;

        return part
    },

    timeCircleCountDownStart: function (duration)
    {
        SceneGameFailed.instance.timeCircleReset();
        var onePartDuration = Math.floor(duration / 4);

        function addCircleTween(idx){
            var twn = game.add.tween(timeCircle[idx].maskChild).to({angle: 90}, onePartDuration, Phaser.Easing.Linear.None, true, 0);
            if(idx == 3){
                twn.onComplete.add(function(){
                    soundManager.sounds['casovac'].stop();
                    btnGameFailedContinueGems.frameName = 'bt_accept2.png';
                    btnGameFailedContinueGems.inputEnabled = false;

                });
            }else{
                twn.onComplete.add(function(){
                    addCircleTween(this.idx + 1);
                }, {idx : idx});

            }
        }

        addCircleTween(0);
        //musicPlayer.playSound('sndTimer');
    },

    timeCircleReset: function ()
    {
        btnGameFailedContinueGems.frameName = 'bt_accept.png';
        btnGameFailedContinueGems.inputEnabled = true;

        for (var i = 0; i < 4; i++){
            timeCircle[i].maskChild.angle = 0;
            removeObjectTweens(timeCircle[i].maskChild);
        }
    },

    onResolutionChange: function()
    {
        txtGameFailedSecondChance.position.setTo((game.width >> 1), (game.height >> 1) - 250);
        txtGameFailedContinue.position.setTo((game.width >> 1), (game.height >> 1) - 200);
        btnGameFailedContinueRing.position.setTo((game.width >> 1), (game.height >> 1));
        timerCountDownGroup.position.setTo((game.width >> 1), (game.height >> 1));

        if(ADS_ENABLED){
            btnGameFailedContinueAd.alpha = 1;
            btnGameFailedContinueAd.inputEnabled = true;
            btnGameFailedContinueGems.position.setTo((game.width >> 1), (game.height >> 1) - 53);
            btnGameFailedContinueAd.position.setTo((game.width >> 1), (game.height >> 1) + 53);
        }else{
            btnGameFailedContinueAd.alpha = 0;
            btnGameFailedContinueAd.inputEnabled = false;
            btnGameFailedContinueGems.position.setTo((game.width >> 1), (game.height >> 1));
        }

        btnGameFailedQuit.position.setTo((game.width >> 1) - 110, (game.height >> 1) + 220);
        btnGameFailedRestart.position.setTo((game.width >> 1) + 110, (game.height >> 1) + 220);;
    },

    updateTexts: function()
    {
        txtGameFailedSecondChance.text = STR('OUF_OF_MOVES');
        if(gameFailedOutOfTime)
            txtGameFailedSecondChance.text = STR('OUF_OF_TIME');

        txtGameFailedContinue.text = STR('CONTINUE_QUESTION');
    },

    OnPressedContinueGems: function()
    {
        soundManager.playSound('button');

        if(PlayerGems < PRICE_SECOND_CHANCE){
            SetPoingScaleTween(imgGemsBG, 100, 0, null, Phaser.Easing.Back.Out);
            return;
        }

        SceneGems.instance.incPlayerGems(-PRICE_SECOND_CHANCE);

        SceneGameFailed.instance.SecondChance();
        SceneGameFailed.instance.HideAnimated();
        SceneOverlay.instance.HideAnimated();

        gameRunning = true;
        gamePaused = false;
    },

    SecondChance: function()
    {
        if(isLevelOfType(LT_TIMER)){
            if(levelTime <= 0){
                levelTime += Math.floor(LEVEL_TIME_SECOND_CHANCE);
                if(levelTime > selectedLevelData.time)
                    levelTime = selectedLevelData.time;
            }else{
                nextMovePrepared = false;

                SceneGame.instance.generateValidMoves();
                SceneGame.instance.prepareNextMove();
            }
        }else{
            nextMovePrepared = false;

            SceneGame.instance.generateValidMoves();
            SceneGame.instance.prepareNextMove();
        }
    },

    OnPressedContinueAd: function()
    {
        soundManager.playSound('button');

        ads_time = -ADS_DELAY;
        adinplay_onAdStarted = function(){
            game.paused = false;

            SceneGameFailed.instance.SecondChance();
            SceneGameFailed.instance.HideAnimated();
            SceneOverlay.instance.HideAnimated();

            gameRunning = true;
            gamePaused = false;

        }.bind(this);
        adinplay_onAdFinished = function() {};
        adinplay_playVideoAd();

    },

    OnPressedRestart: function()
    {
        soundManager.playSound('button');

        SceneGameFailed.instance.HideAnimated();
        SceneOverlay.instance.HideAnimated();

        onGameOver(GAME_OVER_GAME);

        SceneGame.instance.RestartGame();
    },

    OnPressedGameFailedQuit: function()
    {
        soundManager.playSound('button');

        SceneOverlay.instance.HideAnimated();
        SceneGameFailed.instance.HideAnimated();
        SceneGame.instance.HideAnimated();
        SceneLevelSelection.instance.ShowAnimated();

        onGameOver(GAME_OVER_GAME);

        //PPS_USE-GAME_DISTRIBUTION
        /*
        if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
            gdsdk.showAd();
        }
        //PPS_USE-GAME_DISTRIBUTION
        */
    },

    ShowAnimated: function(timeOut)
    {
        soundManager.playSound('casovac');

        if(timeOut === undefined)
            timeOut = false;

        delay = 0;

        gameFailedOutOfTime = timeOut;

        this.updateTexts();
        this.onResolutionChange();


        soundManager.playMusic('hudba_loop');
        soundManager.playSound('button');

        ScenesTransitions.transitionStarted();

        //ScenesTransitions.showSceneAlpha(grpSceneOverlay);
        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Back.Out;
        ScenesTransitions.showSceneAlpha(grpSceneGameFailed);
        ScenesTransitions.showSceneScale(txtGameFailedSecondChance,  delay +   0, 200);
        ScenesTransitions.showSceneScale(txtGameFailedContinue,      delay + 100, 200);
        ScenesTransitions.showSceneScale(btnGameFailedContinueRing,  delay + 200, 200);
        ScenesTransitions.showSceneScale(btnGameFailedContinueGems,  delay + 300, 200);
        ScenesTransitions.showSceneScale(btnGameFailedContinueAd,    delay + 400, 200);
        ScenesTransitions.showSceneScale(btnGameFailedQuit,          delay + 500, 200);
        ScenesTransitions.showSceneScale(btnGameFailedRestart,       delay + 600, 200, function (){

            //PPS_DELETE-STROER
            ScenesTransitions.transitionFinished();
            this.timeCircleCountDownStart(CONTINUE_DURATION);
            //PPS_DELETE-STROER

            //PPS_USE-STROER
            /*
            game.time.events.add(500, function () {
                adinplay_onAdStarted = function(){
                    game.paused = false;

                    ScenesTransitions.transitionFinished();
                    this.timeCircleCountDownStart(CONTINUE_DURATION);
                }.bind(this);
                adinplay_onAdFinished = function() {};
                adinplay_playVideoAd();
            }, this);
            //PPS_USE-STROER
            */

        }.bind(this));


        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
    },

    HideAnimated: function()
    {
        soundManager.sounds['casovac'].stop();
        SceneGameFailed.instance.timeCircleReset();

        ScenesTransitions.transitionStarted();

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

        ScenesTransitions.hideSceneAlpha(grpSceneGameFailed, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

        ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
    }

}