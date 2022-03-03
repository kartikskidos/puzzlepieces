
var DISK_TIME   = 15000;

var gameRunning = false;
var gamePaused  = false;

var SceneGame = function()
{
    SceneGame.instance = this;

    this.create();
};

SceneGame.instance = null;

SceneGame.prototype = {

    //#region SCENES STUFF

    create: function ()
    {
        grpSceneGame = game.add.group();

        imgGameGoalAnchor = grpSceneGame.create(game.width / 2, 55, 'pak1', 'blank.png');
        setCorrectAnchor(imgGameGoalAnchor , 0.5);

        txtGameScoreVal = new Phaser.Text(game, 0, 0, '120', {fill:'#f8aa7c', font: '45px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameScoreVal, 0.5);
        imgGameGoalAnchor.addChild(txtGameScoreVal);

        txtGameScoreValPoints = new Phaser.Text(game, 0, 23, 'pts.', {fill:'#f8aa7c', font: '13px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameScoreValPoints, 0.5);
        txtGameScoreVal.addChild(txtGameScoreValPoints);

        imgGameGoalSlices = [];

        for(var i = 0; i < 6; i++){
            imgGameGoalSlices[i] = grpSceneGame.create(0, 0, 'pak1', 'pieces_ico_off.png');
            imgGameGoalSlices[i].anchor.setTo(1, 0.5);
            imgGameGoalSlices[i].angle = i * 60;
            imgGameGoalAnchor.addChild(imgGameGoalSlices[i]);
        }
        radialTimerGoal = this.createRadialTimer();
        radialTimerGoal.position.setTo(0, 0);
        imgGameGoalAnchor.addChild(radialTimerGoal);

        txtGameGoalCount = new Phaser.Text(game, - 48, 0, '1x', {fill:'#F67B3D', font: '20px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameGoalCount, 0.5);
        imgGameGoalAnchor.addChild(txtGameGoalCount);

        btnGamePause = grpSceneGame.create(TOP_ICONS_BORDER, TOP_ICONS_BORDER, 'pak1', 'icons_5.png');
        btnGamePause.anchor.set(0.5);
        AddButtonEvents(btnGamePause, this.OnPressedFromGameToPause, ButtonOnInputOver, ButtonOnInputOut);

        this.createGameDisks();

        radialProgressBar = this.createRadialTimer();
        this.updateRadialTimer(radialProgressBar);

        grpSceneGame.visible = false;

        this.onResolutionChange();
        this.updateTexts();

        gameRunning = false;

    },

    createRadialTimer: function()
    {
        var radialTimer = game.add.graphics(0, 0);
        radialTimer.angle = -90;
        radialTimer.lineStyle(10, 0xff0000);
        radialTimer.value = 0;
        radialTimer.max_value = 2000;
        //add the angle change as a tween
        grpSceneGame.add(radialTimer);

        return radialTimer;
    },

    updateRadialTimer: function(timer, radius, lineWidth)
    {
        var progress = timer.value / timer.max_value;

        var colors = [[255, 47, 0], [255, 106, 0], [0, 194, 14]]

        var color = colors[0];

        var timerMax2 = timer.max_value / 2;
        if(timer.value > timerMax2)
            color = Phaser.Color.interpolateRGB(colors[1][0], colors[1][1], colors[1][2], colors[2][0], colors[2][1], colors[2][2], timerMax2, timer.value - timerMax2);
        else
            color = Phaser.Color.interpolateRGB(colors[0][0], colors[0][1], colors[0][2], colors[1][0], colors[1][1], colors[1][2], timerMax2, timer.value);

        //while circle not full (not done loading/not reached spawn time/not repaired fully)
        timer.clear();
        timer.lineStyle(lineWidth, color);

        var angle = 360 * progress;

        //(cx, cy, radius, startAngle, endAngle, anticlockwise, segments)
        timer.arc(0, 0, radius, 0, game.math.degToRad(angle), false);
        timer.endFill();
        //radialProgressBar.arc(0, 0, 135, 0, game.math.degToRad(angle.max), false);
    },

    onResolutionChange: function()
    {
        btnGamePause.position.setTo(TOP_ICONS_BORDER, game.height - TOP_ICONS_BORDER);

        imgGamePlayerDiskBg.position.setTo(game.width / 2, game.height / 2);
        imgGamePlayerDiskBg.updateTransform();

        while(btnGameBonusLeft.worldPosition.y - imgGameGoalAnchor.worldPosition.y < 80){
            imgGamePlayerDiskBg.y += 10;
            imgGamePlayerDiskBg.updateTransform();
        }
    },

    updateTexts: function()
    {
        txtGameComingUp.text = STR('NEXT');
    },

    update: function()
    {
        particles.Update();
        textParticles.Update();

        if(!gameRunning)
            return

        this.updateScore();
        this.updateTimerVal();
        this.updateLevelGoals();
        this.updateRadialTimers();

        imgGamePlayHand.y = imgGamePlayHand.orgY + imgGamePlayHand.offs;
    },

    updateRadialTimers: function ()
    {
        if(!isLevelOfType(LT_DISKS_TIMER))
            return;

        for(var i = 0; i < imgGamePlayDiskBg.length; i++){
            if(imgGamePlayDiskBg[i].radialTimer.value <= 0)
                continue;

            imgGamePlayDiskBg[i].radialTimer.value -= game.time.elapsedMS;
            if(imgGamePlayDiskBg[i].radialTimer.value <= 0){
                if(MovingPlayerDisk){
                    imgGamePlayDiskBg[i].radialTimer.value += game.time.elapsedMS;
                    continue;
                }
                imgGamePlayDiskBg[i].radialTimer.value = 0;
                SceneGame.instance.updateRadialTimer(imgGamePlayDiskBg[i].radialTimer, 77, 8);
                SceneGame.instance.explodePlayDisk(imgGamePlayDiskBg[i], true);
            }

            this.updateRadialTimer(imgGamePlayDiskBg[i].radialTimer, 77, 8);
        }

    },

    updateLevelGoals: function()
    {
        if(!isLevelOfType(LT_SHAPE)){
            for(var i = 0; i < imgGameGoalSlices.length; i++)
                imgGameGoalSlices[i].visible = false;
            txtGameGoalCount.visible = false;
            return;
        }

        for(var i = 0; i < 6; i++){
            imgGameGoalSlices[i].visible = true;
            imgGameGoalSlices[i].frameName = 'pieces_ico_off.png';
            imgGameGoalSlices[i].tint = 0xFFFFFF;

            if(selectedLevelData.goal[i] != 0){
                imgGameGoalSlices[i].frameName = 'pieces_ico_color.png';
                imgGameGoalSlices[i].tint = PIECES_COLORS[selectedLevelData.goal[i]];
            }
        }
        txtGameGoalCount.visible = true;

        txtGameGoalCount.text = goalCount + 'x';
    },

    ShowAnimated: function()
    {
        ScenesTransitions.transitionStarted();
        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
        ScenesTransitions.showSceneAlpha(grpSceneGame, 0, ScenesTransitions.TRANSITION_LENGTH + 10, ScenesTransitions.transitionFinished);
    },

    HideAnimated: function()
    {
        ScenesTransitions.transitionStarted();
        ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.Out;
        ScenesTransitions.hideSceneAlpha(grpSceneGame, 0, ScenesTransitions.TRANSITION_LENGTH + 10);
    },

    //endregion SCENES STUFF

    //#region UI STUFF

    generateMoves: function()
    {
        var selectedLevelData = Levels[selectedLevel];
        var entireDisks  = 5;
        var maxSize      = 2;
        var mixColorPerc = 10;
        var prevColor    = 1;
        var maxGoalCols  = 1;
        var levelCols    = [];

        if(selectedLevelData.hasOwnProperty('entireDisks'))
            entireDisks = selectedLevelData.entireDisks;
        if(selectedLevelData.hasOwnProperty('maxSize'))
            entireDisks = selectedLevelData.maxSize;
        if(selectedLevelData.hasOwnProperty('mixColorPerc'))
            mixColorPerc = selectedLevelData.mixColorPerc;
        if(selectedLevelData.hasOwnProperty('color'))
            prevColor = selectedLevelData.color;
        if(selectedLevelData.hasOwnProperty('goal')){
            for(var i = 0; i < selectedLevelData.goal.length; i++){
                if(selectedLevelData.goal[i] == 0)
                    continue;
                if(levelCols.indexOf(selectedLevelData.goal[i]) != -1)
                    continue;
                levelCols.push(selectedLevelData.goal[i]);
            }
            maxGoalCols = levelCols.length;
        }

        if(selectedLevelData.hasOwnProperty('goal')){
            var idx = 0;
            do{
                prevColor = selectedLevelData.goal[idx];
                idx++;
            }
            while(prevColor == 0);
        }

        var pool = [];
        for(var i = 0; i < entireDisks; i++){
            var diskPart = [0, 0, 0, 0, 0, 0];
            var size = getRandomUInt(maxSize) + 1;

            for(var j = 0; j < 6; j++){
                var newColor = 1;
                if(selectedLevelData.hasOwnProperty('color'))
                    newColor = selectedLevelData.color;
                if(selectedLevelData.hasOwnProperty('goal'))
                    newColor = selectedLevelData.goal[j];

                if(prevColor != newColor){
                    prevColor = newColor;
                    if(getCountOfNumberInArray(diskPart, 0) < 6)
                        pool.push(diskPart);
                    diskPart = [0, 0, 0, 0, 0, 0];
                    size = getRandomUInt(maxSize) + 1;
                }

                if(selectedLevelData.hasOwnProperty('goal') && (maxGoalCols == 1)){
                    if(newColor == 0){
                        var tmp = getRandomUInt(100);
                        if(tmp <= mixColorPerc){
                            newColor = levelCols[0];
                        }
                    }
                }

                diskPart[j] = newColor;
                size --;
                if((size > 0) && (j < 5))
                    continue;

                prevColor = newColor;
                if(getCountOfNumberInArray(diskPart, 0) < 6)
                    pool.push(diskPart);
                diskPart = [0, 0, 0, 0, 0, 0];
                size = getRandomUInt(maxSize) + 1;
            }
        }

        if(selectedLevelData.hasOwnProperty('goal')){
            var availColors = [];
            var colorsPools = [];

            for(var i = 0; i < PIECES_COLORS.length; i++){
                colorsPools[i] = [];
                for(var j = 0; j < pool.length; j ++){
                    var col = getFirstOtherNumberFromArray(pool[j], 0);
                    if(col == i){
                        if(availColors.indexOf(col) == -1)
                            availColors.push(col);
                        colorsPools[i].push(pool[j]);
                    }
                }
            }

            if(availColors.length > 1){
                for(var i = 0; i < PIECES_COLORS.length; i++) {
                    if(colorsPools[i].length == 0)
                        continue;

                    var cntToMix = Math.ceil(colorsPools[i].length / 100 * mixColorPerc);
                    for(var j = 0; j < cntToMix; j++){
                        var newCol = selectRandomOtherNum(availColors, i);
                        setAllNonZeroNumbers(colorsPools[i][j], newCol);
                    }
                }
            }

            pool = [];

            for(var i = 0; i < PIECES_COLORS.length; i++)
            {
                if (colorsPools[i].length == 0)
                    continue;
                for (var j = 0; j < colorsPools[i].length; j++)
                    pool.push(colorsPools[i][j]);
            }
        }

        pool = shuffleArray(pool);
        pool = shuffleArray(pool);
        return pool;
    },

    generateValidMoves: function()
    {
        var moves = [];

        for(var i = 0; i < imgGamePlayDiskBg.length; i++){
            for(var j = 0; j < imgGamePlayDiskBg[i].imgSlices.length; j++){
                if(imgGamePlayDiskBg[i].imgSlices[j].visible)
                    continue;

                var move = [0, 0, 0, 0, 0, 0];

                var newColor = 1;
                if(selectedLevelData.hasOwnProperty('color'))
                    newColor = selectedLevelData.color;

                move[j] = newColor;

                if(!arrayExistsInArray(moves, move))
                    moves.push(move);
            }
        }

        moves = shuffleArray(moves);
        moves = shuffleArray(moves);

        var limit = 3;
        while(moves.length < limit)
            limit --;

        for(var i = 0; i < limit; i ++){
            GeneratedMoves.unshift(moves[i]);
        }
    },

    prepareNextMove: function ()
    {
        //LOG('!!!prepareNextMove()');
        //console.trace();

        if(nextMovePrepared)
            return;

        if(GeneratedMoves.length < 2)
            GeneratedMoves = GeneratedMoves.concat(SceneGame.instance.generateMoves());

        for(var i = 0; i < imgGamePlayerDiskBg.imgSlices.length; i++)
            imgGamePlayerDiskBg.imgSlices[i].visible = false;

        var move = GeneratedMoves[0];
        GeneratedMoves.splice(0, 1);

        for(var i = 0; i < 6; i++){
            imgGamePlayerDiskBg.imgSlices[i].tint = 0xFFFFFF;
            imgGamePlayerDiskBg.imgSlices[i].visible = false;
            if(move[i] != 0){
                imgGamePlayerDiskBg.imgSlices[i].alpha = 1;
                imgGamePlayerDiskBg.imgSlices[i].visible = true;
                imgGamePlayerDiskBg.imgSlices[i].piece = move[i];
                if(move[i] > 10)
                {
                    imgGamePlayerDiskBg.imgSlices[i].frameName = (move[i] - 10) + 'a.png';
                    imgGamePlayerDiskBg.imgSlices[i].tint = 0xFFFFFF;
                }else{
                    imgGamePlayerDiskBg.imgSlices[i].frameName = 'color.png';
                    imgGamePlayerDiskBg.imgSlices[i].tint = PIECES_COLORS[move[i]];
                }
            }
        }

        var move = GeneratedMoves[0];
        for(var i = 0; i < imgGameComingUpSlices.length; i++){
            imgGameComingUpSlices[i].frameName = 'pieces_ico_off.png';
            imgGameComingUpSlices[i].tint = 0xFFFFFF;
            if(move[i] != 0){
                if(move[i] > 10){
                    imgGameComingUpSlices[i].frameName = 'pieces_ico_on.png';
                    imgGameComingUpSlices[i].tint = 0xFFFFFF;
                }else{
                    imgGameComingUpSlices[i].frameName = 'pieces_ico_color.png';
                    imgGameComingUpSlices[i].tint = PIECES_COLORS[move[i]];
                }
            }
        }

        SceneGame.instance.UpdateBoosterIcons();

        if(!SceneGame.instance.canPlacePlayerDiskOnAnyPlayDisk())
            SceneGame.instance.LevelFailed();

        nextMovePrepared = true;
    },

    updateTimerVal: function()
    {
        radialTimerGoal.visible = false;

        if(isLevelOfType(LT_TIMER)){
            radialTimerGoal.visible = true;

            levelTime -= game.time.elapsedMS;

            if(levelTime < 0){
                levelTime = 0;
                SceneGame.instance.LevelFailed(true);
            }

            radialTimerGoal.value = levelTime;
            this.updateRadialTimer(radialTimerGoal, 35, 8);
        }
    },

    updateScore: function()
    {
        if(!isLevelOfType(LT_SCORE)){
            txtGameScoreVal.visible = false;
            return;
        }

        txtGameScoreVal.visible = true;

        if(LevelScore != DestLevelScore){
            LevelScore += LevelScoreInc;
            if(LevelScore > DestLevelScore) {
                LevelScore = DestLevelScore;

                //PPS_USE-ARKADIUM
                /*
                var scoreLefta = (selectedLevelData.score - Math.floor(LevelScore));
                if(scoreLefta < 0) scoreLefta = 0;
                ARK_game_arena_connector.changeScore(scoreLefta, ""); // submit user score
                //PPS_USE-ARKADIUM
                */
            }
        }

        var scoreLeft = (selectedLevelData.score - Math.floor(LevelScore));
        if(scoreLeft < 0) scoreLeft = 0;
        txtGameScoreVal.text = '' + scoreLeft;

        if(LevelScore >= selectedLevelData.score)
            SceneGame.instance.LevelCleared();
    },

    createGameDisks: function()
    {
        imgGamePlayerDiskBg = grpSceneGame.create(game.width / 2, game.height / 2, 'pak1', 'play_bg.png');
        imgGamePlayerDiskBg.anchor.set(0.5);

        SceneGame.instance.createBoosterButtons();
        SceneGame.instance.createComingUpSlices();
        SceneGame.instance.createGamePlayOverlay();
        SceneGame.instance.createGamePlayDisks();
        SceneGame.instance.createPlayerDiskSlices();
        SceneGame.instance.createGoalDisk();
    },

    createComingUpSlices: function()
    {
        imgGameComingUpSlices = [];

        for(var i = 0; i < 6; i++){
            imgGameComingUpSlices[i] = grpSceneGame.create(-150, -225, 'pak1', 'pieces_ico_off.png');
            imgGameComingUpSlices[i].anchor.setTo(1, 0.5);
            imgGameComingUpSlices[i].angle = i * 60;
            imgGamePlayerDiskBg.addChild(imgGameComingUpSlices[i]);
        }

        txtGameComingUp = new Phaser.Text(game, -150, -270, 'COMING UP', {fill:'#F67B3D', font: '13px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameComingUp, 0.5);
        imgGamePlayerDiskBg.addChild(txtGameComingUp);

    },

    createGamePlayOverlay: function()
    {
        imgGamePlayOverlay = grpSceneGame.create(0, 0, 'pak1', 'blank.png');
        imgGamePlayOverlay.alpha = 0.6;
        imgGamePlayOverlay.tint = 0x000000;
        imgGamePlayOverlay.anchor.set(0.5);
        imgGamePlayOverlay.width = game.width * 1.1;
        imgGamePlayOverlay.inputEnabled = true;

        AddButtonEvents(imgGamePlayOverlay, function(){
            if(OnboardingActive){
                imgGamePlayOverlay.tint = 0x000000;
                return;
            }

            SelectingDiskForHammer = false;

            for(var i = 0; i < imgGamePlayDiskBg.length; i++)
                imgGamePlayDiskBg[i].alpha = 1;
            for(var i = 0; i < imgGamePlayerDiskBg.imgSlices.length; i++)
                imgGamePlayerDiskBg.imgSlices[i].alpha = 1;

            ScenesTransitions.hideSceneAlpha(imgGamePlayOverlay);
        }, function () {}, function () {});

        imgGamePlayOverlay.height = game_resolution.yMax * 1.1;
        imgGamePlayerDiskBg.addChild(imgGamePlayOverlay);
    },

    createGamePlayDisks: function()
    {
        imgGamePlayDiskBg = [];

        var tmpCircle = new Phaser.Circle(0, 0, 350);
        for(var i = 0; i < 6; i++){
            var tmpPoint = Phaser.Circle.circumferencePoint(tmpCircle, 90 + 60 * i, true);
            imgGamePlayDiskBg[i] = grpSceneGame.create(tmpPoint.x, tmpPoint.y, 'pak1', 'pieces_bg.png');
            imgGamePlayDiskBg[i].idx = i;
            imgGamePlayDiskBg[i].anchor.set(0.5);
            setCorrectAnchor(imgGamePlayDiskBg[i], 0.5);
            imgGamePlayerDiskBg.addChild(imgGamePlayDiskBg[i]);

            imgGamePlayDiskBg[i].radialTimer = this.createRadialTimer();
            imgGamePlayDiskBg[i].addChild(imgGamePlayDiskBg[i].radialTimer);
            SceneGame.instance.updateRadialTimer(imgGamePlayDiskBg[i].radialTimer);

            AddButtonEvents(imgGamePlayDiskBg[i], this.OnPressedPlayDisk, function(){}, function(){});
            //imgGamePlayDiskBg[i].input.pixelPerfectClick = true;

            imgGamePlayDiskBg[i].imgSlices = [];

            for(var j = 0; j < 6; j++){
                imgGamePlayDiskBg[i].imgSlices[j] = grpSceneGame.create(0, 0, 'pak1', 'color.png');
                imgGamePlayDiskBg[i].imgSlices[j].anchor.x = getCorrectAnchorX(imgGamePlayDiskBg[i].imgSlices[j], 1);
                imgGamePlayDiskBg[i].imgSlices[j].anchor.y = getCorrectAnchorX(imgGamePlayDiskBg[i].imgSlices[j], 0.5);
                imgGamePlayDiskBg[i].imgSlices[j].angle = j * 60;
                imgGamePlayDiskBg[i].addChild(imgGamePlayDiskBg[i].imgSlices[j]);
            }

            imgGamePlayDiskBg[i].warning = grpSceneGame.create(0, 0, 'pak1', 'eclipse.png');
            imgGamePlayDiskBg[i].warning.alpha = 1;
            imgGamePlayDiskBg[i].warning.alpha = 0;
            imgGamePlayDiskBg[i].warning.tint = 0xF8AA7C;
            imgGamePlayDiskBg[i].warning.scale.set(1);
            imgGamePlayDiskBg[i].warning.anchor.set(0.5);
            imgGamePlayDiskBg[i].addChild(imgGamePlayDiskBg[i].warning);

        }

        imgGamePlayHand = grpSceneGame.create(0, 0, 'pak1', 'hand.png');
        imgGamePlayHand.pivot.x = 31;
        imgGamePlayHand.pivot.y = 14;
        imgGamePlayHand.visible = false;
        imgGamePlayHand.orgY = 0;
        imgGamePlayHand.offs = 0;
        imgGamePlayHand.tween = game.add.tween(imgGamePlayHand).to({offs: 10}, 400 / getCpuSpeedMul(), Phaser.Easing.Linear.In, true, 0, -1, true);

        imgGamePlayDiskBg[0].addChild(imgGamePlayHand);
    },

    createGoalDisk: function()
    {
        imgGameGoalDiskBg = grpSceneGame.create(game.width / 2, game.height / 2, 'pak1', 'void.png');
        imgGameGoalDiskBg.anchor.set(0.5);
        imgGameGoalDiskBg.visible = false;

        Object.defineProperty(imgGameGoalDiskBg, 'scl', {
            set: function(val) { this.scale.set(val); },
            get: function() { return this.scale.x; }
        });

        imgGameGoalDiskBg.imgSlices = [];

        for(var i = 0; i < 6; i++){
            imgGameGoalDiskBg.imgSlices[i] = grpSceneGame.create(0, 0, 'pak1', 'color.png');
            imgGameGoalDiskBg.imgSlices[i].anchor.setTo(1, 0.5);
            imgGameGoalDiskBg.imgSlices[i].angle = i * 60;
            imgGameGoalDiskBg.addChild(imgGameGoalDiskBg.imgSlices[i]);
        }
    },

    createPlayerDiskSlices: function()
    {
        imgGamePlayerDiskBg.imgSlices = [];

        for(var i = 0; i < 6; i++){
            imgGamePlayerDiskBg.imgSlices[i] = grpSceneGame.create(0, 0, 'pak1', 'color.png');
            imgGamePlayerDiskBg.imgSlices[i].anchor.setTo(1, 0.5);
            imgGamePlayerDiskBg.imgSlices[i].angle = i * 60;
            imgGamePlayerDiskBg.addChild(imgGamePlayerDiskBg.imgSlices[i]);
        }
    },

    createBoosterButtons: function()
    {
        btnGameBonusLeft = grpSceneGame.create(-150, 225, 'pak1', 'bt_ham_on.png');
        btnGameBonusLeft.anchor.setTo(0.5, 0.5);
        btnGameBonusLeft.price = PRICE_BOOSTER_HAMMER;
        AddButtonEvents(btnGameBonusLeft, this.OnPressedBonusLeft, ButtonOnInputOver, ButtonOnInputOut);
        imgGamePlayerDiskBg.addChild(btnGameBonusLeft);

        txtGameBonusLeftPrice = new Phaser.Text(game, 0, 60, '' + PRICE_BOOSTER_HAMMER, {fill:'#b3b3b3', font: '18px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameBonusLeftPrice, 0.5);
        txtGameBonusLeftPrice.x = getCorrectAnchorX(txtGameBonusLeftPrice, 0.7);
        btnGameBonusLeft.addChild(txtGameBonusLeftPrice);

        icnGameBonusLeftPrice = grpSceneGame.create(9, -3, 'pak1', 'icons_11.png');
        icnGameBonusLeftPrice.scale.set(0.4);
        icnGameBonusLeftPrice.anchor.x = 0;
        icnGameBonusLeftPrice.anchor.y = getCorrectAnchorY(icnGameBonusLeftPrice, 0.5);
        txtGameBonusLeftPrice.addChild(icnGameBonusLeftPrice);

        btnGameBonusRight = grpSceneGame.create(150, 225, 'pak1', 'bt_fwd_on.png');
        btnGameBonusRight.anchor.setTo(0.5, 0.5);
        btnGameBonusRight.price = PRICE_BOOSTER_FWD;
        AddButtonEvents(btnGameBonusRight, this.OnPressedBonusRight, ButtonOnInputOver, ButtonOnInputOut);
        imgGamePlayerDiskBg.addChild(btnGameBonusRight);

        txtGameBonusRightPrice = new Phaser.Text(game, 0, 60, '' + PRICE_BOOSTER_FWD, {fill:'#b3b3b3', font: '18px ' + GAME_FONT, align: 'center'});
        setCorrectAnchor(txtGameBonusRightPrice, 0.5);
        txtGameBonusRightPrice.x = getCorrectAnchorX(txtGameBonusRightPrice, 0.7);
        btnGameBonusRight.addChild(txtGameBonusRightPrice);

        icnGameBonusRightPrice = grpSceneGame.create(9, -3, 'pak1', 'icons_11.png');
        icnGameBonusRightPrice.scale.set(0.4);
        icnGameBonusRightPrice.anchor.x = 0;
        icnGameBonusRightPrice.anchor.y = getCorrectAnchorY(icnGameBonusRightPrice, 0.5);
        txtGameBonusRightPrice.addChild(icnGameBonusRightPrice);
    },

    canPlacePlayerDiskOnPlayDisk: function(playDisk)
    {
        for(var i = 0; i < imgGamePlayerDiskBg.imgSlices.length; i++)
        {
            if(imgGamePlayerDiskBg.imgSlices[i].visible && playDisk.imgSlices[i].visible)
                return false;
        }

        return true;
    },

    canPlacePlayerDiskOnAnyPlayDisk: function()
    {
        for(var i = 0; i < imgGamePlayDiskBg.length; i++){
            if(this.canPlacePlayerDiskOnPlayDisk(imgGamePlayDiskBg[i]))
                return true;
        }

        return false;
    },

    movePlayerSlicesToPlayDisk: function(playDisk)
    {
        if(MovingPlayerDisk)
            return;
        if(!this.canPlacePlayerDiskOnPlayDisk(playDisk)){
            playDisk.warning.alpha = 0;

            var duration = 300 / getCpuSpeedMul();
            var easing = Phaser.Easing.Quintic.Out;
            //(properties, duration, ease, autoStart, delay, repeat, yoyo)
            var twn = game.add.tween(playDisk.warning).to({alpha: 1}, duration, easing, true, 0, 0, true);
            return;
        }

        MovingPlayerDisk = true;

        var dest = playDisk.position;
        var duration = 500 / getCpuSpeedMul();
        var easing = Phaser.Easing.Quintic.Out;

        for(var i = 0; i < imgGamePlayerDiskBg.imgSlices.length; i++){
            //(properties, duration, ease, autoStart, delay, repeat, yoyo)
            var twn = game.add.tween(imgGamePlayerDiskBg.imgSlices[i].position).to({x: dest.x, y: dest.y}, duration, easing, true, 0);
            if(i == imgGamePlayerDiskBg.imgSlices.length - 1){
                twn.onComplete.addOnce(function(){
                    for(var i = 0; i < imgGamePlayerDiskBg.imgSlices.length; i++){
                        imgGamePlayerDiskBg.imgSlices[i].position.setTo(0, 0);
                        if(imgGamePlayerDiskBg.imgSlices[i].visible){
                            this.playDisk.imgSlices[i].visible = true;
                            this.playDisk.imgSlices[i].tint = imgGamePlayerDiskBg.imgSlices[i].tint;
                            this.playDisk.imgSlices[i].piece = imgGamePlayerDiskBg.imgSlices[i].piece;
                            this.playDisk.imgSlices[i].frameName = imgGamePlayerDiskBg.imgSlices[i].frameName;
                        }
                        imgGamePlayerDiskBg.imgSlices[i].visible = false;
                    }

                    if(isLevelOfType(LT_DISKS_TIMER)){
                        if(this.playDisk.radialTimer.value <= 0)
                            this.playDisk.radialTimer.value = this.playDisk.radialTimer.max_value;
                    }

                    nextMovePrepared = false;

                    SceneGame.instance.destroyPlayDisk(playDisk);

                    MovingPlayerDisk = false;


                }, { playDisk: playDisk})
            }
        }

        soundManager.playSound('karta_tah');
    },

    isLevelShapeCompleted: function(playDisk)
    {
        if(!isLevelOfType(LT_SHAPE))
            return false;

        for(var i = 0; i < playDisk.imgSlices.length; i++){
            var slice = playDisk.imgSlices[i].visible ? playDisk.imgSlices[i].piece : 0;
            if(selectedLevelData.goal[i] != slice)
                return false;
        }

        return true;
    },

    LevelShapeCompleted: function()
    {
        soundManager.playSound('nakup');

        goalCount--;
        txtGameGoalCount.text = goalCount + 'x';
        SetPoingScaleTween(txtGameGoalCount, 150);

        if(goalCount == 0)
            SceneGame.instance.LevelCleared();
    },

    isDiskFull: function(playDisk)
    {
        for(var i = 0; i < playDisk.imgSlices.length; i++){
            if(!playDisk.imgSlices[i].visible)
                return false;
        }
        return true;
    },

    isDiskEmpty: function(playDisk)
    {
        for(var i = 0; i < playDisk.imgSlices.length; i++){
            if(playDisk.imgSlices[i].visible)
                return false;
        }
        return true;
    },

    destroyPlayDisk: function(playDisk)
    {
        if(!this.isDiskFull(playDisk)){

            if(!isLevelOfType(LT_SHAPE)) {
                SceneGame.instance.prepareNextMove();
                return;
            }

            if(!SceneGame.instance.isLevelShapeCompleted(playDisk)){
                SceneGame.instance.prepareNextMove();
                return;
            }
        }

        //if(!isLevelOfType(LT_SHAPE)){
        this.destroyPrevPlayDisk(playDisk, true);
        this.destroyNextPlayDisk(playDisk, true);

        this.explodePlayDisk(playDisk);

    },

    destroyPrevPlayDisk: function(playDisk, forceExplode)
    {
        if(forceExplode === undefined)
            forceExplode = false;

        var idx = playDisk.idx - 1;
        if(idx < 0) idx = imgGamePlayDiskBg.length - 1;
        playDisk = imgGamePlayDiskBg[idx];

        if(this.isDiskEmpty(playDisk))
            return;

        this.explodePlayDisk(playDisk, forceExplode);
    },

    destroyNextPlayDisk: function(playDisk, forceExplode)
    {
        if(forceExplode === undefined)
            forceExplode = false;

        var idx = playDisk.idx + 1;
        if(idx > imgGamePlayDiskBg.length - 1) idx = 0;
        playDisk = imgGamePlayDiskBg[idx];

        if(this.isDiskEmpty(playDisk))
            return;

        this.explodePlayDisk(playDisk, forceExplode);
    },

    movePlayDiskToGoal: function(playDisk)
    {
        var dest = { x: imgGameGoalAnchor.worldPosition.x, y: imgGameGoalAnchor.worldPosition.y };
        var duration = 600 / getCpuSpeedMul();
        var easing = Phaser.Easing.Cubic.Out;
        var cnt = 0;

        imgGameGoalDiskBg.visible = true;
        imgGameGoalDiskBg.alpha = 1;
        imgGameGoalDiskBg.scl = 1;

        imgGameGoalDiskBg.position.setTo(playDisk.worldPosition.x, playDisk.worldPosition.y);
        imgGameGoalDiskBg.updateTransform();

        for(var i = 0; i < playDisk.imgSlices.length; i++){
            imgGameGoalDiskBg.imgSlices[i].visible = playDisk.imgSlices[i].visible;
            imgGameGoalDiskBg.imgSlices[i].tint = playDisk.imgSlices[i].tint;
            imgGameGoalDiskBg.imgSlices[i].frameName = playDisk.imgSlices[i].frameName;
            cnt += imgGameGoalDiskBg.imgSlices[i].visible ? 1 : 0;
            playDisk.imgSlices[i].visible = false;
        }
        playDisk.radialTimer.value = 0;
        SceneGame.instance.updateRadialTimer(playDisk.radialTimer, 77, 8);

        var twn = game.add.tween(imgGameGoalDiskBg).to({x: dest.x, y: dest.y, alpha: 0.5, scl: 0.4}, duration, easing, false, 0);
        twn.onComplete.add(function(){

            imgGameGoalDiskBg.visible = false;
            SceneGame.instance.LevelShapeCompleted();
            SceneGame.instance.prepareNextMove();

        }, { });
        twn.start();

        soundManager.playSound('karta_tah');

        return cnt;
    },


    playDiskStilTweening: function(playDisk)
    {
        for(var i = 0; i < playDisk.imgSlices.length; i++)
        {
            if(game.tweens.isTweening(playDisk.imgSlices[i])){
                //LOG('playDiskStilTweening : ' + i);
                return true;
            }

        }

        return false;
    },

    anyPlayDiskStilTweening: function()
    {
        for(var i = 0; i < imgGamePlayDiskBg.length; i++){
            if(this.playDiskStilTweening(imgGamePlayDiskBg[i])){
                //LOG('anyPlayDiskStilTweening : ' + i);
                return true;
            }
        }
        if(game.tweens.isTweening(imgGameGoalDiskBg))
            return true;

        return false;
    },

    explodePlayDisk: function(playDisk, forceExplode)
    {
        if(forceExplode === undefined)
            forceExplode = false;

        noScore = false;

        if(!isLevelOfType(LT_SCORE))
            noScore = true;

        var incTimer = true;
        var cnt = 0;
        var radialTimerValue = 0;
        if(playDisk.hasOwnProperty('radialTimer'))
            radialTimerValue = playDisk.radialTimer.value;

        if(isLevelOfType(LT_SHAPE) && !forceExplode){
            if(SceneGame.instance.isLevelShapeCompleted(playDisk)){
                cnt = SceneGame.instance.movePlayDiskToGoal(playDisk);
            }else{
                incTimer = false;
                if(this.isDiskFull(playDisk))
                    cnt = SceneGame.instance.__explodePlayDisk(playDisk);
            }
        }else{
            cnt = SceneGame.instance.__explodePlayDisk(playDisk)
        }

        if(isLevelOfType(LT_SCORE) && !isLevelOfType(LT_SHAPE) && !((isLevelOfType(LT_DISKS_TIMER) && (radialTimerValue <= 0)))){
            SceneGame.instance.incLevelScore(cnt);
            SceneGame.instance.updateScore();
            textParticles.CreateTextParticle1(playDisk.worldPosition.x, playDisk.worldPosition.y + 10, '+' + cnt, 30, '#F67B3D', 0);
        }

        if(isLevelOfType(LT_TIMER)){
            if(incTimer){
                levelTime += Math.floor(cnt * LEVEL_TIME_SCORE_INC);
                if(levelTime > selectedLevelData.time)
                    levelTime = selectedLevelData.time;
            }
        }

        if(isLevelOfType(LT_DISKS_TIMER)){
            playDisk.radialTimer.value = 0;
            SceneGame.instance.updateRadialTimer(playDisk.radialTimer, 77, 8);
        }

    },

    __explodePlayDisk: function(playDisk)
    {
        soundManager.playSound('explode');

        /*
        var colors = [
            [],
            [0x00776E, 0x007F76, 0x00877E, 0x009086, 0x00A095, 0x00A99D],
            [0xB35F8D, 0xBF6597, 0xCC6CA1, 0xD973AB, 0xF280BF, 0xFF87C9],
            [0x5D25B3, 0x6327BF, 0x6A2ACC, 0x702CD9, 0x7D31F2, 0x8434FF],
            [0x5A6600, 0x606D00, 0x667400, 0x6D7B00, 0x798A00, 0x809100],
            [0x276796, 0x2A6EA0, 0x2D76AA, 0x307DB5, 0x358CCA, 0x3893D5],
            [0x255D36, 0x27633A, 0x2A6A3E, 0x2C7042, 0x317D49, 0x34844D],
            [],
            [],
            [],
            [],
            [0xFF7D33, 0xFFCEB0, 0xFF9659, 0xFF7D33],
            [0xE133FF, 0xF5B3FF, 0xDF5CFF, 0xE133FF],
            [0x007D28, 0xFFF7BA, 0xD62410, 0xD62410, 0xD62410, 0xD62410],
            [0xDEA95F, 0xFF782E, 0xCC6852, 0xFFEA8A, 0xFFEA8A, 0xFFEA8A],
            [0x86B417, 0xFF9659, 0xFF9659, 0x422525, 0x422525, 0x422525],
            [0xC7843B, 0x86B417, 0x99D43D, 0xCEE88C, 0x99D43D, 0xCEE88C],
            [0x86B417, 0xFFCF33, 0xFF7D33, 0xFF3030, 0xB00000],
            [0x006309, 0x007D0C, 0x009E0F, 0x00BF12, 0x35DE45, 0x6EFF7B]
        ];
        */

        var colors = [
            [],
            [0xC3CBA1, 0xD5DDAF, 0xE4EDBC, 0xF4FDC9, 0xF4FDC9, 0xF4FDC9],
            [0x90A76A, 0x9DB573, 0xA8C27B, 0xB1CC81, 0xB1CC81, 0xB1CC81],
            [0x5F9B99, 0x68A9A6, 0x70B5B3, 0x75BFBC, 0x75BFBC, 0x75BFBC],
            [0x1C4A6C, 0x1F5176, 0x21577F, 0x235B85, 0x235B85, 0x235B85],
            [0x9A388B, 0xA73D98, 0xB442A2, 0xBD45AA, 0xBD45AA, 0xBD45AA],
            [0x4F004C, 0x550053, 0x5B0059, 0x60005D, 0x60005D, 0x60005D],
            [0xBB004F, 0xCE0058, 0xDA005E, 0xE50062, 0xE50062, 0xE50062],
            [0xAD8E89, 0xBC9A95, 0xCAA5A0, 0xD5ADA8, 0xD5ADA8, 0xD5ADA8],
            [],
            [],
            [0xFF7D33, 0xFFCEB0, 0xFF9659, 0xFF7D33],
            [0xE133FF, 0xF5B3FF, 0xDF5CFF, 0xE133FF],
            [0x007D28, 0xFFF7BA, 0xD62410, 0xD62410, 0xD62410, 0xD62410],
            [0xDEA95F, 0xFF782E, 0xCC6852, 0xFFEA8A, 0xFFEA8A, 0xFFEA8A],
            [0x86B417, 0xFF9659, 0xFF9659, 0x422525, 0x422525, 0x422525],
            [0xC7843B, 0x86B417, 0x99D43D, 0xCEE88C, 0x99D43D, 0xCEE88C],
            [0x86B417, 0xFFCF33, 0xFF7D33, 0xFF3030, 0xB00000],
            [0x006309, 0x007D0C, 0x009E0F, 0x00BF12, 0x35DE45, 0x6EFF7B]
        ];

        if(playDisk.hasOwnProperty('radialTimer')){
            playDisk.radialTimer.value = 0;
            SceneGame.instance.updateRadialTimer(playDisk.radialTimer, 77, 8);
        }

        var cnt = 0;
        for(var i = 0; i < playDisk.imgSlices.length; i++){
            if(playDisk.imgSlices[i].visible){
                cnt++;
                particles.CreateDiskExplosion( playDisk.worldPosition.x, playDisk.worldPosition.y, colors[playDisk.imgSlices[i].piece], 6);
            }

            if(i < playDisk.imgSlices.length - 1){
                ScenesTransitions.hideSceneAlpha(playDisk.imgSlices[i], 0, 100, function(slice)
                {
                    slice.visible = false;
                    slice.alpha = 1;
                });
            }else{
                ScenesTransitions.hideSceneAlpha(playDisk.imgSlices[i], 0, 100, function(slice)
                {
                    slice.visible = false;
                    slice.alpha = 1;

                    SceneGame.instance.prepareNextMove();
                    SceneGame.instance.UpdateBoosterIcons();

                    if(slice.parent == imgGamePlayerDiskBg)
                        MovingPlayerDisk = false;
                });

            }
        }

        //if(cnt > 0){
        //    ScenesTransitions.shakeScene(grpSceneGame, 2 * cnt, 0, 150);
        //}

        return cnt;
    },

    incLevelScore: function(inc)
    {
        DestLevelScore += inc;
        LevelScoreInc = (DestLevelScore - LevelScore) / 40;
    },

    //#endregion UI STUFF

    //#region BUTTONS CALLBACKS

    OnPressedPlayDisk: function ()
    {
        LOG('OnPressedPlayDisk');

        if (gameRunning === false) return

        var playDisk = SceneGame.instance.getNearestPlayDisk(game.input.x, game.input.y);

        if(OnboardingActive){
            if(playDisk.idx != 0)
                return;

            SceneGame.instance.EndOnboarding();
        }

        if(SelectingDiskForHammer){
            SceneGems.instance.incPlayerGems(-PRICE_BOOSTER_HAMMER);

            SceneGame.instance.explodePlayDisk(playDisk, true);
            SelectingDiskForHammer = false;

            for(var i = 0; i < imgGamePlayDiskBg.length; i++)
                imgGamePlayDiskBg[i].alpha = 1;
            for(var i = 0; i < imgGamePlayerDiskBg.imgSlices.length; i++)
                imgGamePlayerDiskBg.imgSlices[i].alpha = 1;

            ScenesTransitions.hideSceneAlpha(imgGamePlayOverlay);
            SceneGame.instance.UpdateBoosterIcons();
            return;
        }

        SceneGame.instance.movePlayerSlicesToPlayDisk(playDisk);
        //SceneGame.instance.explodePlayDisk(this.button);
    },

    getNearestPlayDisk: function(x, y)
    {
        var dist = 100000000;
        var retVal = null;

        for(var i = 0; i < imgGamePlayDiskBg.length; i++){
            var newDist = Phaser.Math.distanceSq(x, y, imgGamePlayDiskBg[i].worldPosition.x, imgGamePlayDiskBg[i].worldPosition.y);
            if(newDist <= dist){
                dist = newDist;
                retVal = imgGamePlayDiskBg[i];
            }
        }

        return retVal;
    },

    OnPressedBonusLeft: function()
    {
        SelectingDiskForHammer = true;
        imgGamePlayOverlay.tint = 0x000000;
        ScenesTransitions.showSceneAlpha(imgGamePlayOverlay, 0, 500, null, 0.6);

        imgGamePlayOverlay.bringToTop();

        for(var i = 0; i < imgGamePlayDiskBg.length; i++){
            if(SceneGame.instance.isDiskEmpty(imgGamePlayDiskBg[i]))
                imgGamePlayDiskBg[i].alpha = 0.3;
        }
        for(var i = 0; i < imgGamePlayerDiskBg.imgSlices.length; i++)
            imgGamePlayerDiskBg.imgSlices[i].alpha = 0.3;

    },

    OnPressedBonusRight: function()
    {
        SceneGems.instance.incPlayerGems(-PRICE_BOOSTER_FWD);
        SceneGame.instance.UpdateBoosterIcons();

        soundManager.playSound('booster');

        MovingPlayerDisk = true;
        nextMovePrepared = false;

        var duration = 500 / getCpuSpeedMul();
        var easing = Phaser.Easing.Quintic.Out;

        SceneGame.instance.explodePlayDisk(imgGamePlayerDiskBg, true);

        /*
        for(var i = 0; i < imgGamePlayerDiskBg.imgSlices.length; i++){
            //(properties, duration, ease, autoStart, delay, repeat, yoyo)
            var twn = game.add.tween(imgGamePlayerDiskBg.imgSlices[i]).to({alpha: 0}, duration, easing, true, 0);
            if(i == imgGamePlayerDiskBg.imgSlices.length - 1){
                twn.onComplete.addOnce(function(){

                    //SceneGame.instance.prepareNextMove();
                    SceneGame.instance.UpdateBoosterIcons();
                    MovingPlayerDisk = false;
                }, { })
            }
        }
        */

    },

    StartOnboarding: function()
    {
        OnboardingActive = true;
        imgGamePlayOverlay.tint = 0x000000;

        ScenesTransitions.hideSceneAlpha(grpSceneGems, 0, 200);

        ScenesTransitions.showSceneAlpha(imgGamePlayOverlay, 0, 500, null, 0.6);
        ScenesTransitions.showSceneAlpha(imgGamePlayHand, 0, 500, null, 1);

        imgGamePlayHand.offs = 0;
        imgGamePlayHand.tween = game.add.tween(imgGamePlayHand).to({offs: 10}, 500 / getCpuSpeedMul(), Phaser.Easing.Linear.In, true, 0, -1, true);

        imgGamePlayOverlay.bringToTop();

        for(var i = 1; i < imgGamePlayDiskBg.length; i++)
            imgGamePlayDiskBg[i].alpha = 0.3;

    },

    EndOnboarding: function()
    {
        OnboardingActive = false;

        for(var i = 1; i < imgGamePlayDiskBg.length; i++)
            imgGamePlayDiskBg[i].alpha = 1;

        ScenesTransitions.hideSceneAlpha(imgGamePlayOverlay, 0, 300);
        ScenesTransitions.hideSceneAlpha(imgGamePlayHand, 0, 300);

        ScenesTransitions.showSceneAlpha(grpSceneGems, 0, 300);
    },

    OnPressedFromGameToPause: function()
    {
        //SceneGame.instance.LevelFailed();
        //SceneGame.instance.HideStones();
        gameRunning = false;
        gamePaused = true;

        SceneOverlay.instance.ShowAnimated();
        ScenePause.instance.ShowAnimated();

        //SceneNoMoreMoves.instance.ShowAnimated();
        //SceneGameOver.instance.ShowAnimated();

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

    ResumeGame: function()
    {
        gameRunning = true;
        gamePaused = false;
    },

    //#endregion BUTTONS CALLBACKS

    //#region GAME STUFF

    RestartGame: function()
    {
        OnboardingActive = false;

        adinplay_onAdStarted = function(){
            game.paused = false;

            this._RestartGame();

        }.bind(this);
        adinplay_onAdFinished = function() {};

        //PPS_DELETE-STROER
        adinplay_playVideoAd();
        //PPS_DELETE-STROER

        //PPS_USE-STROER
        /*
        adinplay_onAdStarted();
        //PPS_USE-STROER
        */
    },

    _RestartGame: function()
    {
        if(!Levels.hasOwnProperty(selectedLevel)){
            console.error('LevelsData error! Undefined level : ' + selectedLevel);
            return;
        }

        selectedLevelData = Levels[selectedLevel];

        this.ResetLevelTypesData();

        LevelScore = 0;
        DestLevelScore = 0;

        GeneratedMoves = [];
        ShapeCompleted = false;
        MovingPlayerDisk = false;
        SelectingDiskForHammer = false;
        OnboardingActive = false;

        imgGameGoalDiskBg.visible = false;
        for(var i = 0; i < imgGamePlayDiskBg.length; i++){
            imgGamePlayDiskBg[i].alpha = 1;
            imgGamePlayDiskBg[i].warning.alpha = 0;
            imgGamePlayDiskBg[i].radialTimer.value = 0;
        }
        for(var i = 0; i < imgGamePlayerDiskBg.imgSlices.length; i++)
            imgGamePlayerDiskBg.imgSlices[i].alpha = 1;

        nextMovePrepared = false;

        SceneGame.instance.ResetBoosterHammer();
        SceneGame.instance.UpdateBoosterIcons();
        SceneGame.instance.prepareNextMove();
        SceneGame.instance.updateTimerVal();
        SceneGame.instance.updateLevelGoals();
        SceneGame.instance.updateScore();

        gameRunning = true;
        gamePaused = false;

        if(selectedLevelData.hasOwnProperty('onboarding')){
            if(selectedLevelData.onboarding)
                SceneGame.instance.StartOnboarding();
        }

        onGameStart();
    },

    ResetBoosterHammer: function()
    {
        imgGamePlayOverlay.visible = false;
        imgGamePlayOverlay.alpha = 0;
    },

    UpdateBoosterIcons: function()
    {
        btnGameBonusLeft.frameName = 'bt_ham_on.png';
        btnGameBonusLeft.inputEnabled = true;

        var allDisksAreEmpty = true;
        for(var i = 0; i < imgGamePlayDiskBg.length; i++)
            allDisksAreEmpty = allDisksAreEmpty && this.isDiskEmpty(imgGamePlayDiskBg[i]);

        if((btnGameBonusLeft.price > PlayerGems) || allDisksAreEmpty){
            btnGameBonusLeft.frameName = 'bt_ham_off.png';
            btnGameBonusLeft.inputEnabled = false;
        }

        btnGameBonusRight.frameName = 'bt_fwd_on.png';
        btnGameBonusRight.inputEnabled = true;

        if(btnGameBonusRight.price > PlayerGems){
            btnGameBonusRight.frameName = 'bt_fwd_off.png';
            btnGameBonusRight.inputEnabled = false;
        }
    },

    ResetLevelTypesData: function()
    {
        for(var i = 0; i < 6; i++)
            for(var j = 0; j < 6; j++)
            {
                imgGamePlayDiskBg[i].imgSlices[j].visible = false;
                imgGamePlayDiskBg[i].radialTimer.visible = (isLevelOfType(LT_DISKS_TIMER));
            }

        txtGameScoreVal.visible = isLevelOfType(LT_SCORE);
        radialTimerGoal.visible = isLevelOfType(LT_TIMER);

        goalCount = 0;
        if(isLevelOfType(LT_SHAPE))
            goalCount = selectedLevelData.count;

        if(isLevelOfType(LT_TIMER)){
            levelTime = selectedLevelData.time;
            radialTimerGoal.max_value = levelTime;
            radialTimerGoal.value = levelTime;
        }

        if(isLevelOfType(LT_DISKS_TIMER)){

            var time = DISK_TIME;
            if(selectedLevelData.hasOwnProperty('time'))
                time = selectedLevelData.time;

            for(var i = 0; i < 6; i++)
            {
                imgGamePlayDiskBg[i].radialTimer.visible = true;
                imgGamePlayDiskBg[i].radialTimer.value = 0;
                imgGamePlayDiskBg[i].radialTimer.max_value = time;
                SceneGame.instance.updateRadialTimer(imgGamePlayDiskBg[i].radialTimer, 77, 8);
            }

        }

    },

    LevelCleared: function ()
    {
        if(!gameRunning)
            return;

        gameRunning = false;

        soundManager.playSound('win_result');
        SceneOverlay.instance.ShowAnimated();
        SceneGameCleared.instance.ShowAnimated();
    },

    LevelFailed: function(timeOut)
    {
        gameRunning = false;

        if(timeOut === undefined)
            timeOut = false;

        soundManager.playSound('lose_result');
        SceneOverlay.instance.ShowAnimated();
        SceneGameFailed.instance.ShowAnimated(timeOut);
    }

    //#endregion GAME STUFF
};

function onGameStart() {
    console.log('onGameStart');

    //PPS_USE-GAMELOFT
    /*
    gameloft_levelStart();
    //PPS_USE-GAMELOFT
    */

    //PPS_USE-CLOUDGAMES
    /*
    cldapi_play();
    //PPS_USE-CLOUDGAMES
    //*/

    //PPS_USE-GAMEPIX
    /*
    GamePix.gameAction();
    //PPS_USE-GAMEPIX
    */

    //PPS_USE-GAME_DISTRIBUTION
    /*
    if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
        gdsdk.showAd();
    }
    //PPS_USE-GAME_DISTRIBUTION
    */

    //PPS_USE-ARKADIUM
    /*
    ARK_game_arena_connector.fireEventToArena("game_start"); // notify arena that game started
    //PPS_USE-ARKADIUM
    */
}

var GAME_OVER_GAME = 0;
var GAME_OVER_USER = 1;

function onGameOver(lvlEndType) {
    console.log('onGameOver', lvlEndType);

    if (lvlEndType === GAME_OVER_GAME){
        //PPS_USE-GAMELOFT
        /*
        gameloft_levelComplete();
        //PPS_USE-GAMELOFT
        */

        //PPS_USE-ARKADIUM
        /*
        ARK_game_arena_connector.fireEventToArena("game_end"); // notify arena that game ended
        //PPS_USE-ARKADIUM
        */
    } else {
        //PPS_USE-ARKADIUM
        /*
        ARK_game_arena_connector.fireEventToArena("pause_ready");
        //PPS_USE-ARKADIUM
        */
    }

    //PPS_USE-CLOUDGAMES
    /*
    cldapi_gameOver();
    //PPS_USE-CLOUDGAMES
    //*/

    //PPS_USE-GAMEPIX
    /*
    GamePix.gameStop();
    //PPS_USE-GAMEPIX
    */

    //PPS_USE-YANDEX
    /*
    showYandexAd();
    //PPS_USE-YANDEX
    */
}